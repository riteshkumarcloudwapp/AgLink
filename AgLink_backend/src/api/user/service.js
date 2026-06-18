import jwt from "jsonwebtoken";
import config from "../../common/config/envConfig.js"

/**
 * @method Function
 * @description Use to generate OTP
 */

export const generateOtp = ()=>{
    return Math.floor(1000 + Math.random() * 9000);  //1254
}

/**
 * @method function
 * @description use to generate expiry time in Sec
 */

export const generateTime = () => {
  return Math.floor(Date.now() / 1000) + (15 * 60); //15 min
}

/**
 * @method Function
 * @description Use to generate JWT Token
 */

export const generateToken = (user)=>{
  return jwt.sign(
    {
      id: user?.id,
      role: user?.role
    },
    config.JWT_SECRET,
    {
      expiresIn: "4d"
    }
  );
}