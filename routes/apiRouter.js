import { Router } from "express";

import { verdictGenerate } from "../controllers/apiController.js"

const router = Router();
router.get("/verdict", verdictGenerate);

export default router;
