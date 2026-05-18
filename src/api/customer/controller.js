import models from "../../models/index.js"
import { Op } from "sequelize";
import Sequelize from "sequelize"
import stripe from "../../common/config/stripe.js"


/**
 * @method POST
 * @description Home API
 */
export const home = async (req, res) => {
    try {
        const customer_id = req.customer.id;

        const customer = await models.User.findByPk(customer_id, {
            attributes: [
                "id",
                "first_name",
                "last_name",
                "profile_image",
                "address"
            ]
        });

        const categories = await models.Category.findAll({
            where: {
                status: "active"
            },

            attributes: [
                "id",
                "name",
                "icon"
            ],

            order: [["created_at", "DESC"]]
        });

        const bestSellers = await models.Shop.findAll({
            where: {
                status: "Approved",
                rating: {
                    [Op.between]: [4.0, 5.0]
                }
            },

            attributes: [
                "id",
                "shop_name",
                "rating",
            ],

            include: [
                {
                    model: models.User,
                    as: "seller",

                    attributes: [
                        "id",
                        "first_name",
                        "last_name",
                        "profile_image"
                    ]
                }
            ],

            order: [["rating", "DESC"]]

        });


        return res.send({ status: true, message: "Home data fetched successfully", data: { customer, categories, bestSellers } });
    } catch (error) {
        return res.send({ status: false, message: error.message });
    }
}

/**
 * @method POST
 * @description API to get subCategory
 */
export const getSubCategory = async (req, res) => {
    try {
        const category_id = req.params.id;

        const subCategory = await models.SubCategory.findAll({
            where: {
                category_id: category_id,
                status: "active"
            },

            attributes: [
                "id",
                "name",
                "image"
            ],

            order: [["created_at", "DESC"]]
        })

        return res.send({ status: true, message: "subCategory fetched successfully", data: subCategory });
    } catch (error) {
        return res.send({ status: false, message: error.message });
    }
}

/**
 * @method POST
 * @description API to get variety
 */
export const getVariety = async (req, res) => {
    try {
        const sub_category_id = req.params.id;

        const variety = await models.Variety.findAll({
            where: {
                sub_category_id,
                status: "active"
            },

            attributes: [
                "id",
                "name",
                "image"
            ],

            order: [["created_at", "DESC"]]
        })

        return res.send({ status: true, message: "variety fetched successfully", data: variety });
    } catch (error) {
        return res.send({ status: false, message: error.message });
    }
}

/**
 * @method POST
 * @description Nearby Shops 
 */
export const getNearByShops = async (req, res) => {
    try {
        const { latitude, longitude, radius } = req.query;

        const shops = await models.Shop.findAll({

            attributes: {

                include: [
                    [
                        Sequelize.literal(`
                            (
                                6371 * acos(
                                    cos(radians(${latitude}))
                                    * cos(radians(latitude))
                                    * cos(radians(longitude) - radians(${longitude}))
                                    + sin(radians(${latitude}))
                                    * sin(radians(latitude))
                                )
                            )
                        `),
                        "distance"
                    ]
                ]
            },

            where: {
                status: "Approved"
            },

            having: Sequelize.literal(`distance <= ${radius}`),

            order: [
                ["rating", "DESC"],                     // highest rating first
                [Sequelize.literal("distance"), "ASC"] // nearest first
            ]

        });

        return res.send({ status: true, message: "Nearby shops fetched successfully", data: shops });
    } catch (error) {
        return res.send({ status: false, message: error.message });
    }
}

/**
 * @method POST
 * @description Placed product to cart
 */
export const addToCart = async (req, res) => {
    try {
        const customer_id = req.customer.id;
        const { shop_id, product_id, qty } = req.body;

        // check shop exists
        const shop = await models.Shop.findByPk(shop_id);

        if (!shop) {
            return res.send({ status: false, message: "Shop not found" });
        }

        // check product exists
        const product = await models.Product.findByPk(product_id);

        if (!product) { return res.send({ status: false, message: "Product not found" }) }

        //check stock qty
        if (product.stock_qty < qty) {
            return res.send({ status: false, message: "Insufficient stock" })
        }

        // check existing cart item
        const existingCart = await models.CartItem.findOne({
            where: {
                customer_id,
                shop_id,
                product_id
            }
        });

        if (existingCart) { return res.send({ status: false, message: "Product already added to cart" }) }

        await models.CartItem.create({
            customer_id,
            shop_id,
            product_id,
            qty
        });

        return res.send({ status: true, message: "Products added to cart successfully" });
    } catch (error) {
        return res.send({ status: false, message: error.message });
    }
}

