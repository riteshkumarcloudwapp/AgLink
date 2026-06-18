import express from "express";
import validate from "../../utils/validate.js";
import {
   deliveryBoySignup,
   deliveryBoyLogin,
   verifyDeliveryBoyOtp,
   getAssignedOrders,
   acceptOrder,
   pickupOrder,
   outForDelivery,
   verifyDeliveryOtp,
   toggleAvailability
} from "./controller.js";
import Joi from "joi";
import createMulter from "../../utils/multer.js"
import { authenticateToken } from "../../common/middleware/authenticateToken.js"

const router = express.Router();

//file
const deliveryBoyImage = createMulter("deliveryBoy");

router.post(
   '/signup',
   deliveryBoyImage.single("profile_image"),
   validate(
      Joi.object({
         name: Joi.string().trim().required(),
         email: Joi.string().email().trim().required(),
         country_code: Joi.string().trim().required(),
         phone: Joi.string().trim().required(),
         address: Joi.string().trim().required(),
         vehicle_name: Joi.string().trim().required(),
         vehicle_number: Joi.string().trim().required()
      })
   ),
   deliveryBoySignup
);

router.post(
   '/login',
   validate(
      Joi.object({
         email: Joi.string().email().required(),
         latitude: Joi.number().required(),
         longitude: Joi.number().required()
      })
   ),
   deliveryBoyLogin
);

router.post(
   "/verify-otp",
   validate(
      Joi.object({
         email: Joi.string().email().required(),
         otp: Joi.string().trim().required()
      })
   ),
   verifyDeliveryBoyOtp
);

router.get(
   '/assigned-orders',
   authenticateToken,
   getAssignedOrders
);

router.post(
   '/accept-order/:id',
   authenticateToken,
   acceptOrder
);

router.post(
   '/pickup-order/:id',
   authenticateToken,
   pickupOrder
);

router.post(
   '/out-for-delivery/:id',
   authenticateToken,
   outForDelivery
);

router.post(
   '/verify-delivery-otp',
   authenticateToken,
   validate(
      Joi.object({
         order_id: Joi.string().uuid().required(),
         otp: Joi.string().trim().required()
      })
   ),
   verifyDeliveryOtp
);

router.post(
   '/toggle-availability',
   authenticateToken,
   validate(
      Joi.object({
         is_available: Joi.boolean().required()
      })
   ),
   toggleAvailability
);

export default router;