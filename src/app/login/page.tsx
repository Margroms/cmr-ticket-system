"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"enter-email" | "enter-otp">("enter-email");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const sendOtp = async () => {
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      const { error } = await authClient.emailOtp.sendVerificationOtp({
        email,
        type: "sign-in",
      });
      if (error) throw error;
      setMessage("OTP sent to your email.");
      setStep("enter-otp");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to send OTP";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      const { error } = await authClient.signIn.emailOtp({
        email,
        otp,
      });
      if (error) throw error;
      router.replace("/booking");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Invalid OTP";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: "40px auto", padding: 16 }}>
      <h1>Sign in</h1>
      {step === "enter-email" && (
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            style={{ width: "100%", padding: 8, marginTop: 8 }}
          />
          <button onClick={sendOtp} disabled={loading || !email} style={{ marginTop: 12 }}>
            {loading ? "Sending..." : "Generate OTP"}
          </button>
        </div>
      )}
      {step === "enter-otp" && (
        <div>
          <p>We sent an OTP to {email}.</p>
          <label>OTP</label>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="123456"
            style={{ width: "100%", padding: 8, marginTop: 8 }}
          />
          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <button onClick={verifyOtp} disabled={loading || otp.length === 0}>
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
            <button onClick={() => setStep("enter-email")} disabled={loading}>Change email</button>
          </div>
        </div>
      )}
      {message && <p style={{ color: "green", marginTop: 12 }}>{message}</p>}
      {error && <p style={{ color: "red", marginTop: 12 }}>{error}</p>}
    </div>
  );
}


