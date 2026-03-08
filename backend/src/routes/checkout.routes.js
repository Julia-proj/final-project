// ============================================================
// routes/checkout.routes.js — Pasarela de pago con Stripe
// ============================================================
// Crea una sesión de Stripe Checkout para la compra de
// Beauty Scripts. Usa el modo embedded de Stripe.
// Si Stripe no está configurado, devuelve 503.
// ============================================================

import express from 'express';
import Stripe from 'stripe';

const router = express.Router();

// POST /api/checkout/create-session
// Creates a Stripe Embedded Checkout session for Beauty Scripts
router.post('/create-session', async (req, res, next) => {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return res.status(503).json({ message: 'Stripe no está configurado' });
    }
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const session = await stripe.checkout.sessions.create({
      ui_mode: 'embedded',
      line_items: [
        {
          price: process.env.STRIPE_SCRIPTS_PRICE_ID,
          quantity: 1,
        },
      ],
      mode: 'payment',
      return_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
    });

    res.json({ clientSecret: session.client_secret });
  } catch (err) {
    next(err);
  }
});

export default router;
