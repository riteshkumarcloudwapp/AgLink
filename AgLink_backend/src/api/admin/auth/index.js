import express from "express";
import validate from "../../../utils/validate.js";
import { logIn } from "./controller.js";
import Joi from "joi";

const router = express.Router();

router.post(
    "/login",
    validate(
        Joi.object({
            email: Joi.string().trim().required(),
            password: Joi.string().min(6).required()
        })
    ),
    logIn
);

export default router;
