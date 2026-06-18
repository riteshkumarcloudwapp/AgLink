import express from "express";
import config from "./src/common/config/envConfig.js"
import connectDb from "./src/common/config/db.js";
import path from "path";
import fs from "fs";
import swaggerUi from "swagger-ui-express";

//routes
import user from "./src/api/user/index.js";
import adminHome from "./src/api/admin/home/index.js";
import adminAuth from "./src/api/admin/auth/index.js";
import seller from "./src/api/seller/index.js";
import customer from "./src/api/customer/index.js";
import deliveryBoy from "./src/api/deliveryBoy/index.js";

const app = express();

//express config
app.use(express.json());

// Serve static files from src/templates 
app.use("/templates", express.static(path.join(process.cwd(), "src/templates")));

// file upload on local
app.use('/assets', express.static('assets'));

app.get('/', (req,res)=>{
    res.json({message : "Hello from the server"})
});
  
// swagger for API documentation
const swagger = JSON.parse(
  fs.readFileSync(new URL("./swagger.json", import.meta.url))
);
app.use(
  "/api-docs",
  swaggerUi.serveFiles(swagger, {}),
  swaggerUi.setup(swagger)
);
 
//db connection
connectDb;
console.log(`Database connected to url ${connectDb.url}`)

//routes
app.use('/user',user);
app.use('/admin/home',adminHome);
app.use('/admin/auth',adminAuth);
app.use('/seller',seller);
app.use('/customer',customer);
app.use('/delivery-boy',deliveryBoy);

//server
app.listen(config.PORT, ()=>{
    console.log(`Server is listning on http://${config.HOST}:${config.PORT}`)
});