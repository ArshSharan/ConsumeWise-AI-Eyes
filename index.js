import express from "express";
import { connectDB } from "./helpers/dbController.js";
import { config } from "dotenv";
import Product from "./models/product.js"
import testRouter from "./routes/testRouter.js"
import apiRouter from "./routes/apiRouter.js"

config();
connectDB();

const app = express();

app.use(express.json());

app.use("/test", testRouter);
app.use("/api", apiRouter);

app.get("/", (req, res) => {
  res.send(
    '<body style="background-color:#0;"></body>');
});


const port = process.env.PORT || 8000;


app.listen(port, () => console.log(`Server running on http://localhost:${port} !`));

