import express from "express";
import validate from "../../utils/validate.js";
import { register } from "./controller.js";
import Joi from "joi";

const router = express.Router();

router.post(
  '/register', 
   validate(
   Joi.object({
        first_name    : Joi.string().trim().required(), 
        last_name     : Joi.string().trim().required(), 
        email         : Joi.string().trim().required(), 
        country_code  : Joi.string().required(), 
        phone_number  : Joi.string().required(), 
        password      : Joi.string().min(6).required()
    })
  ), 
  register
);

export default router;