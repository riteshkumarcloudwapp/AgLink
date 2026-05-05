import { DataTypes } from "sequelize";

const Product = (sequelize) => {
 return sequelize.define(
    "Product",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
      },

      variety_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },

      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },

      unit: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      stock_qty: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },

      status: {
        type: DataTypes.ENUM("active", "inactive"),
        defaultValue: "active",
      },

      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },

      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "products",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  )
};


//Associations
Product.associate = (models) => {

    Product.belongsTo(models.Variety, {
      foreignKey: "variety_id",
      as: "variety",
      onDelete: "CASCADE",
    });
    
};


export default Product;