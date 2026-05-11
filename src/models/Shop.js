import { DataTypes } from "sequelize";

const Shop = (sequelize) => {
  const ShopModel = sequelize.define(
    "Shop",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4
      },

      seller_id: {
        type: DataTypes.UUID,
        allowNull: false
      },

      shop_name: {
        type: DataTypes.STRING,
        allowNull: true
      },

      shop_keeper_name: {
        type: DataTypes.STRING,
        allowNull: true
      },

      image: {
        type: DataTypes.STRING,
        allowNull: true
      },

      email: {
        type: DataTypes.STRING,
        allowNull: true
      },

      phone: {
        type: DataTypes.STRING,
        allowNull: true
      },

      address: {
        type: DataTypes.STRING,
        allowNull: true
      },

      latitude: {
        type: DataTypes.DECIMAL(10, 8),
        allowNull: true
      },

      longitude: {
        type: DataTypes.DECIMAL(11, 8),
        allowNull: true
      },

      rating: {
        type: DataTypes.DECIMAL(2, 1),
        defaultValue: 0,
      },

      status: {
        type: DataTypes.ENUM("Approved", "Pending", "Rejected"),
        defaultValue: "Pending"
      },

      rejected_reason: {
        type: DataTypes.STRING,
        allowNull: true
      },

      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      },

      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      }
    },
    {
      tableName: "shops",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  );


  // Associations
  ShopModel.associate = (models) => {

    ShopModel.belongsTo(models.User, {
      foreignKey: "seller_id",
      as: "seller",
    });


  };

  return ShopModel;
};


export default Shop;