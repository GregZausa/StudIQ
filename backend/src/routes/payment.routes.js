import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { checkout, webhook } from "../controllers/payment.controller.js";

const router = Router();

router.post("/checkout", requireAuth, checkout);

router.post("/webhook", webhook);

export default router;
