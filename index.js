import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Stripe from "stripe";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Stripe must be created with your secret key (server-side only)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/* =====================
   MIDDLEWARE
===================== */
app.use(cors());
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
    timestamp: new Date().toISOString(),
  });
});

/**
 * Create a PaymentIntent for mobile PaymentSheet
 * Body: { amount: number }  // e.g. 12.50 (GBP)
 */
app.post("/create-payment-intent", async (req, res) => {
  try {
    const { amount } = req.body;

    if (typeof amount !== "number" || Number.isNaN(amount) || amount <= 0) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    const amountInPence = Math.round(amount * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInPence,
      currency: "gbp",
      automatic_payment_methods: { enabled: true },
    });

    return res.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (err) {
    console.error("create-payment-intent error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

/* =====================
   START SERVER
===================== */
app.listen(PORT, () => {
  console.log(`🚀 KO Grill backend running on port ${PORT}`);
});
