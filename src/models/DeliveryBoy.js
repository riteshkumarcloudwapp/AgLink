import { DataTypes } from "sequelize";

const DeliveryBoy = (sequelize) => {
  const DeliveryBoyModel = sequelize.define(
    "DeliveryBoy",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
      },

      name: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      email: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      country_code: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      phone: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      profile_image: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      address: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      latitude: {
        type: DataTypes.DECIMAL(10, 8),
        allowNull: true,
      },

      longitude: {
        type: DataTypes.DECIMAL(11, 8),
        allowNull: true,
      },

      vehicle_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      vehicle_number: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      otp: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      expiry_time: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      status: {
        type: DataTypes.ENUM("available", "unavailable"),
        allowNull: false,
        defaultValue: "available",
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
      tableName: "delivery_boys",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  // Associations
  DeliveryBoyModel.associate = (models) => {

    // delivery boy has many orders
    DeliveryBoyModel.hasMany(models.Order, {
      foreignKey: "delivery_boy_id",
      as: "orders",
    });

  };

  return DeliveryBoyModel;
};

export default DeliveryBoy;