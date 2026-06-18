import express from "express";
import {
  addCategory, 
  editCategory, 
  getAllCategory, 
  deleteCategory,
  addSubCategory,
  editSubCategory,
  getAllSubCategory,
  deleteSubCategory,
  addVarieties,
  editVarieties,
  getAllVarieties,
  deleteVarieties
} from "./controller.js";
import validate from "../../../utils/validate.js";
import createMulter from "../../../utils/multer.js";
import Joi from "joi";

const router = express.Router();

//file
const categoryIcon = createMulter("Category");
const subCategoryImage = createMulter("subCategory");
const varietyImage = createMulter("variety");

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
    }).unknown(true)
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


router.post(
  '/add-subCategory', 
   subCategoryImage.single("image"),
   validate(
   Joi.object({
      name          : Joi.string().trim().required(),
      category_id   : Joi.string().uuid().required()
    })
  ), 
  addSubCategory,
);

router.post(
  '/edit-subCategory/:id', 
   subCategoryImage.single("image"),
   validate(
   Joi.object({
      name : Joi.string().trim().allow(null, ""),
    }).unknown(true)
  ), 
  editSubCategory
);

router.get(
  '/get-subCategory', 
   getAllSubCategory
);

router.post(
  '/delete-subCategory/:id', 
   deleteSubCategory
);


router.post(
  '/add-variety', 
   varietyImage.single("image"),
   validate(
   Joi.object({
      name              : Joi.string().trim().required(),
      sub_category_id   : Joi.string().uuid().required()
    })
  ), 
  addVarieties,
);

router.post(
  '/edit-variety/:id', 
   varietyImage.single("image"),
   validate(
   Joi.object({
      name : Joi.string().trim().allow(null, ""),
    }).unknown(true)
  ), 
  editVarieties
);

router.get(
  '/get-variety', 
   getAllVarieties
);

router.post(
  '/delete-variety/:id', 
   deleteVarieties
);


export default router;