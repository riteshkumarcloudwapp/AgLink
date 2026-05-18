import express from "express";
import validate from "../../utils/validate.js";
import { 
   createShop, 
   createProduct, 
   home, 
   stockUpdate, 
   getOrders,
   ordersList,
   viewOrderDetails,
   updateOrderStatus,
   getNearestDeliveryBoys,
   assignDeliveryBoy,
   markOutForDelivery,
   updateSellerProfile,
   logout,
   deleteAccount
} from "./controller.js";
import Joi from "joi";
import createMulter from "../../utils/multer.js"
import {authenticateToken} from "../../common/middleware/authenticateToken.js"

const router = express.Router();

//file
const sellerImage = createMulter("seller");

router.post(
   '/add-shop', 
   authenticateToken,
   sellerImage.single("image"),
   validate(
   Joi.object({
        shop_name          : Joi.string().trim().required(),       
        shop_keeper_name   : Joi.string().trim().required(), 
        email              : Joi.string().email().required(), 
        phone              : Joi.string().trim().required(),  
        address            : Joi.string().trim().required(), 
        latitude           : Joi.string().required(),  
        longitude          : Joi.string().required()
    })
  ), 
  createShop
);

router.post(
   '/add-product', 
   authenticateToken,
   validate(
   Joi.object({
        category_id       : Joi.string().uuid().required(),       
        sub_category_id   : Joi.string().uuid().required(), 
        varieties_id      : Joi.string().uuid().required(), 
        price             : Joi.string().required(),  
        stock_qty         : Joi.string().required(), 
        unit              : Joi.string().required(),  
    })
  ), 
  createProduct
);

router.get(
   '/home', 
   authenticateToken,
   home
);

router.post(
   '/stock-update/:id', 
   authenticateToken,
	 validate(
		 Joi.object({
			  id         : Joi.string().uuid().required(),
           stock_qty  : Joi.string().required(),
			  action     : Joi.string().valid("add", "remove").required()
    })
	 ),
   stockUpdate
);

router.get(
   '/get-orders', 
   authenticateToken,
   getOrders
);

router.post(
   "/view-order-details/:id",
   authenticateToken,
   viewOrderDetails
);

router.post(
   "/update-order-status/:id",
   authenticateToken,
   validate(
      Joi.object({
         order_status: Joi.string()
            .valid(
               "approved",
               "rejected",
               "completed"
            )
            .required(),

         preparation_time: Joi.string().required()

      }).unknown(true)
   ),
   updateOrderStatus
);

router.get(
   "/nearest-delivery-boys",
   authenticateToken,
   getNearestDeliveryBoys
);

router.post(
   "/assign-delivery-boy/:id",
   authenticateToken,
   validate(
      Joi.object({
         delivery_boy_id: Joi.string().uuid().required()
      }).unknown(true)
   ),
   assignDeliveryBoy
);

router.post(
   "/out-for-delivery/:id",
   authenticateToken,
   markOutForDelivery
);

router.post(
   "/update-profile",
   authenticateToken,
   sellerImage.single("profile_image"),
   validate(
      Joi.object({
         first_name : Joi.string().optional().allow("", null),
         last_name  : Joi.string().optional().allow("", null),
         email      : Joi.string().email().optional().allow("", null)
      })
   ),
   updateSellerProfile
);

router.get(
   "/logout",
   authenticateToken,
   logout
);

router.post(
   "/delete-account",
   authenticateToken,
   deleteAccount
);

router.get(
   "/orders-list",
   authenticateToken,
   ordersList
);


export default router;