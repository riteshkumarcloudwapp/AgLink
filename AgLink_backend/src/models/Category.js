import { DataTypes } from "sequelize";

const Category = (sequelize) => {
    const CategoryModel = sequelize.define(
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

    //association
    CategoryModel.associate = (models) => {

        //category has many subcategory
        CategoryModel.hasMany(models.SubCategory, {
            foreignKey: "category_id",
            as: "subCategories",
            onDelete: "CASCADE"
        });

        //category has many products
        CategoryModel.hasMany(models.Product, {
            foreignKey: "category_id",
            as: "products",
            onDelete: "CASCADE"
        });
    }

    return CategoryModel;

};


export default Category;