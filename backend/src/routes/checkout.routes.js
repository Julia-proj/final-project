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
