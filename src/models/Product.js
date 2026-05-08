import { DataTypes } from "sequelize";

const Product = (sequelize) => {
  const ProductModel = sequelize.define(
    "Product",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
      },

      seller_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },

      category_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },

      sub_category_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },

      varieties_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },

      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },

      stock_qty: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },

      unit: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      status: {
        type: DataTypes.ENUM("active", "inactive"),
        allowNull: false,
        defaultValue: "active",
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
      tableName: "products",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  // Associations
  ProductModel.associate = (models) => {

    ProductModel.belongsTo(models.Category, {
      foreignKey: "category_id",
      as: "category",
    });

    ProductModel.belongsTo(models.SubCategory, {
      foreignKey: "sub_category_id",
      as: "sub_category",
    });

    ProductModel.belongsTo(models.Variety, {
      foreignKey: "varieties_id",
      as: "variety",
    });

  };

  return ProductModel;
};

export default Product;