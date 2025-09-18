"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import RequireAuth from "@/components/RequireAuth";
import { supabase } from "@/lib/supabase-client";
import QRCode from "qrcode";

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
};

export default function PaymentSuccessPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [ticket, setTicket] = useState<TicketRecord | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData.session?.user?.id;
      if (!userId) {
        setLoading(false);
        return;
      }
      const { data } = await supabase
        .from("tickets")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (!mounted) return;
      if (data) {
        setTicket(data as TicketRecord);
        try {
          const payload = JSON.stringify({
            id: data.id,
            order_id: data.order_id,
            payment_id: data.payment_id,
            amount: data.amount,
            currency: data.currency,
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

  return (
    <RequireAuth>
      <div className="min-h-dvh w-full bg-black text-neutral-200 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
        <div className="rounded-[28px] bg-neutral-900/80 ring-1 ring-white/10 shadow-2xl overflow-hidden relative">
          <div className="pointer-events-none absolute -top-20 -left-20 h-44 w-44 rounded-full bg-white/8 blur-3xl" />
          <div className="pointer-events-none absolute top-0 right-0 h-20 w-20 rounded-bl-[28px] bg-white/5" />
          <div className="p-6 sm:p-8">
            <h1 className="text-2xl font-semibold text-center">Booking Confirmed!</h1>
            {ticket ? (
              <div className="mt-6 rounded-2xl bg-neutral-950 ring-1 ring-white/10 p-4">
                <p className="font-medium">Ticket Details</p>
                <div className="mt-3 space-y-2 text-sm">
                  <div className="flex items-center justify-between"><span className="text-neutral-400">Ticket ID</span><span>{ticket.id}</span></div>
                  <div className="flex items-center justify-between"><span className="text-neutral-400">Order ID</span><span>{ticket.order_id}</span></div>
                  <div className="flex items-center justify-between"><span className="text-neutral-400">Payment ID</span><span>{ticket.payment_id}</span></div>
                  <div className="flex items-center justify-between"><span className="text-neutral-400">Amount</span><span>₹{(ticket.amount / 100).toFixed(2)} {ticket.currency}</span></div>
                  <div className="flex items-center justify-between"><span className="text-neutral-400">Status</span><span className="capitalize">{ticket.status}</span></div>
                  <div className="flex items-center justify-between"><span className="text-neutral-400">Issued</span><span>{new Date(ticket.created_at).toLocaleString()}</span></div>
                </div>
                <div className="mt-4 aspect-square w-full max-w-[220px] mx-auto bg-white rounded-md grid place-items-center overflow-hidden">
                  {qrDataUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={qrDataUrl} alt="Ticket QR" className="w-full h-full object-contain" />
                  ) : (
                    <span className="text-black text-xs">QR</span>
                  )}
                </div>
                <p className="mt-4 text-center text-xs text-neutral-400">Please present this QR code at the event gate.</p>
              </div>
            ) : (
              <div className="mt-6 text-center text-neutral-400">No ticket found.</div>
            )}
            <div className="mt-4 text-center text-sm">
              <button onClick={() => router.push("/ticket")} className="text-neutral-300 hover:text-white underline underline-offset-4 transition-colors">Book Again</button>
            </div>
          </div>
        </div>
        </div>
        </div>
    </RequireAuth>
  );
}


