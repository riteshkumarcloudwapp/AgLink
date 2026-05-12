import { DataTypes } from "sequelize";

const Order = (sequelize) => {
  const OrderModel = sequelize.define(
    "Order",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
      },

      customer_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },

      shop_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },

      total_amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },

      delivery_address: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      latitude: {
        type: DataTypes.DECIMAL(10, 8),
        allowNull: true,
      },

      longitude: {
        type: DataTypes.DECIMAL(11, 8),
        allowNull: true,
      },

      payment_method: {
        type: DataTypes.ENUM("cod", "online"),
        allowNull: false,
        defaultValue: "online",
      },

      payment_status: {
        type: DataTypes.ENUM("pending", "paid", "failed"),
        allowNull: false,
        defaultValue: "pending",
      },

      order_status: {
        type: DataTypes.ENUM(
          "pending",
          "accepted",
          "packed",
          "out_for_delivery",
          "delivered",
          "cancelled",
          "rejected"
        ),
        allowNull: false,
        defaultValue: "pending",
      },

      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },

      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "orders",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  // Associations
  OrderModel.associate = (models) => {

    // order belongs to customer
    OrderModel.belongsTo(models.User, {
      foreignKey: "customer_id",
      as: "customer",
      onDelete: "CASCADE",
    });

    // order belongs to shop
    OrderModel.belongsTo(models.Shop, {
      foreignKey: "shop_id",
      as: "shop",
      onDelete: "CASCADE",
    });

  };

  return OrderModel;
};

export default Order;