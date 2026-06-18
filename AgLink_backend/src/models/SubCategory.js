import { DataTypes } from "sequelize";

const SubCategory = (sequelize) => {
    const SubCategoryModel = sequelize.define(
        "SubCategory",
        {
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
                allowNull: false,
                defaultValue: DataTypes.UUIDV4,
            },

            category_id: {
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
            tableName: "sub_categorys",
            timestamps: true,
            createdAt: "created_at",
            updatedAt: "updated_at",
        }
    );


    //association
    SubCategoryModel.associate = (models) => {

        //subcategory belongs to category
        SubCategoryModel.belongsTo(models.Category, {
            foreignKey: "category_id",
            as: "category",
        });

        //subcategory has many varieties
        SubCategoryModel.hasMany(models.Variety, {
            foreignKey: "sub_category_id",
            as: "varieties",
            onDelete: "CASCADE"
        });

        //subcategory has many products
        SubCategoryModel.hasMany(models.Product, {
            foreignKey: "sub_category_id",
            as: "products",
            onDelete: "CASCADE"
        });

    }

    return SubCategoryModel;
};

export default SubCategory;