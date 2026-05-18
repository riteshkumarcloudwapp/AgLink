import models from "../../models/index.js"

export const getAssignedOrders = async (req, res) => {
  try {

    const delivery_boy_id = req.deliveryBoy.id;

    const orders = await models.Order.findAll({
      where: {
        delivery_boy_id
      },

      include: [
        {
          model: models.Customer,
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

      order: [["createdAt", "DESC"]]
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

export const acceptOrder = async (req, res) => {
  try {

    const order_id = req.params.id;

    const order = await models.Order.findByPk(order_id);

    if (!order) {
      return res.send({
        status: false,
        message: "Order not found"
      });
    }

    await order.update({
      order_status: "assigned"
    });

    return res.send({
      status: true,
      message: "Order accepted successfully"
    });

  } catch (error) {

    return res.send({
      status: false,
      message: error.message
    });

  }
};

export const pickupOrder = async (req, res) => {
  try {

    const order_id = req.params.id;

    const order = await models.Order.findByPk(order_id);

    if (!order) {
      return res.send({
        status: false,
        message: "Order not found"
      });
    }

    await order.update({
      order_status: "picked_up",
      pickedup_at: new Date()
    });

    return res.send({
      status: true,
      message: "Order picked successfully"
    });

  } catch (error) {

    return res.send({
      status: false,
      message: error.message
    });

  }
};

export const outForDelivery = async (req, res) => {
  try {

    const order_id = req.params.id;

    const order = await models.Order.findByPk(order_id);

    if (!order) {
      return res.send({
        status: false,
        message: "Order not found"
      });
    }

    await order.update({
      order_status: "out_for_delivery"
    });

    return res.send({
      status: true,
      message: "Order is out for delivery"
    });

  } catch (error) {

    return res.send({
      status: false,
      message: error.message
    });

  }
};

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

    if (!order) {
      return res.send({
        status: false,
        message: "Order not found"
      });
    }

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
      delivered_at: new Date()
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

export const toggleAvailability = async (req, res) => {
  try {

    const delivery_boy_id = req.deliveryBoy.id;

    const { is_available } = req.body;

    await models.DeliveryBoy.update(
      {
        is_available
      },
      {
        where: {
          id: delivery_boy_id
        }
      }
    );

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