"use client";

import React, { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [dob, setDob] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [saving, setSaving] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await (authClient as any).session?.get?.();
      const emailAddr = (data?.session?.user?.email as string | undefined) ?? "";
      setEmail(emailAddr);
      // Pre-fill from localStorage as a simple placeholder profile store
      setName(localStorage.getItem("profile:name") ?? "");
      setDob(localStorage.getItem("profile:dob") ?? "");
      setPhone(localStorage.getItem("profile:phone") ?? "");
    })();
  }, []);

  const save = async () => {
    setSaving(true);
    setMessage(null);
    try {
      // Placeholder: persist to localStorage for now
      localStorage.setItem("profile:name", name);
      localStorage.setItem("profile:dob", dob);
      localStorage.setItem("profile:phone", phone);
      setMessage("Saved");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-dvh w-full bg-black text-neutral-200 flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-3xl bg-neutral-900/95 ring-1 ring-white/10 shadow-2xl p-6">
        <div className="flex items-center gap-3 mb-2">
          <button
            onClick={() => router.push("/ticket")}
            aria-label="Back"
            className="h-9 w-9 rounded-full grid place-items-center bg-neutral-800 ring-1 ring-white/10 text-neutral-200 hover:bg-neutral-700 transition-colors"
          >
            ←
          </button>
          <h1 className="text-xl font-semibold">Profile</h1>
        </div>
        <div className="mt-6 space-y-4">
          <div>
            <label className="block text-sm text-neutral-400">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              className="mt-1 w-full rounded-2xl bg-neutral-800 text-neutral-100 placeholder:text-neutral-500 px-4 py-3 outline-none ring-1 ring-white/10 focus:ring-white/30"
            />
          </div>
          <div>
            <label className="block text-sm text-neutral-400">Date of Birth</label>
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="mt-1 w-full rounded-2xl bg-neutral-800 text-neutral-100 px-4 py-3 outline-none ring-1 ring-white/10 focus:ring-white/30"
            />
          </div>
          <div>
            <label className="block text-sm text-neutral-400">Phone Number</label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. 9876543210"
              className="mt-1 w-full rounded-2xl bg-neutral-800 text-neutral-100 placeholder:text-neutral-500 px-4 py-3 outline-none ring-1 ring-white/10 focus:ring-white/30"
            />
          </div>
          <div>
            <label className="block text-sm text-neutral-400">Email</label>
            <input
              value={email}
              readOnly
              className="mt-1 w-full rounded-2xl bg-neutral-900 text-neutral-400 px-4 py-3 outline-none ring-1 ring-white/10"
            />
          </div>
          <button
            onClick={save}
            disabled={saving}
            className="w-full h-12 rounded-xl bg-white text-black font-medium ring-1 ring-white/70 shadow-[0_1px_0_0_rgba(255,255,255,0.1)_inset] hover:bg-neutral-100 active:translate-y-[1px] transition-all duration-200 ease-out"
          >
            {saving ? "Saving…" : "Save Profile"}
          </button>
          {message && <p className="text-sm text-emerald-400">{message}</p>}
        </div>
      </div>
    </div>
  );
}