/**
 * @method POST
 * @description Increase, decrease and remove cart quantity
 */
export const updateCartQty = async (req, res) => {
    try {

        const cart_id = req.params.id;

        const { action } = req.body;

        const cartItem = await models.CartItem.findByPk(cart_id, {
            include: [
                {
                    model: models.Product,
                    as: "product"
                }
            ]
        });

        if (!cartItem) {
            return res.send({ status: false, message: "Cart item not found" });
        }

        // INCREASE
        if (action === "increase") {

            // stock validation
            if (cartItem.product.stock_qty <= cartItem.qty) {

                return res.send({ status: false, message: "Insufficient stock" });
            }

            await cartItem.update({
                qty: cartItem.qty + 1
            });

            return res.send({ status: true, message: "Quantity increased successfully" });
        }

        // DECREASE
        if (action === "decrease") {

            // remove cart if qty becomes 0
            if (cartItem.qty < 1) {

                await cartItem.destroy();

                return res.send({ status: true, message: "Item removed from cart" });
            }

            await cartItem.update({
                qty: cartItem.qty - 1
            });

            return res.send({ status: true, message: "Quantity decreased successfully" });
        }

        return res.send({ status: false, message: "Invalid action" });

    } catch (error) {
        return res.send({ status: false, message: error.message });
    }
};

/**
 * @method POST
 * @description Placed order
 */
export const placedOrder = async (req, res) => {
    try {
        const customer_id = req.customer.id;
        const { shop_id, delivery_address, payment_method } = req.body;

        //check shop exist or not
        const shop = await models.Shop.findByPk(shop_id);
        if (!shop) return res.send({ status: false, message: "Shop not found" });

        //get cart iteams
        const cartIteams = await models.CartItem.findAll({
            where: { customer_id },

            include: [
                {
                    model: models.Product,
                    as: "product"
                }
            ]
        });

        if (cartIteams.length === 0) return res.send({ status: false, message: "Cart is empty" });

        //check availablity of stocksQty + total amount

        let totalAmount = 0;

        cartIteams.map(iteam => {

            if (iteam.product.stock_qty < iteam.qty) {
                return res.send({ status: false, message: `Insufficient stock for product ${iteam.product.name}` });
            }

            totalAmount += iteam.product.price * iteam.qty;
        });

        console.log("cartIteams----", cartIteams)

        //COD
        if (payment_method === "cod") {
            //create order
            const order = await models.Order.create({
                customer_id,
                shop_id,
                total_amount: totalAmount,
                delivery_address,
                payment_method
            });

            const orderItemsData = cartIteams.map(item => ({
                order_id: order.id,
                product_id: item.product_id,
                qty: item.qty,
                price: item.product.price,
                sub_total: item.qty * item.product.price
            }));

            await models.OrderItem.bulkCreate(orderItemsData);

            //empty the cart
            await models.CartItem.destroy({
                where: { customer_id }
            })

            return res.send({ status: true, message: "Order placed successfully", data: order });
        }

        //ONLINE
        if (payment_method === "online") {
            // create stripe payment Intent
            const paymentIntent = await stripe.paymentIntents.create({
                amount: totalAmount,
                currency: "usd",
                metadata: {
                    customer_id,
                    shop_id,
                    delivery_address
                },
            });

            //create order
            const order = await models.Order.create({
                customer_id: customer_id,
                shop_id: shop_id,
                total_amount: totalAmount,
                delivery_address: delivery_address,
                payment_method: "online",
                payment_status: "pending",
                order_status: "pending",
            });

            return res.send({
                status: true,
                message: "Payment initiated",
                client_secret: paymentIntent.client_secret,
                order_id: order.id
            });

        }

        return res.send({ status: false, message: "Invalid payment method" });

    } catch (error) {
        return res.send({ status: false, message: error.message });
    }
};

/**
 * @method POST
 * @description confirm payment Online stripe
 */
export const confirmPayment = async (req, res) => {
    try {


    } catch (error) {
        return res.send({ status: false, message: error.message });
    }
};

/**
 * @method GET
 * @description Customer My Orders List
 */
