import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase-client";
import { useEffect } from "react";


export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"enter-email" | "enter-otp">("enter-email");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  // Redirect if already logged in
  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      if (data.session) router.replace("/ticket");
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, sess) => {
      if (sess) router.replace("/ticket");
    });
    return () => {
      sub?.subscription?.unsubscribe?.();
      mounted = false;
    };
  }, [router]);

  const sendOtp = async () => {
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { shouldCreateUser: true },
      });
      if (error) throw error;
      setMessage("OTP sent to your email. Enter the 6-digit code.");
      setStep("enter-otp");
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Failed to send OTP";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: "email",
      });
      if (error) throw error;
      if (data?.session) {
        router.replace("/ticket");
      } else {
        throw new Error("Invalid OTP");
      }
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Invalid OTP";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-dvh w-full bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-[28px] bg-neutral-900/80 shadow-2xl ring-1 ring-white/10 p-6 sm:p-8 text-neutral-200 relative overflow-hidden">
        <div className="pointer-events-none absolute -top-24 -left-24 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute top-0 right-0 h-20 w-20 rounded-bl-[28px] bg-white/5" />
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Image 
              src="/logo.png" 
              alt="MARGROS Logo" 
              width={48} 
              height={48}
              className="rounded-lg"
            />
            <span className="text-2xl font-bold text-white">MARGROS</span>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight">Welcome Back</h1>
        </div>
        {step === "enter-email" && (
          <div className="mt-6 space-y-4">
            <label className="block text-sm text-neutral-400">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-2xl bg-neutral-800 text-neutral-100 placeholder:text-neutral-500 px-4 py-3 outline-none ring-1 ring-white/10 focus:ring-white/30 transition-shadow duration-200"
            />
            <button
              onClick={sendOtp}
              disabled={loading || !email}
              className="w-full rounded-xl bg-white text-black py-3 font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:bg-neutral-100 active:translate-y-[1px] transition-all duration-200 ease-out ring-1 ring-white/70"
            >
              {loading ? "Sending…" : "Send OTP"}
            </button>
          </div>
        )}

        {step === "enter-otp" && (
          <div className="mt-6 space-y-4">
            <p className="text-sm text-neutral-400">We sent a 6-digit code to <span className="text-neutral-200 font-medium">{email}</span>.</p>
            <label className="block text-sm text-neutral-400">One-time password</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="123456"
              className="w-full rounded-2xl bg-neutral-800 text-neutral-100 placeholder:text-neutral-500 px-4 py-3 outline-none ring-1 ring-white/10 focus:ring-white/30 tracking-[0.3em] transition-shadow duration-200"
            />
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={verifyOtp}
                disabled={loading || otp.length === 0}
                className="col-span-2 rounded-xl bg-white text-black py-3 font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:bg-neutral-100 active:translate-y-[1px] transition-all duration-200 ease-out ring-1 ring-white/70"
              >
                {loading ? "Verifying…" : "Verify OTP"}
              </button>
              <button
                type="button"
                onClick={() => { setStep("enter-email"); setOtp(""); setMessage(null); setError(null); }}
                disabled={loading}
                className="col-span-2 rounded-xl bg-neutral-900 text-neutral-200 py-3 font-medium ring-1 ring-white/10 hover:bg-neutral-800 active:translate-y-[1px] transition-all duration-200 ease-out"
              >
                Change email
              </button>
            </div>
          </div>
        )}

        {message && (
          <p className="mt-4 text-sm text-emerald-400">{message}</p>
        )}
        {error && (
          <p className="mt-4 text-sm text-red-500">{error}</p>
        )}
      </div>
    </div>
  );
}


