import models from "../../models/index.js";
import { Op } from "sequelize";
import bcrypt from "bcrypt";
import { generateOtp, generateTime, generateToken} from "./service.js";
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

        if(user){ return res.send({status: false, message: "Email or Phone_number already Registered"})};

        const otp = generateOtp();
        const expiry_time = generateTime();
        const hashedPassword = await bcrypt.hash(password, 10);

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
        
        res.send({
            status: true, 
            message: "Otp sent to Registered Email",
            data: register
        })
        
    } catch (error) {
     return res.send({ status: false, message: error.message })
    }
};

/**
 * @method POST
 * @description Use to Verify User
 */
export const verifyOtp = async (req,res)=>{
    try {
    
        const {otp, id} = req.body;
        
        const user = await models.User.findByPk(id);

        if(user?.otp !== otp){
            return res.send({status:false, message: "Invalid Otp"})
        }

        if(user?.expiry_time < Math.floor(Date.now() / 1000)){
            return res.send({status:false, message: "Otp Expired"})
        }

        if(user.is_verified){

        await user.update({ otp: null, expiry_time: null });

        return res.send({status: true, message: "Verified successfully"}); 

        }

        await user.update({ 
            is_verified: true,
            otp: null,
            expiry_time: null
        });

        return res.send({
            status: true,
            message: "Verified successfully",
        }); 

    } catch (error) {
        return res.send({status: false, message: error.message})
    }
}

/**
 * @method POST 
 * @description Use to Login user
 */
export const logIn = async (req,res) => {
    try {
        const {email, password} = req.body;

        const user = await models.User.findOne({
            where : {email: email}
        });

        if(!user){
            return res.send({status: false, message: "user not found"})
        }

        const verifyPassword = await bcrypt.compare(password, user.password);

        if(!verifyPassword){
            return res.send({status: false, message: "Incorrect Password"})
        }

        if(!user.is_verified){
            const otp = generateOtp();
            const expiry_time = generateTime();

            await user.update({otp: otp, expiry_time: expiry_time});

            await sendEmailOtp(
            user.email,
            "Verify Your Email - AgLink App",
            "email_verification",
            {
             name: user.first_name || "User",
             otp,
             year: new Date().getFullYear(),
            }
        );
            return res.send({status: false, message: "Otp Send Successfully. Please verify your email before logging in."})
        }

        const token = generateToken(user);

        return res.send({
            status: true,
            message: "Login Successful",
            Jwt_token: token
        })

    } catch (error) {
    return res.send({ status: false, message: error.message });
    }
}

/**
 * @method POST
 * @description Forget Reset
 */
export const forgetPassword = async (req,res) => {
    try {
        const {email} = req.body;
    
        const user = await models.User.findOne({
            where : {email}
        });

        if(!user){
            return res.send({status: false, message: "User not found"});
        }

        const otp = generateOtp();
        const expiry_time = generateTime();

        await user.update({otp: otp, expiry_time: expiry_time});

        await sendEmailOtp(
            user.email,
            "Verify Your Email - AgLink App",
            "email_verification",
            {
             name: user.first_name || "User",
             otp,
             year: new Date().getFullYear(),
            }
        );

        return res.send({status: false, message: "Otp send Successful", data: {id: user.id} });

    } catch (error) {
        return res.send({status: false, message: error.message})
    }
}

/**
 * @method POST
 * @description Password Reset
 */
export const resetPassword = async (req,res) => {
    try {
        const {password, id} = req.body;

        const user = await models.User.findByPk(id);
        if(!user){ return res.send({status: false, message: "User not found" }) }

        const hashedPassword = await bcrypt.hash(password, 10);

        await user.update({password: hashedPassword});

        return res.send({status: true, message: "Password reset successful"});

    } catch (error) {
        return res.send({status: false, message: error.message})
    }
}

/**
 * @method POST
 * @description Resend OTP
 */
export const resendOtp = async (req,res) => {
    try {
        const userId = req.body.id;

        const user = await models.User.findByPk(userId);
        if(!user){ return res.send({ status: false, message: "User not found" }) }

        const current_time = Math.floor(Date.now()/1000);  //Time in sec

        //Handling Rate Limit : 60 sec
        if(user.last_sent_at && current_time < user.last_sent_at){
            const waitTime = user.last_sent_at - current_time;
            return res.send({
                status: false,
                message: `Please wait ${waitTime} seconds before resending.`
            });
        }

        const otp = generateOtp();
        const expiry_time = generateTime();
        const lastTimeOtpSend = current_time + 60;  //60 sec cool down 

        await user.update({ otp: otp, expiry_time: expiry_time, last_sent_at:lastTimeOtpSend })

        await sendEmailOtp(
            user.email,
            "Verify Your Email - AgLink App",
            "email_verification",
            {
             name: user.first_name || "User",
             otp,
             year: new Date().getFullYear(),
            }
        );

        return res.send({status: true, message: "Resend Otp Send"});

    } catch (error) {
        return res.send({status: false, message: error.message})
    }
}





