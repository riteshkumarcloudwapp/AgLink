/**
 * @method POST
 * @description Used to calculate time 
 */
//This is a function which takes dynamic time in string with diffrent time format and also we know the time given by 
//user is in which format it can be hour , min and both
//so this function takes time convert them  in required format and add that in current actual time

export const timeFormatter = ( defaultTime ) => {
    const now = new Date();       //get currentTime and date

    let time = new Date(now);    //copy of current time we will modify this only

    // extract hours  (Given time se extract hour)
    const hoursMatch = defaultTime.match(/(\d+)\s*hr/);     // hoursMatch = ["1 hr", "1"]
    // extract minutes
    const minutesMatch = defaultTime.match(/(\d+)\s*min/);   //minutesMatch = ["20 min", "20"]

    const hours = hoursMatch ? parseInt(hoursMatch[1]) : 0;  //in integer
    const minutes = minutesMatch ? parseInt(minutesMatch[1]) : 0;

    // add hours
    time.setHours(
        time.getHours() + hours
    );

    // add minutes
    time.setMinutes(
        time.getMinutes() + minutes
    );

    return time;
}


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
