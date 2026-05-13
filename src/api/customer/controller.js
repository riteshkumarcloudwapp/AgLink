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

        const cartItem = await models.CartItem.findByPk({
            where: {
                id: cart.id,
                customer_id
            },

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
            if (cartItem.qty <= 1) {

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

            //create order Iteams   //cartIteams is an array
            for (const item of cartIteams) {

                await models.OrderItem.create({
                    order_id: order.id,
                    product_id: item.product_id,
                    qty: item.qty,
                    price: item.product.price,
                    sub_total: item.qty * item.product.price
                });
            }

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

