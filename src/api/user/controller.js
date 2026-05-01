import models from "../../models/index.js";
import { Op } from "sequelize";
import bcrypt from "bcrypt";
import { generateOtp, generateTime} from "./service.js";
import sendEmailOtp from "../../utils/sendEmailOtp.js";


/**
 * @method POST
 * @description Use to register user 
 */
export const register = async (req,res) => {
    try {
        const {first_name, last_name, email, country_code, phone_number, password } = req.body;

        //check for existance of user
        const user = await models.User.findOne({
            where : {
                [Op.or] : [{email}, {phone_number}]
            }
        })

        if(user){ return res.send({status: false, message: "User already Registered"})};

        const hashedPassword = await bcrypt.hash(password, 10);

        const otp = generateOtp();
        const expiry_time = generateTime();

        //create User
        const register = await models.User.create({
            first_name   : first_name, 
            last_name    : last_name, 
            email        : email, 
            country_code : country_code, 
            phone_number : phone_number, 
            password     : hashedPassword,
            otp          : otp,
            expiry_time  : expiry_time
        })

        if (!register) {
            return res.send({ status: false, message: "User Registration Failed" });
        }

        await sendEmailOtp(
            register.email,
            "Verify Your Email - AgLink App",
            "email_verification",
            {
             name: register.first_name || "User",
             otp,
             year: new Date().getFullYear(),
            }
        );
        
        res.send({status: true, message: "User Registered Successfully"})
        
    } catch (error) {
     return res.send({ status: false, message: error.message })
    }
};

/**
 * @method POST 
 * @description Use to verify user
 */
export const logIn = async (req,res) => {
    try {
        
    } catch (error) {
        
    }
}
