import models from "../../models/index.js";
import { Op } from "sequelize";

/**
 * @method POST
 * @description Shop Registration
 */
export const createShop = async (req, res) => {
	try {
		const seller_id = req.seller.id;
		const { shop_name, shop_keeper_name, email, phone, address, latitude, longitude } = req.body;

		const existedShop = await models.Shop.findOne({
			where: {
				[Op.and]: [{ seller_id }, { email }, { phone }]
			}
		});
		if (existedShop) {
			return res.send({ status: false, message: "Shop already exist" })
		}

		if (!req.file) {
			return res.send({ status: false, message: "Image is required" })
		}

		await models.Shop.create({
			seller_id,
			shop_name,
			shop_keeper_name,
			email,
			phone,
			address,
			latitude,
			longitude,
			image: req.file?.path
		});

		return res.send({ status: true, message: "Application submitted for Verification" });
	} catch (error) {
		return res.send({ status: false, message: error.message })
	}
}

/**
 * @method POST
 * @description create Product
 */
export const createProduct = async (req, res) => {
	try {
		const seller_id = req.seller.id;
		const { category_id, sub_category_id, varieties_id, price, stock_qty, unit } = req.body;

		const product = await models.Product.findOne({
			where: {
				[Op.and]: [{ category_id }, { sub_category_id }, { varieties_id }]
			}
		});

		if (product) {
			return res.send({ status: false, message: "Product already exist" });
		}

		await models.Product.create({
			seller_id,
			category_id,
			sub_category_id,
			varieties_id,
			price,
			stock_qty,
			unit
		})

		return res.send({ status: true, message: "Product added successfully" });
	} catch (error) {
		return res.send({ status: false, message: error.message })
	}
}

/**
 * @method POST
 * @description Manage home api
 */
export const home = async (req, res) => {
	try {
		const seller_id = req.seller.id;

		// seller data
		const seller = await models.User.findByPk(seller_id, {
			attributes: [
				"id",
				"first_name",
				"last_name",
				"profile_image",
				"address"
			]
		});
		if (!seller) {
			return res.send({ status: false, message: "Seller not found" })
		}

		//nested category data
		const categories = await models.Category.findAll({
			where: { status: "active" },
			attributes: [
				"id",
				"name",
				"icon"
			],

			include: [
				{
					model: models.SubCategory,
					as: "subCategories",

					attributes: [
						"id",
						"name",
						"image"
					],

					where: { status: "active" },
					required: false,

					include: [
						{
							model: models.Variety,
							as: "varieties",

							attributes: [
								"id",
								"name",
								"image"
							],

							where: { status: "active" },
							required: false,

							include: [
								{
									model: models.Product,
									as: "products",

									attributes: [
										"stock_qty"
									]
								},
							]
						}
					]
				}
			],

			order: [["created_at", "DESC"]]
		}
		);

		const totalStockCount = await models.Product.sum("stock_qty", {
			where: { status: "active" },
		})

		return res.send({
			status: true,
			message: "Home data fetched successfully",
			data: {
				seller,
				categories,
				totalStockCount
			}
		});

	} catch (error) {
		return res.send({ status: false, message: error.message })
	}
}

/**
 * @method POST
 * @description  Quantity update — Add or Remove stock
 */
export const stockUpdate = async (req, res) => {
	try {
		const product_id = req.params.id;
		const { stock_qty, action } = req.body;  //status can be add and remove

		// Validate action
		if (!["add", "remove"].includes(action)) {
			return res.send({ status: false, message: "Action must be 'add' or 'remove'" });
		}

		const product = await models.Product.findByPk(product_id);
		if (!product) {
			return res.send({ status: false, message: "Product not found" });
		}

		if (action === "add") {
			await product.update({
				stock_qty,
			})

			return res.send({ status: true, message: "Stock updated successfully" });
		}

		await product.destroy();

		return res.send({ status: true, message: "Stock removed successfully" });

	} catch (error) {
		return res.send({ status: false, message: error.message })
	}
}




