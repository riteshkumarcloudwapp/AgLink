import { DataTypes } from "sequelize";

const Category = (sequelize) => {
  return sequelize.define(
    "Category",
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

      icon: {
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
      tableName: "categorys", 
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
};

//association
Category.associate = (models) => {

  //category has many subcategory
    Category.hasMany(models.SubCategory, {
        foreignKey :  "category_id",
        as         :  "sub_categorys",
        onDelete   :  "CASCADE"
    })

}

export default Category;