export const myOrdersList = async (req, res) => {
    try {

        const customer_id = req.customer.id;

        // fetch orders
        const orders = await models.Order.findAll({

            where: { customer_id },

            attributes: [
                "id",
                "total_amount",
                "order_status",
                "pickup_start_time",
                "pickup_end_time",
                "created_at"
            ],

            include: [

                {
                    model: models.Shop,
                    as: "shop",

                    attributes: [
                        "id",
                        "shop_name",
                        "image",
                        "address",
                        "latitude",
                        "longitude"
                    ]
                }

            ],

            order: [
                ["created_at", "DESC"]
            ]

        });

        // format response
        const formattedOrders = orders.map(order => {

            let pickup_time = null;

            if (order.pickup_start_time) {

                const start = new Date(order.pickup_start_time);

                const now = new Date();

                const diff = start - now;

                if (diff > 0) {

                    const hours = Math.floor(diff / (1000 * 60 * 60));

                    const minutes = Math.floor(
                        (diff % (1000 * 60 * 60)) / (1000 * 60)
                    );

                    pickup_time = `${hours} Hr ${minutes} Min`;
                }
            }

            return {

                id: order.id,

                total_amount: order.total_amount,

                order_status: order.order_status,

                pickup_time,

                shop: order.shop
            };

        });

        return res.send({
            status: true,
            message: "My orders fetched successfully",
            data: formattedOrders
        });

    } catch (error) {

        return res.send({
            status: false,
            message: error.message
        });

    }
};

/**
 * @method GET
 * @description View Order Details
 */
export const viewOrderDetails = async (req, res) => {
    try {

        const customer_id = req.customer.id;

        const order_id = req.params.id;

        // check order
        const order = await models.Order.findOne({

            where: {
                id: order_id,
                customer_id
            },

            attributes: [
                "id",
                "total_amount",
                "order_status",
                "pickup_start_time",
                "pickup_end_time"
            ],

            include: [

                {
                    model: models.Shop,
                    as: "shop",

                    attributes: [
                        "id",
                        "shop_name",
                        "image",
                        "address",
                        "phone"
                    ]
                },

                {
                    model: models.OrderItem,
                    as: "orderItems",

                    attributes: [
                        "id",
                        "qty",
                        "price",
                        "sub_total"
                    ],

                    include: [

                        {
                            model: models.Product,
                            as: "product",

                            attributes: [
                                "id",
                                "price",
                                "unit"
                            ],

                            include: [

                                {
                                    model: models.Variety,
                                    as: "variety",

                                    attributes: [
                                        "id",
                                        "name",
                                        "image"
                                    ]
                                }

                            ]
                        }

                    ]
                }

            ]

        });

        if (!order) {
            return res.send({
                status: false,
                message: "Order not found"
            });
        }

        return res.send({
            status: true,
            message: "Order details fetched successfully",
            data: order
        });

    } catch (error) {

        return res.send({
            status: false,
            message: error.message
        });

    }
};

/**
 * @method POST
 * @description update customer profile
 */
export const updateCustomerProfile = async (req, res) => {
    try {
        const customer_id = req.customer.id;
        const { first_name, last_name, email } = req.body;

        const customer = await models.User.findByPk(customer_id);
        if (!customer) {
            return res.send({ status: false, message: "Customer not found" });
        }

        // check email uniqueness
        if (email && email !== customer.email) {

            const existingCustomer = await models.User.findOne({
                where: { email }
            });

            if (existingCustomer) return res.send({ status: false, message: "Email already exists" });
        }

        let imagePath = null;
        if (req.file) {
            imagePath = req.file?.path;
        }

        await customer.update({
            profile_image: imagePath || customer.profile_image,
            first_name: (first_name === "" || first_name === null) ? customer.first_name : first_name,
            last_name: (last_name === "" || last_name === null) ? customer.last_name : last_name,
            email: (email === "" || email === null) ? customer.email : email
        });

        return res.send({ status: true, message: "Profile updated successfully", data: customer });

    } catch (error) {
        return res.send({ status: false, message: error.message })
    }
}

/**
 * @method GET 
 * @description logout customer
 */
export const logout = async (req, res) => {
    try {
        return res.send({ status: true, message: "Seller logout successful" });
    } catch (error) {
        return res.send({ status: false, message: error.message })
    }
}

/**
 * @method POST
 * @description Delete customer account
 */
export const deleteAccount = async (req, res) => {
    try {
        const customerId = req.customer.id;

        const customer = await models.User.findByPk(customerId);
        if (!customer) return res.send({ status: false, message: "Customer not found" });

        // cascade will handle related data
        await customer.destroy();

        return res.send({ status: true, message: "Customer account deleted successfully" })

    } catch (error) {
        return res.send({ status: false, message: error.message })
    }
}

