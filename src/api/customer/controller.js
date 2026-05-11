import models from "../../models/index.js"
import { Op } from "sequelize";
import Sequelize from "sequelize"
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
 * @description Placed order to cart
 */
export const addToCart = async (req, res) => {
    try {
        const customer_id = req.customer.id;
        const { product_id, qty } = req.body;

        // check product exists
        const product = await models.Product.findByPk(product_id);

        if (!product) { return res.send({status: false, message: "Product not found"})}

        //check stock qty
        if( product.stock_qty < qty ){
            return res.send({ status:false, message: "Insufficient stock" })
        }

        // check existing cart item
        const existingCart = await models.CartItem.findOne({
            where: {
                customer_id,
                product_id
            }
        });

          if (existingCart) {return res.send({ status: false, message: "Product already added to cart" })}

        await models.CartItem.create({
            customer_id,
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
 * @description Increase or decrease cart quantity
 */
export const updateCartQty = async (req, res) => {
    try {

        const cart_id = req.params.id;

        const { action } = req.body;

        const cartItem = await models.CartItem.findByPk(cart_id);

        if (!cartItem) {
            return res.send({status: false,message: "Cart item not found"});
        }

        // INCREASE
        if (action === "increase") {

            await cartItem.update({
                qty: cartItem.qty + 1
            });

            return res.send({status: true,message: "Quantity increased successfully"});
        }

        // DECREASE
        if (action === "decrease") {

            // remove cart if qty becomes 0
            if (cartItem.qty <= 1) {

                await cartItem.destroy();

                return res.send({status: true,message: "Item removed from cart"});
            }

            await cartItem.update({
                qty: cartItem.qty - 1
            });

            return res.send({status: true,message: "Quantity decreased successfully"});
        }

        return res.send({status: false,message: "Invalid action"});

    } catch (error) {
        return res.send({status: false,message: error.message});
    }
};