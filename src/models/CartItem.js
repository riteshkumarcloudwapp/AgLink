import { DataTypes } from "sequelize";

const CartItem = (sequelize) => {
  const CartItemModel = sequelize.define(
    "CartItem",
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

      product_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },

      qty: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
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
      tableName: "cart_items",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  // Associations
  CartItemModel.associate = (models) => {

    // cart item belongs to customer
    CartItemModel.belongsTo(models.User, {
      foreignKey: "customer_id",
      as: "customer",
    });

    // cart item belongs to product
    CartItemModel.belongsTo(models.Product, {
      foreignKey: "product_id",
      as: "product",
    });

  };

  return CartItemModel;
};

export default CartItem;