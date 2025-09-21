"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import RequireAuth from "@/components/RequireAuth";
import { supabase } from "@/lib/supabase-client";
import QRCode from "qrcode";

type GenderType = "Boy" | "Girl";

const TICKET_PRICES: Record<GenderType, number> = {
  Boy: 350,
  Girl: 150,
};

type TicketRecord = {
  id: string;
  user_id: string;
  user_email: string | null;
  order_id: string;
  payment_id: string;
  amount: number;
  currency: string;
  status: string;
  created_at: string;
  gender?: string;
  name?: string;
};

export default function TicketPage() {
  const router = useRouter();
  const [genderType, setGenderType] = useState<GenderType>("Boy");
  const [count, setCount] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [ticket, setTicket] = useState<TicketRecord | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);

  const pricePerTicket = TICKET_PRICES[genderType];
  const totalPrice = useMemo(() => count * pricePerTicket, [count, pricePerTicket]);

  const changeCount = (delta: number) => {
    setCount((c) => Math.max(1, c + delta));
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData.session?.user?.id;
      if (!userId) {
        setLoading(false);
        return;
      }
      const { data, error } = await supabase
        .from("tickets")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (!mounted) return;
      if (error) {
        setTicket(null);
      } else if (data) {
        setTicket(data as TicketRecord);
        try {
          const payload = JSON.stringify({
            id: data.id,
            order_id: data.order_id,
            payment_id: data.payment_id,
            amount: data.amount,
            currency: data.currency,
            gender: data.gender,
            user_email: data.user_email,
            ticket_count: data.ticket_count,
            price_per_ticket: data.price_per_ticket,
            created_at: data.created_at,
          });
          const url = await QRCode.toDataURL(payload, { margin: 1, width: 512 });
          setQrDataUrl(url);
        } catch {
          setQrDataUrl(null);
        }
      }
      setLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <RequireAuth>
        <div className="min-h-dvh w-full bg-black text-neutral-200 flex items-center justify-center p-4">
          <div className="text-neutral-400">Loading…</div>
        </div>
      </RequireAuth>
    );
  }

  if (ticket) {
    return (
      <RequireAuth>
        <div className="min-h-dvh w-full bg-black text-neutral-200 flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-[28px] bg-neutral-900/80 ring-1 ring-white/10 shadow-2xl p-6 relative overflow-hidden">
            <div className="pointer-events-none absolute -top-16 -left-16 h-40 w-40 rounded-full bg-white/8 blur-2xl" />
            <div className="pointer-events-none absolute top-0 right-0 h-16 w-16 rounded-bl-[28px] bg-white/5" />
            <div className="flex items-center gap-3 mb-6">
              <h1 className="text-xl sm:text-2xl font-semibold">Your Ticket</h1>
            </div>
            <div className="rounded-2xl bg-neutral-950 ring-1 ring-white/10 p-4">
              <div className="mt-1 space-y-2 text-sm">
                <div className="flex items-center justify-between"><span className="text-neutral-400">Ticket ID</span><span className="text-neutral-200">{ticket.id}</span></div>
                <div className="flex items-center justify-between"><span className="text-neutral-400">Type</span><span className="text-neutral-200">{ticket.gender || 'Not specified'}</span></div>
                <div className="flex items-center justify-between"><span className="text-neutral-400">Order ID</span><span className="text-neutral-200">{ticket.order_id}</span></div>
                <div className="flex items-center justify-between"><span className="text-neutral-400">Payment ID</span><span className="text-neutral-200">{ticket.payment_id}</span></div>
                <div className="flex items-center justify-between"><span className="text-neutral-400">Amount</span><span className="text-neutral-200">₹{(ticket.amount / 100).toFixed(2)} {ticket.currency}</span></div>
                <div className="flex items-center justify-between"><span className="text-neutral-400">Status</span><span className="text-neutral-200 capitalize">{ticket.status}</span></div>
                <div className="flex items-center justify-between"><span className="text-neutral-400">Issued</span><span className="text-neutral-200">{new Date(ticket.created_at).toLocaleString()}</span></div>
              </div>
              <div className="mt-4 aspect-square w-full max-w-[240px] mx-auto bg-white rounded-md grid place-items-center overflow-hidden">
                {qrDataUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={qrDataUrl} alt="Ticket QR" className="w-full h-full object-contain" />
                ) : (
                  <span className="text-black text-xs">QR</span>
                )}
              </div>
              <p className="mt-4 text-center text-xs text-neutral-400">Present this QR at entry.</p>
            </div>
          </div>
        </div>
      </RequireAuth>
    );
  }

  return (
    <RequireAuth>
      <div className="min-h-dvh w-full bg-black text-neutral-200 flex items-center justify-center p-4">
        <div className="w-full max-w-md rounded-[28px] bg-neutral-900/80 ring-1 ring-white/10 shadow-2xl p-6 relative overflow-hidden">
        <div className="pointer-events-none absolute -top-16 -left-16 h-40 w-40 rounded-full bg-white/8 blur-2xl" />
        <div className="pointer-events-none absolute top-0 right-0 h-16 w-16 rounded-bl-[28px] bg-white/5" />
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => router.back()}
            className="h-9 w-9 rounded-full grid place-items-center bg-neutral-800 ring-1 ring-white/10 text-neutral-200 hover:bg-neutral-700 transition-colors"
            aria-label="Back"
          >
            ←
          </button>
          <h1 className="text-xl sm:text-2xl font-semibold">Select Your Tickets</h1>
        </div>

        {/* Gender selection tabs */}
        <div className="grid grid-cols-2 gap-2">
          {(["Boy", "Girl"] as GenderType[]).map((type) => {
            const active = type === genderType;
            const price = TICKET_PRICES[type];
            return (
              <button
                key={type}
                onClick={() => setGenderType(type)}
                className={
                  "h-16 rounded-xl text-sm font-medium ring-1 transition-colors duration-200 ease-out flex flex-col items-center justify-center " +
                  (active
                    ? "bg-white text-black ring-white shadow-sm"
                    : "bg-neutral-800 text-neutral-300 ring-white/10 hover:bg-neutral-700 hover:ring-white/20")
                }
              >
                <span className="font-semibold">{type}</span>
                <span className="text-xs opacity-80">₹{price}</span>
              </button>
            );
          })}
        </div>

        {/* Ticket Count */}
        <div className="mt-6">
          <p className="text-sm text-neutral-400">Ticket Count</p>
          <div className="mt-2 flex items-center gap-3">
            <button
              onClick={() => changeCount(-1)}
              className="h-10 w-10 rounded-full grid place-items-center bg-neutral-800 ring-1 ring-white/10 text-xl hover:bg-neutral-700 transition-colors duration-200"
              aria-label="Decrease"
            >
              –
            </button>

            <div className="flex-1 h-10 rounded-full bg-neutral-800 ring-1 ring-white/10 grid place-items-center">
              <span className="tracking-wider text-base">{count}</span>
            </div>

            <button
              onClick={() => changeCount(1)}
              className="h-10 w-10 rounded-full grid place-items-center bg-neutral-800 ring-1 ring-white/10 text-xl hover:bg-neutral-700 transition-colors duration-200"
              aria-label="Increase"
            >
              +
            </button>
          </div>
        </div>

        {/* Summary Card */}
        <div className="mt-6 rounded-2xl bg-neutral-950 ring-1 ring-white/10 p-4 transition-colors">
          <p className="font-medium text-neutral-200">Summary Card</p>
          <div className="mt-3 space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-neutral-400">Ticket Type</span>
              <span className="text-neutral-200">{genderType}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-neutral-400">Number of Tickets</span>
              <span className="text-neutral-200">{count}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-neutral-400">Price per Ticket</span>
              <span className="text-neutral-200">₹{pricePerTicket}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-neutral-400">Total Price</span>
              <span className="text-neutral-200 font-medium">₹{totalPrice}</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => router.push(`/payment?count=${count}&total=${totalPrice}&gender=${genderType}&pricePerTicket=${pricePerTicket}`)}
          className="mt-6 w-full h-12 rounded-xl bg-white text-black font-medium ring-1 ring-white/70 shadow-[0_1px_0_0_rgba(255,255,255,0.1)_inset] hover:bg-neutral-100 active:translate-y-[1px] transition-all duration-200 ease-out"
        >
          Proceed to Payment
        </button>
        </div>
      </div>
    </RequireAuth>
  );
}
