import jwt from "jsonwebtoken";
import config from "../config/envConfig.js"
import models from "../../models/index.js"

export const authenticateToken = async(req,res,next) => {
    let token = req.headers.authorization;

    console.log("token", token)

    if(!token || !token.startsWith("Bearer")){
        return res.send({status: false, message: "Authentication failed. No token provided."});
    }

    token = token.replace("Bearer ","");

    try {
    const decodedToken = jwt.verify(token, config.JWT_SECRET);

    const {id, role} = decodedToken;

    let user ;
    
    if( role == "admin" ){
      user = await models.Admin.findByPk(id);
      if(!user){
        return res.send({status: false, message: "Authentication failed. Admin not authorized."});
      }

      req.admin = user;
    } 
    else if( role == "customer"){
      user = await models.User.findByPk(id);
      if(!user){
        return res.send({status: false, message: "Authentication failed. Customer not authorized."});
      }

      req.customer = user;
    }
    else{
      user = await models.User.findByPk(id);
      if(!user){
        return res.send({status: false, message: "Authentication failed. Seller  not authorized."});
      }

      req.seller = user;
    }

    next();
        
    } catch (error) {
        return res.send({ status: false, message: 'Authentication failed. Invalid token.' });
    }

} 