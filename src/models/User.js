import { DataTypes } from "sequelize";

const User = (sequelize) => {
  const UserModel = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4
    },

    first_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    last_name: {
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

    phone_number: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    password: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    profile_image: {
      type: DataTypes.TEXT,
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

    role: {
      type: DataTypes.ENUM("admin", "customer", "seller"),
      defaultValue: "customer",
    },

    rating: {
      type: DataTypes.DECIMAL(2, 1),
      defaultValue: 0,
    },

    otp: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    expiry_time: {
      type: DataTypes.STRING, // matches your knex (but not ideal)
      allowNull: true,
    },

    last_sent_at: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    is_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    status: {
      type: DataTypes.ENUM("block", "unblock"),
      defaultValue: "unblock",
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
    tableName: "users",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
)
  return UserModel;
};

export default User;