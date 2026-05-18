import express from "express";
import validate from "../../utils/validate.js";
import { 
getAssignedOrders,
acceptOrder,

 } from "./controller.js";
import Joi from "joi";
import createMulter from "../../utils/multer.js"
import { authenticateToken } from "../../common/middleware/authenticateToken.js"

const router = express.Router();

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


export default router;