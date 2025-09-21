"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase-client";
import QRScanner from "@/components/QRScanner";

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
  ticket_count?: number;
  price_per_ticket?: number;
  checked_in?: boolean;
  checked_in_at?: string;
  checked_in_by?: string;
};

export default function AdminDashboard() {
  const router = useRouter();
  const [isScanning, setIsScanning] = useState(false);
  const [scannedTicket, setScannedTicket] = useState<TicketRecord | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [stats, setStats] = useState<{
    totalTickets: number;
    checkedInTickets: number;
    pendingTickets: number;
    boyTickets: number;
    girlTickets: number;
  } | null>(null);

  // Check authentication
  useEffect(() => {
    const isAdminAuth = localStorage.getItem("admin_authenticated");
    if (isAdminAuth !== "true") {
      router.replace("/admin");
    } else {
      // Load stats
      loadStats();
    }
  }, [router]);

  const loadStats = async () => {
    try {
      const response = await fetch("/api/admin/stats?admin_user=admin");
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
      }
    } catch (err) {
      console.error("Failed to load stats:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_authenticated");
    router.replace("/admin");
  };

  const handleQRScan = async (qrData: string) => {
    console.log("QR Data received:", qrData);
    await processQRData(qrData);
  };

  const startScanning = () => {
    setError(null);
    setSuccess(null);
    setScannedTicket(null);
    setIsScanning(true);
  };

  const processQRData = async (qrData: string) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      const ticketData = JSON.parse(qrData);
      
      // Fetch ticket from database
      const { data, error: fetchError } = await supabase
        .from("tickets")
        .select("*")
        .eq("id", ticketData.id)
        .single();

      if (fetchError || !data) {
        setError("Ticket not found or invalid QR code");
        return;
      }

      setScannedTicket(data as TicketRecord);
      setIsScanning(false);
    } catch (err) {
      setError("Invalid QR code format or ticket not found");
      console.error("QR processing error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async () => {
    if (!scannedTicket) return;

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const response = await fetch("/api/admin/checkin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ticket_id: scannedTicket.id,
          action: "check_in",
          admin_user: "admin"
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Failed to check in ticket");
        return;
      }

      setSuccess("Ticket checked in successfully!");
      setScannedTicket({
        ...scannedTicket,
        checked_in: true,
        checked_in_at: new Date().toISOString(),
        checked_in_by: "admin"
      });
      
      // Refresh stats
      await loadStats();
    } catch (err) {
      setError("Failed to check in ticket");
      console.error("Check-in error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = async () => {
    if (!scannedTicket) return;

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const response = await fetch("/api/admin/checkin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ticket_id: scannedTicket.id,
          action: "check_out",
          admin_user: "admin"
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Failed to check out ticket");
        return;
      }

      setSuccess("Ticket checked out successfully!");
      setScannedTicket({
        ...scannedTicket,
        checked_in: false,
        checked_in_at: undefined,
        checked_in_by: undefined
      });
      
      // Refresh stats
      await loadStats();
    } catch (err) {
      setError("Failed to check out ticket");
      console.error("Check-out error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-dvh w-full bg-black text-neutral-200 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition-colors"
          >
            Logout
          </button>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <div className="rounded-lg bg-neutral-900/80 ring-1 ring-white/10 p-4 text-center">
              <div className="text-2xl font-bold text-blue-400">{stats.totalTickets}</div>
              <div className="text-sm text-neutral-400">Total Tickets</div>
            </div>
            <div className="rounded-lg bg-neutral-900/80 ring-1 ring-white/10 p-4 text-center">
              <div className="text-2xl font-bold text-green-400">{stats.checkedInTickets}</div>
              <div className="text-sm text-neutral-400">Checked In</div>
            </div>
            <div className="rounded-lg bg-neutral-900/80 ring-1 ring-white/10 p-4 text-center">
              <div className="text-2xl font-bold text-orange-400">{stats.pendingTickets}</div>
              <div className="text-sm text-neutral-400">Pending</div>
            </div>
            <div className="rounded-lg bg-neutral-900/80 ring-1 ring-white/10 p-4 text-center">
              <div className="text-2xl font-bold text-purple-400">{stats.boyTickets}</div>
              <div className="text-sm text-neutral-400">Boy Tickets</div>
            </div>
            <div className="rounded-lg bg-neutral-900/80 ring-1 ring-white/10 p-4 text-center">
              <div className="text-2xl font-bold text-pink-400">{stats.girlTickets}</div>
              <div className="text-sm text-neutral-400">Girl Tickets</div>
            </div>
          </div>
        )}

        {/* Scanner Section */}
        <div className="rounded-[28px] bg-neutral-900/80 ring-1 ring-white/10 shadow-2xl p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">QR Code Scanner</h2>
          
          {!isScanning && !scannedTicket && (
            <div className="text-center">
              <button
                onClick={startScanning}
                className="px-6 py-3 rounded-xl bg-white text-black font-medium hover:bg-neutral-100 transition-colors"
              >
                Start QR Scanner
              </button>
            </div>
          )}

          {isScanning && (
            <div className="space-y-4">
              <QRScanner
                onScan={handleQRScan}
                isActive={isScanning}
              />
              <div className="text-center">
                <button
                  onClick={() => setIsScanning(false)}
                  className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-700 text-white font-medium transition-colors"
                >
                  Stop Scanning
                </button>
              </div>
            </div>
          )}

          {/* Manual QR Input */}
          <div className="mt-4 pt-4 border-t border-white/10">
            <p className="text-sm text-neutral-400 mb-2">Or paste QR data manually:</p>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Paste QR code data here..."
                className="flex-1 h-10 px-3 rounded-lg bg-neutral-800 ring-1 ring-white/10 text-neutral-200 placeholder-neutral-500 focus:ring-2 focus:ring-white/20 focus:outline-none"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const target = e.target as HTMLInputElement;
                    if (target.value) {
                      processQRData(target.value);
                      target.value = "";
                    }
                  }
                }}
              />
            </div>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="mt-4 text-red-400 text-sm p-3 rounded-lg bg-red-400/10 ring-1 ring-red-400/20">
              {error}
            </div>
          )}
          
          {success && (
            <div className="mt-4 text-green-400 text-sm p-3 rounded-lg bg-green-400/10 ring-1 ring-green-400/20">
              {success}
            </div>
          )}
        </div>

        {/* Ticket Details */}
        {scannedTicket && (
          <div className="rounded-[28px] bg-neutral-900/80 ring-1 ring-white/10 shadow-2xl p-6">
            <h2 className="text-xl font-semibold mb-4">Ticket Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-400">Ticket ID:</span>
                  <span>{scannedTicket.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Type:</span>
                  <span>{scannedTicket.gender || "Not specified"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Count:</span>
                  <span>{scannedTicket.ticket_count || 1}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Email:</span>
                  <span>{scannedTicket.user_email || "Not provided"}</span>
                </div>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-400">Amount:</span>
                  <span>₹{(scannedTicket.amount / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Status:</span>
                  <span className="capitalize">{scannedTicket.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Checked In:</span>
                  <span className={scannedTicket.checked_in ? "text-green-400" : "text-red-400"}>
                    {scannedTicket.checked_in ? "Yes" : "No"}
                  </span>
                </div>
                {scannedTicket.checked_in_at && (
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Checked In At:</span>
                    <span>{new Date(scannedTicket.checked_in_at).toLocaleString()}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              {!scannedTicket.checked_in ? (
                <button
                  onClick={handleCheckIn}
                  disabled={loading}
                  className="flex-1 h-12 rounded-xl bg-green-600 hover:bg-green-700 text-white font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? "Processing..." : "Check In"}
                </button>
              ) : (
                <button
                  onClick={handleCheckOut}
                  disabled={loading}
                  className="flex-1 h-12 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? "Processing..." : "Check Out"}
                </button>
              )}
              
              <button
                onClick={() => {
                  setScannedTicket(null);
                  setError(null);
                  setSuccess(null);
                }}
                className="px-6 h-12 rounded-xl bg-neutral-700 hover:bg-neutral-600 text-white font-medium transition-colors"
              >
                Scan New Ticket
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}