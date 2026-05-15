export const timeFormatter = ( defaultTime ) => {
    const now = new Date();       //get currentTime and date

    let time = new Date(now);    //copy of current time we will modify this only

    // extract hours  (Given time se extract hour)
    const hoursMatch = defaultTime.match(/(\d+)\s*hr/);     // hoursMatch = ["1 hr", "1"]
    // extract minutes
    const minutesMatch = defaultTime.match(/(\d+)\s*min/);   //minutesMatch = ["20 min", "20"]

    const hours = hoursMatch ? parseInt(hoursMatch[1]) : 0;  //in integer
    const minutes = minutesMatch ? parseInt(minutesMatch[1]) : 0;

  // remove this

    // add minutes
    time.setMinutes(
        time.getMinutes() + minutes
    );

    return time;
}

const time = timeFormatter( '1 hr' );

// remove consoles