//hamare pass db me otp and expiry_time hai jo kii 15 min expiry time hai ie current time se 15 min.
//me chate hu user otp ko har 60 sec ke interval pe send kr sakta hai.
//use kiya hoga kii db me sab update hoga. and us particular time se 15 min kii expiry  time chalega.
 
const lastTimeOptSend = Math.floor( Date.now()/1000 ) + 60; //Time in seccurrent se 60 sec

console.log("lastTimeOptSend--", lastTimeOptSend);

const currentTime = Math.floor( Date.now()/1000 );

console.log("currentTime--", currentTime);
