import models from "../../models/index.js"
import { token, generateOtp, expiryTime } from "./service.js"
import sendEmailOtp from "../../utils/sendEmailOtp.js";

/**
 * @method POST
 * @description Delivery boy signup
 */
export const deliveryBoySignup = async (req, res) => {
  try {

    const { name, email, country_code, phone, address, vehicle_name, vehicle_number } = req.body;

    // CHECK DELIVERY BOY EXISTS
    const existingDeliveryBoy = await models.DeliveryBoy.findOne({
      where: { email, phone }
    });

    if (existingDeliveryBoy) return res.send({ status: false, message: "Delivery boy with this email or phone number already exists" });

    if (!req.file) {
      return res.send({ status: false, message: "Profile image is required" });
    }

    // CREATE DELIVERY BOY
    await models.DeliveryBoy.create({
      name,
      email,
      country_code,
      phone,
      address,
      vehicle_name,
      vehicle_number,
      profile_image: req.file?.path
    });

    return res.send({
      status: true,
      message: "Delivery boy registered successfully",
    });

  } catch (error) {
    return res.send({ status: false, message: error.message });
  }
};

/**
 * @method POST
 * @description Delivery boy login
 */
export const deliveryBoyLogin = async (req, res) => {
  try {

    const { email, latitude, longitude } = req.body;

    // CHECK DELIVERY BOY
    const deliveryBoy = await models.DeliveryBoy.findOne({
      where: { email }
    });

    if (!deliveryBoy) return res.send({ status: false, message: "Delivery boy not found" });

    const otp = generateOtp();
    const otpExpiryTime = expiryTime();

    // Delivery boys are identified by phone and do not have an email address in this model,
    // so skip sending an email if no valid recipient address exists.
    if (deliveryBoy.email) {
      await sendEmailOtp(
        deliveryBoy.email,
        "Verify Your Email - AgLink App",
        "email_verification",
        {
          name: deliveryBoy.name,
          otp,
          year: new Date().getFullYear(),
        }
      );
    }

    await deliveryBoy.update({
      otp,
      expiry_time: otpExpiryTime,
      latitude,
      longitude
    })

    return res.send({
      status: true,
      message: "Login Otp send successfully",
      otp: otp
    });

  } catch (error) {
    return res.send({ status: false, message: error.message });
  }
};

/**
 * @method POST
 * @description Verify delivery boy login OTP
 */
export const verifyDeliveryBoyOtp = async (req, res) => {
  try {

    const { email, otp } = req.body;

    // FIND DELIVERY BOY
    const deliveryBoy = await models.DeliveryBoy.findOne({
      where: {
        email
      }
    });

    if (!deliveryBoy) return res.send({ status: false, message: "Delivery boy not found" });

    // CHECK OTP
    if (deliveryBoy.otp != otp) {
      return res.send({ status: false, message: "Invalid OTP" });
    }

    // CHECK EXPIRY
    if (deliveryBoy.expiry_time < Math.floor(Date.now() / 1000)) {
      return res.send({ status: false, message: "OTP expired" });
    }

    // GENERATE TOKEN
    const jwtToken = token(deliveryBoy);

    // CLEAR OTP
    await deliveryBoy.update({
      otp: null,
      expiry_time: null
    });

    return res.send({
      status: true,
      message: "Login successfully",
      token: jwtToken,
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
 * @description Get Assigned orders
 */
export const getAssignedOrders = async (req, res) => {
  try {

    const delivery_boy_id = req.deliveryBoy.id;

    const orders = await models.Order.findAll({
      where: {
        delivery_boy_id
      },

      include: [
        {
          model: models.User,
          as: "customer"
        },
        {
          model: models.OrderItem,
          as: "orderItems",
          include: [
            {
              model: models.Product,
              as: "product"
            }
          ]
        }
      ],

      order: [["created_at", "DESC"]]
    });

    return res.send({
      status: true,
      data: orders
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
 * @description to show orders list
 */
export const acceptOrder = async (req, res) => {
  try {

    const order_id = req.params.id;

    const order = await models.Order.findByPk(order_id);

    if (!order) return res.send({ status: false, message: "Order not found" });

    await order.update({
      order_status: "assigned"
    });

    return res.send({ status: true, message: "Order accepted successfully" });

  } catch (error) {
    return res.send({ status: false, message: error.message });
  }
};

/**
 * @method POST
 * @description pickup order
 */
export const pickupOrder = async (req, res) => {
  try {

    const order_id = req.params.id;

    const order = await models.Order.findByPk(order_id);

    if (!order) return res.send({ status: false, message: "Order not found" });

    await order.update({
      order_status: "picked_up",
    });

    return res.send({ status: true, message: "Order picked successfully" });

  } catch (error) {

    return res.send({ status: false, message: error.message });

  }
};

/**
 * @method POST
 * @description mark order as out for delivery
 */
export const outForDelivery = async (req, res) => {
  try {

    const order_id = req.params.id;

    const order = await models.Order.findByPk(order_id);

    if (!order) return res.send({ status: false, message: "Order not found" });

    await order.update({
      order_status: "out_for_delivery"
    });

    return res.send({ status: true, message: "Order is out for delivery" });

  } catch (error) {

    return res.send({ status: false, message: error.message });

  }
};

/**
 * @method POST
 * @description verify delivery OTP
 */
export const verifyDeliveryOtp = async (req, res) => {
  try {

    const delivery_boy_id = req.deliveryBoy.id;

    const { order_id, otp } = req.body;

    const order = await models.Order.findOne({
      where: {
        id: order_id,
        delivery_boy_id
      }
    });

    if (!order) return res.send({ status: false, message: "Order not found" });

    if (String(order.delivery_otp) !== String(otp)) {
      return res.send({
        status: false,
        message: "Invalid OTP"
      });
    }

    await order.update({
      otp_verified: true,
      payment_status: "paid",
      order_status: "delivered",
      delivery_otp: null,
      delivery_otp_expiry: null
    });

    return res.send({
      status: true,
      message: "Order delivered successfully"
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
 * @description toggle availability
 */
export const toggleAvailability = async (req, res) => {
  try {

    const delivery_boy_id = req.deliveryBoy.id;

    const { is_available } = req.body;

    const deliveryBoy = await models.DeliveryBoy.findByPk(delivery_boy_id);

    if (!deliveryBoy) return res.send({ status: false, message: "Delivery boy not found" });

    await deliveryBoy.update({
      status: is_available ? "available" : "unavailable"
    });

    return res.send({
      status: true,
      message: "Availability updated"
    });

  } catch (error) {

    return res.send({
      status: false,
      message: error.message
    });

  }
};