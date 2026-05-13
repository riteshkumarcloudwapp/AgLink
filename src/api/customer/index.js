import express from "express";
import validate from "../../utils/validate.js";
import { 
   home, 
   getSubCategory, 
   getVariety, 
   getNearByShops, 
   addToCart, 
   updateCartQty,
   placedOrder,
   confirmPayment
 } from "./controller.js";
import Joi from "joi";
import createMulter from "../../utils/multer.js"
import { authenticateToken } from "../../common/middleware/authenticateToken.js"

const router = express.Router();

//file

router.get(
   '/home',
   authenticateToken,
   home
);

router.get(
   '/get-subcategories/:id',
   getSubCategory
);

router.get(
   '/get-variety/:id',
   getVariety
);

router.get(
   '/get-nearby-shops',
   getNearByShops
);

router.post(
   "/add-to-cart",
   authenticateToken,
   validate(
      Joi.object({
         shop_id: Joi.string().uuid().required(),
         product_id: Joi.string().uuid().required(),
         qty: Joi.number().integer().min(1).required()
      })
   ),
   addToCart
);

router.post(
   "/update-cart/:id",
   authenticateToken,
   validate(
      Joi.object({
         action: Joi.string().valid("increase", "decrease").required()
      }).unknown(true)
   ),
   updateCartQty
);

router.post(
   "/place-order",
   authenticateToken,
   validate(
      Joi.object({
         shop_id: Joi.string().uuid().required(),
         delivery_address: Joi.string().required(),
         payment_method: Joi.string().valid("cod", "online").required()
      })
   ),
   placedOrder
);

router.post(
   "/confirm-payment",
   authenticateToken,
   validate(
      Joi.object({
         order_id: Joi.string().uuid().required(),
         payment_intent_id: Joi.string().required()
      })
   ),
   confirmPayment
);

export default router;