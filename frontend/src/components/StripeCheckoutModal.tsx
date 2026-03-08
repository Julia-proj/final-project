import { useCallback } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from '@stripe/react-stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

interface StripeCheckoutModalProps {
  onClose: () => void;
}

export default function StripeCheckoutModal({ onClose }: StripeCheckoutModalProps) {
  const fetchClientSecret = useCallback(async () => {
    const res = await fetch('http://localhost:3000/api/checkout/create-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await res.json();
    return data.clientSecret as string;
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-2xl mx-4">
        <button
          onClick={onClose}
          aria-label="Cerrar checkout"
          className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-[#f5f0eb] hover:bg-[#e8e0d8] text-[#3d3530] transition-colors text-lg font-light"
        >
          ✕
        </button>
        <div className="p-4 pt-10">
          <EmbeddedCheckoutProvider stripe={stripePromise} options={{ fetchClientSecret }}>
            <EmbeddedCheckout />
          </EmbeddedCheckoutProvider>
        </div>
      </div>
    </div>
  );
}
