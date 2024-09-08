import express from "express";
import { connectDB } from "./helpers/dbController.js";
import { config } from "dotenv";
import Product from "./models/product.js"
import testRouter from "./routes/testRouter.js"
import apiRouter from "./routes/apiRouter.js"

config();
connectDB();

const app = express();

app.get("/", (req,res)=>{return res.status(200).json({message:"Hello from the other side...."})});
app.use("/test", testRouter);
app.use("/api", apiRouter);

const port = process.env.PORT || 8000;


app.listen(port, ()=> console.log(`Server running on http://localhost:${port} !`));
  
