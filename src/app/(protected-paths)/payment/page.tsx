"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import RequireAuth from "@/components/RequireAuth";
import { supabase } from "@/lib/supabase-client";

type RazorpaySuccessResponse = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

type RazorpayConstructor = new (
  options: Record<string, unknown>
) => { open: () => void };

declare global {
  interface Window {
    Razorpay: RazorpayConstructor | undefined;
  }
}

export default function PaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isScriptReady, setIsScriptReady] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Get ticket details from URL params
  const ticketCount = parseInt(searchParams.get('count') || '1', 10);
  const totalAmount = parseInt(searchParams.get('total') || '399', 10);

  // Load Razorpay script (no-op if already present)
  useEffect(() => {
    if (window.Razorpay) {
      setIsScriptReady(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => setIsScriptReady(true);
    script.onerror = () => setIsScriptReady(false);
    document.body.appendChild(script);
  }, []);

  const startPayment = async () => {
    setIsProcessing(true);
    try {
      const session = await supabase.auth.getSession();
      const supabaseUserId = session.data.session?.user?.id;
      const userEmail = session.data.session?.user?.email ?? undefined;
      if (!supabaseUserId) throw new Error("Not authenticated");

      const createOrderRes = await fetch("/api/razorpay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: totalAmount }),
      });
      if (!createOrderRes.ok) {
        const errText = await createOrderRes.text();
        console.error("Create order failed:", errText);
        throw new Error("Failed to create order");
      }
      const { order, key_id } = await createOrderRes.json();
      const orderId = order.id;
      const amount = order.amount; // already in paisa
      const currency = order.currency;

      const options = {
        key: key_id,
        amount,
        currency,
        name: "CMR Ticket System",
        description: "Ticket purchase",
        order_id: orderId,
        theme: { color: "#ffffff" },
        handler: async function (response: RazorpaySuccessResponse) {
          try {
            const verifyRes = await fetch("/api/payment/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });
            if (!verifyRes.ok) throw new Error("Verification failed");
            // Create ticket in Supabase
            await supabase.from("tickets").insert({
              user_id: supabaseUserId,
              user_email: userEmail,
              order_id: response.razorpay_order_id,
              payment_id: response.razorpay_payment_id,
              amount,
              currency,
              status: "paid",
            });
            router.replace("/payment/success");
          } catch {
            setIsProcessing(false);
          }
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
          },
        },
        prefill: userEmail ? { email: userEmail } : undefined,
      };

      const RazorpayCtor = window.Razorpay as RazorpayConstructor;
      const rzp = new RazorpayCtor(options);
      rzp.open();
    } catch {
      setIsProcessing(false);
    }
  };

  return (
    <RequireAuth>
      <div className="min-h-dvh w-full bg-black text-neutral-200 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
        {/* Payment Card */}
        <div className="rounded-[28px] bg-neutral-900/80 ring-1 ring-white/10 shadow-2xl overflow-hidden relative">
          <div className="pointer-events-none absolute -top-20 -left-20 h-44 w-44 rounded-full bg-white/8 blur-3xl" />
          <div className="pointer-events-none absolute top-0 right-0 h-20 w-20 rounded-bl-[28px] bg-white/5" />
          <div className="p-6 sm:p-8">
            <h1 className="text-2xl font-semibold">Payment</h1>
            <p className="mt-1 text-sm text-neutral-400">Review your order and proceed to payment.</p>

            {/* Order Summary card */}
            <div className="mt-6 rounded-2xl bg-neutral-950 ring-1 ring-white/10 p-4 transition-colors">
              <p className="font-medium">Order Summary</p>
              <div className="mt-3 space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-400">Tickets</span>
                  <span>{ticketCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-400">Price per Ticket</span>
                  <span>₹399</span>
                </div>
                <div className="h-px bg-white/10 my-2" />
                <div className="flex items-center justify-between font-medium">
                  <span>Total</span>
                  <span>₹{totalAmount}</span>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="mt-6 space-y-3">
              <button
                onClick={startPayment}
                disabled={!isScriptReady || isProcessing}
                className="w-full h-12 rounded-xl bg-white text-black font-medium ring-1 ring-white/70 shadow-[0_1px_0_0_rgba(255,255,255,0.1)_inset] transition-all duration-300 ease-out hover:bg-neutral-100 active:translate-y-[1px] [--btn-shine:linear-gradient(110deg,rgba(255,255,255,0)_0%,rgba(255,255,255,.25)_40%,rgba(255,255,255,0)_60%)] relative overflow-hidden disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <span className="pointer-events-none">Proceed to Payment</span>
                <span className="absolute inset-0 -translate-x-full hover:translate-x-full transition-transform duration-700 bg-[image:var(--btn-shine)]" />
              </button>
            </div>
          </div>
          </div>
        </div>
      </div>
    </RequireAuth>
  );
}
