import express from "express";
import {addCategory, editCategory, getAllCategory, deleteCategory} from "./controller.js";
import validate from "../../../utils/validate.js";
import createMulter from "../../../utils/multer.js";
import Joi from "joi";

const router = express.Router();

//file
const categoryIcon = createMulter("Category");

router.post(
  '/add-category', 
   categoryIcon.single("icon"),
   validate(
   Joi.object({
      name : Joi.string().trim().required(),
    })
  ), 
  addCategory
);

router.post(
  '/edit-category/:id', 
   categoryIcon.single("icon"),
   validate(
   Joi.object({
      name : Joi.string().trim().allow(null, ""),
      id   : Joi.string().uuid().required()
    })
  ), 
  editCategory
);

router.get(
  '/get-category', 
   getAllCategory
);

router.post(
  '/delete-category/:id', 
   deleteCategory
);


export default router;