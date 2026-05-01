/**
 * @method Function
 * @description Use to generate OTP
 */

export const generateOtp = ()=>{
    return Math.floor(1000 + Math.random() * 9000);  //1254
}

/**
 * @method function
 * @description use to generate expiry time
 */

export const generateTime = () => {
  return Math.floor(Date.now() / 1000) + (15 * 60); //15 min
}