import jwt from "jsonwebtoken";
import config from "../../common/config/envConfig.js";

/**
 * @method Function
 * @description token generation and other services related to delivery boy
 */

export const token = (user) => {
    return jwt.sign(
        {
            id: user.id,
        },
        config.JWT_SECRET,
        {
            expiresIn: "7d"
           }
    )
}

/**
 * @method Function
 * @description Generate OTP
 */
export const generateOtp = () => {
    return Math.floor( 100000 + Math.random() * 900000);
}

/**
 * @method Function
 * @description Generate Time 
 */
export const expiryTime = () => {
   return Math.floor(Date.now() / 1000) + (15*60);
}
