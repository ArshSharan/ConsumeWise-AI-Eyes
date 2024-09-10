import { Router } from "express";

import { testMongoDb } from "../controllers/testController.js"

const router = Router();
router.get("/mongoDb", testMongoDb);

export default router;
