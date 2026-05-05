import { DataTypes } from "sequelize";

const SubCategory = (sequelize) => {
  return sequelize.define(
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
};

//association
SubCategory.associate = (models) => {

    //subcategory belongs to category
    SubCategory.belongsTo(models.categorys, {
        foreignKey :  "category_id",
        as         :  "category",
        onDelete   :  "CASCADE"
    })

    //subcategory has many varieties
    SubCategory.hasMany(models.Variety, {
        foreignKey :  "sub_category_id",
        as         :   "variety",
        onDelete   :  "CASCADE"
    })

}

export default SubCategory;