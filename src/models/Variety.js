import { DataTypes } from "sequelize";

const Variety = (sequelize) => {
  return sequelize.define(
    "Variety",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
      },

      sub_category_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },

      name: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      image: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      status: {
        type: DataTypes.ENUM("active", "inactive"),
        allowNull: false,
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
      tableName: "varieties",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

};

//Associations
  Variety.associate = (models) => {

    //variety belongs to subcategory
    Variety.belongsTo(models.SubCategory, {
      foreignKey: "sub_category_id",
      as: "sub_category",
      onDelete: "CASCADE",
    });

    //variety has many products
    Variety.hasMany(models.Product, {
      foreignKey: "variety_id",
      as: "products",
      onDelete: "CASCADE",
    });

  };

export default Variety;