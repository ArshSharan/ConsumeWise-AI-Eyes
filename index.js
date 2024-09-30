import express from "express";
import connectDB from "./helpers/dbInitializer.js";
import { config } from "dotenv";
import testRouter from "./routes/testRouter.js"
import apiRouter from "./routes/apiRouter.js"
import _Product from "./models/product.js"
import _Response from "./models/responseCache.js"
import _DocImport from "./models/docImport.js"

config();
await connectDB();

const app = express();

app.use(express.json());

app.use(express.static('build'))

app.use("/test", testRouter);
app.use("/api", apiRouter);

const port = process.env.PORT || 8000;


app.listen(port, () => console.log(`Server running on http://localhost:${port} !`));

