"use client";

import React from "react";
import { useRouter } from "next/navigation";
import RequireAuth from "@/components/RequireAuth";

export default function PaymentSuccessPage() {
  const router = useRouter();
  return (
    <RequireAuth>
      <div className="min-h-dvh w-full bg-black text-neutral-200 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
        <div className="rounded-[28px] bg-neutral-900/80 ring-1 ring-white/10 shadow-2xl overflow-hidden relative">
          <div className="pointer-events-none absolute -top-20 -left-20 h-44 w-44 rounded-full bg-white/8 blur-3xl" />
          <div className="pointer-events-none absolute top-0 right-0 h-20 w-20 rounded-bl-[28px] bg-white/5" />
          <div className="p-6 sm:p-8">
            <h1 className="text-2xl font-semibold text-center">Booking Confirmed!</h1>
            <div className="mt-6 rounded-2xl bg-neutral-950 ring-1 ring-white/10 p-4">
              <p className="font-medium">Ticket Details</p>
              <div className="mt-3 space-y-2 text-sm">
                <div className="flex items-center justify-between"><span className="text-neutral-400">Ticket Number</span><span>TN01234578</span></div>
                <div className="flex items-center justify-between"><span className="text-neutral-400">Event</span><span>Concert Night</span></div>
                <div className="flex items-center justify-between"><span className="text-neutral-400">Date</span><span>2023-10-26 · 7:00 PM</span></div>
                <div className="flex items-center justify-between"><span className="text-neutral-400">Venue</span><span>City Hall Stadium</span></div>
                <div className="flex items-center justify-between"><span className="text-neutral-400">Number of Tickets</span><span>1</span></div>
              </div>
              {/* QR placeholder */}
              <div className="mt-4 aspect-square w-full max-w-[220px] mx-auto bg-white rounded-md grid place-items-center">
                <span className="text-black text-xs">QR Code</span>
              </div>
              <p className="mt-4 text-center text-xs text-neutral-400">Please present this QR code at the event gate.</p>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <button className="h-10 rounded-xl bg-white text-black text-sm font-medium ring-1 ring-white/70 hover:bg-neutral-100 active:translate-y-[1px] transition-all duration-200 ease-out">Download Ticket (PDF)</button>
                <button className="h-10 rounded-xl bg-neutral-900 text-neutral-200 text-sm font-medium ring-1 ring-white/10 hover:bg-neutral-800 active:translate-y-[1px] transition-all duration-200 ease-out">Send to Email</button>
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              <button onClick={() => router.push("/ticket")} className="text-neutral-300 hover:text-white underline underline-offset-4 transition-colors">Book Again</button>
            </div>
          </div>
        </div>
        </div>
    </RequireAuth>
  );
}


