import models from "../../models/index.js";
import { Op } from "sequelize";
import { timeFormatter } from "./service.js"

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

/**
 * @method POST
 * @description  view orders page
 */
export const getOrders = async (req, res) => {
	try {
		const seller_id = req.seller.id;

		//find shop
		const shop = await models.Shop.findOne({
			where: { seller_id: seller_id }
		})
		if (!shop) {
			return res.send({ status: false, message: "Shop not found" })
		}

		//fetch orders
		const orders = await models.Order.findOne({
			where: { shop_id: shop.id },

			attributes: [
				"id",
				"total_amount"
			],

			include: [
				{
					model: models.User,
					as: "customer",

					attributes: [
						"id",
						"first_name",
						"last_name",
						"profile_image"
					]
				}
			],
			order: [["created_at", "DESC"]]
		})

		return res.send({ status: true, message: "orders fetched successfully", data: orders })
	} catch (error) {
		return res.send({ status: false, message: error.message })
	}
}

/**
 * @method POST
 * @description View and update order status details
 */
export const viewOrderDetails = async (req, res) => {
	try {
		const seller_id = req.seller.id;
		const order_id = req.params.id;

		//check shop exist
		const shop = await models.Shop.findOne({
			where: { seller_id }
		});
		if (!shop) return res.send({ status: false, message: "Shop not found" });

		//check order exist 
		const order = await models.Order.findByPk(order_id);
		if (!order) return res.send({ status: false, message: "Order not found" });

		//fetch details of order
		const orderDetails = await models.Order.findByPk(order_id, {
			attributes: [
				"id",
				"total_amount"
			],

			include: [
				{
					model: models.User,
					as: "customer",

					attributes: [
						'id',
						"first_name",
						"last_name",
						"profile_image"
					]
				},
				{
					model: models.OrderItem,
					as: "orderItems",

					attributes: [
						"product_id",
						"qty"
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

		return res.send({ status: true, message: "order details fetched successfully!!", data: orderDetails });

	} catch (error) {
		return res.send({ status: false, message: error.message })
	}
}

/**
 * @method POST
 * @description update order status details
 */
export const updateOrderStatus = async (req, res) => {
	try {
		const seller_id = req.seller.id;
		const order_id = req.params.id;
		const { order_status, preparation_time } = req.body;

		// validate status
		if (!["approved", "rejected"].includes(order_status)) {
			return res.send({ status: false, message: "Invalid order status" });
		}

		// check seller shop
		const shop = await models.Shop.findOne({
			where: { seller_id }
		});
		if (!shop) return res.send({ status: false, message: "Shop not found" });

		// check order exists
		const order = await models.Order.findOne({

			where: {
				id: order_id,
				shop_id: shop.id
			}

		});
		if (!order) { return res.send({ status: false, message: "Order not found" }) }

		let pickup_start_time = null;
		let pickup_end_time = null;

		if (order_status === "approved") {

			if (!preparation_time) return res.send({ status: false, message: "preparation_time is required" });

			//calculation of pickUpStartTime
			pickup_start_time = timeFormatter(preparation_time);
			//calculation of pickUpEndTime
			pickup_end_time = new Date(pickup_start_time);
			pickup_end_time.setMinutes(pickup_end_time.getMinutes() + 15);  //adding 15 mins default time end time

			// update order status
			await order.update({
				order_status,
				preparation_time,
				pickup_start_time,
				pickup_end_time
			});

			return res.send({ status: true, message: `Order ${order_status} successfully`, data: order });
		}

		await order.update({
			order_status
		});

		return res.send({ status: true, message: `Order Rejected successfully` });

	} catch (error) {
		return res.send({ status: false, message: error.message })
	}
}

/**
 * @method GET
 * @description Orders List
 */
export const ordersList = async (req, res) => {
	try {

		const seller_id = req.seller.id;

		// check shop
		const shop = await models.Shop.findOne({
			where: { seller_id }
		});

		if (!shop) return res.send({ status: false, message: "Shop not found" });

		// fetch orders
		const orders = await models.Order.findAll({
			where: {
				shop_id: shop.id
			},

			attributes: [
				"id",
				"total_amount",
				"pickup_start_time",
				"pickup_end_time",
				"order_status"
			],

			include: [
				{
					model: models.OrderItem,
					as: "orderItems",

					attributes: [
						"id",
						"qty"
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
			],

			order: [
				["created_at", "DESC"]
			]

		});

		// format response
		const formattedOrders = orders.map(order => {

			// total qty
			const totalQty = order.orderItems.reduce(
				(sum, item) => sum + item.qty,
				0
			);

			// pickup timer default
			let pickup_timer = "00:00:00";

			// calculate timer
			if (order.pickup_end_time) {

				const now = new Date();

				const end = new Date(
					order.pickup_end_time
				);

				const diff = end - now;

				// only if future time
				if (diff > 0) {

					const hours = Math.floor(
						diff / (1000 * 60 * 60)
					);

					const minutes = Math.floor(
						(diff % (1000 * 60 * 60))
						/
						(1000 * 60)
					);

					const seconds = Math.floor(
						(diff % (1000 * 60))
						/
						1000
					);

					pickup_timer =
						`${hours
							.toString()
							.padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds
								.toString()
								.padStart(2, "0")}`;
				}
			}

			return {

				id: order.id,

				total_amount:
					order.total_amount,

				total_qty:
					totalQty,

				order_status:
					order.order_status,

				pickup_start_time:
					order.pickup_start_time,

				pickup_end_time:
					order.pickup_end_time,

				pickup_timer,

				orderItems:
					order.orderItems

			};

		});

		return res.send({

			status: true,

			message:
				"Orders fetched successfully",

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
 * @method POST
 * @description update seller profile
 */
export const updateSellerProfile = async (req, res) => {
	try {
		const seller_id = req.seller.id;
		const { first_name, last_name, email } = req.body;

		const seller = await models.User.findByPk(seller_id);
		if (!seller) {
			return res.send({ status: false, message: "Seller not found" });
		}

		// check email uniqueness
		if (email && email !== seller.email) {

			const existingSeller = await models.User.findOne({
				where: { email }
			});

			if (existingSeller) return res.send({ status: false, message: "Email already exists" });
		}

		let imagePath = null;
		if (req.file) {
			imagePath = req.file?.path;
		}

		await seller.update({
			profile_image: imagePath || seller.profile_image,
			first_name: (first_name === "" || first_name === null) ? seller.first_name : first_name,
			last_name: (last_name === "" || last_name === null) ? seller.last_name : last_name,
			email: (email === "" || email === null) ? seller.email : email
		});

		return res.send({ status: true, message: "Profile updated successfully", data: seller });

	} catch (error) {
		return res.send({ status: false, message: error.message })
	}
}

/**
 * @method GET 
 * @description logout seller
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
 * @description Delete seller account
 */
export const deleteAccount = async (req, res) => {
	try {
		const sellerId = req.seller.id;

		const seller = await models.User.findByPk(sellerId);
		if (!seller) return res.send({ status: false, message: "Seller not found" });

		// cascade will handle related data
		await seller.destroy();

		return res.send({ status: true, message: "Seller account deleted successfully" })

	} catch (error) {
		return res.send({ status: false, message: error.message })
	}
}









