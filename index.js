import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

/* =====================
   MIDDLEWARE
===================== */

// Allow mobile apps + future frontend
app.use(cors());

// Stripe webhooks need raw body later, so keep this order
app.use(express.json());

/* =====================
   ROUTES
===================== */

// Root
app.get("/", (req, res) => {
  res.send("KO Grill backend running");
});

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "ko-grill-backend",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString()
  });
});

/* =====================
   START SERVER
===================== */

app.listen(PORT, () => {
  console.log(`🚀 KO Grill backend running on port ${PORT}`);
});

