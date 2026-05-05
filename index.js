import express from "express";
import config from "./src/common/config/envConfig.js"
import connectDb from "./src/common/config/db.js";
import path from "path";
import fs from "fs";
import swaggerUi from "swagger-ui-express";

//routes
import user from "./src/api/user/index.js";
import home from "./src/api/admin/home/index.js";

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
app.use('/home',home);


//server
app.listen(config.PORT, ()=>{
    console.log(`Server is listning on http://${config.HOST}:${config.PORT}`)
});