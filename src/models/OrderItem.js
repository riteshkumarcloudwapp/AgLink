import { DataTypes } from "sequelize";

const OrderItem = (sequelize) => {
  const OrderItemModel = sequelize.define(
    "OrderItem",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
      },

      order_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },

      product_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },

      qty: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },

      sub_total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
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
      tableName: "order_items",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  // Associations
  OrderItemModel.associate = (models) => {

    // order item belongs to order
    OrderItemModel.belongsTo(models.Order, {
      foreignKey: "order_id",
      as: "order",
      onDelete: "CASCADE",
    });

    // order item belongs to product
    OrderItemModel.belongsTo(models.Product, {
      foreignKey: "product_id",
      as: "product",
      onDelete: "CASCADE",
    });

  };

  return OrderItemModel;
};

export default OrderItem;