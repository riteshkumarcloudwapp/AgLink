import express from "express";
import validate from "../../utils/validate.js";
import { register, verifyOtp, logIn, forgetPassword, resetPassword, resendOtp } from "./controller.js";
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

router.post(
  '/verify-otp', 
   validate(
   Joi.object({
       otp : Joi.string().required(),
       id  : Joi.string().required()
    })
  ),
  verifyOtp
);

router.post(
  '/login', 
   validate(
   Joi.object({
        email     : Joi.string().trim().required(), 
        password  : Joi.string().min(6).required()
    })
  ), 
  logIn
);

router.post(
  '/forget-password', 
   validate(
   Joi.object({
       email : Joi.string().trim().required(),
    })
  ),
  forgetPassword
);

router.post(
  '/reset-password', 
   validate(
   Joi.object({
       password : Joi.string().min(6).required(),
       id       : Joi.string().required() 
    })
  ),
  resetPassword
);

router.post(
  "/resend-otp",
  validate(
   Joi.object({
       id  : Joi.string().required() 
    })
  ),
   resendOtp
);

export default router;