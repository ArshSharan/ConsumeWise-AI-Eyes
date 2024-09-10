import { Router } from "express";

import { verdictGenerate } from "../controllers/apiController.js"

const router = Router();
router.post("/verdict", verdictGenerate);

export default router;
