import { Sequelize } from "sequelize";
import dbConfig from "../common/config/db.js";

import User from "./User.js"
import Category from "./Category.js"
import SubCategory from "./SubCategory.js"
import Variety from "./Variety.js";
import Product from "./Product.js";
import Shop from "./Shop.js";
import CartItem from "./CartItem.js";
import Order from "./Order.js";
import OrderItem from "./OrderItem.js"; 

const sequelize = new Sequelize(dbConfig.url, {
  ...dbConfig,
});

const models = {
  User             : User(sequelize, Sequelize.DataTypes),
  Category         : Category(sequelize, Sequelize.DataTypes),
  SubCategory      : SubCategory(sequelize, Sequelize.DataTypes),
  Variety          : Variety(sequelize, Sequelize.DataTypes),
  Product          : Product(sequelize, Sequelize.DataTypes),
  Shop             : Shop(sequelize, Sequelize.DataTypes),
  CartItem         : CartItem(sequelize, Sequelize.DataTypes),
  Order            : Order(sequelize, Sequelize.DataTypes),
  OrderItem        : OrderItem(sequelize, Sequelize.DataTypes)

};

// Setup associations
Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;

export default models;