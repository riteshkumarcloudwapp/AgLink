
const calculatePickupTimes = (PickUpTime) => {
    const now = new Date();

    let estimatedPickupTime = new Date(now);

    // extract hours  (Given time se extract hour)
    const hoursMatch = PickUpTime.match(/(\d+)\s*hr/);
    // extract minutes
    const minutesMatch = PickUpTime.match(/(\d+)\s*min/);

    const hours = hoursMatch ? parseInt(hoursMatch[1]) : 0;
    const minutes = minutesMatch ? parseInt(minutesMatch[1]) : 0;

    // add hours
    estimatedPickupTime.setHours(
        estimatedPickupTime.getHours() + hours
    );

    // add minutes
    estimatedPickupTime.setMinutes(
        estimatedPickupTime.getMinutes() + minutes
    );

    return estimatedPickupTime;
}

const PickUpTime = '15min'

const calculatedpickUpTime = calculatePickupTimes(PickUpTime);

console.log(calculatedpickUpTime)