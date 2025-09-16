"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import RequireAuth from "@/components/RequireAuth";

type EntryType = "Solo" | "Couple" | "Group";

const ENTRY_PRICES: Record<EntryType, number> = {
  Solo: 500,
  Couple: 900,
  Group: 2000,
};

export default function TicketPage() {
  const router = useRouter();
  const [entryType, setEntryType] = useState<EntryType>("Solo");
  const [count, setCount] = useState<number>(1);

  const pricePerTicket = ENTRY_PRICES[entryType];
  const totalPrice = useMemo(() => count * pricePerTicket, [count, pricePerTicket]);

  const changeCount = (delta: number) => {
    setCount((c) => Math.max(1, c + delta));
  };

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

        {/* Entry type tabs */}
        <div className="grid grid-cols-3 gap-2">
          {(["Solo", "Couple", "Group"] as EntryType[]).map((type) => {
            const active = type === entryType;
            return (
              <button
                key={type}
                onClick={() => setEntryType(type)}
                className={
                  "h-10 rounded-xl text-sm font-medium ring-1 transition-colors duration-200 ease-out " +
                  (active
                    ? "bg-white text-black ring-white shadow-sm"
                    : "bg-neutral-800 text-neutral-300 ring-white/10 hover:bg-neutral-700 hover:ring-white/20")
                }
              >
                {type}
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
              <span className="text-neutral-400">Entry Type:</span>
              <span className="text-neutral-200">{entryType}</span>
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
          onClick={() => router.push("/payment")}
          className="mt-6 w-full h-12 rounded-xl bg-white text-black font-medium ring-1 ring-white/70 shadow-[0_1px_0_0_rgba(255,255,255,0.1)_inset] hover:bg-neutral-100 active:translate-y-[1px] transition-all duration-200 ease-out"
        >
          Proceed to Payment
        </button>
        </div>
      </div>
    </RequireAuth>
  );
}
