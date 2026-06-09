import "dotenv/config";
import express from "express";
import cors from "cors";
import paymentRoutes from "./routes/payment.routes.js";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use("/api/payment/webhook", express.raw({ type: "application/json" }));

app.use(express.json());

app.use("/api/payment", paymentRoutes);

app.get("/health", (_req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`StudIQ backend running on port ${PORT}`);
});
