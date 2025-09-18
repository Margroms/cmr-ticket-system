"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data, error } = await authClient.session.get();
        if (!mounted) return;
        const has = !!data?.session && !error;
        setAuthed(has);
        setChecking(false);
        if (!has) router.replace("/");
      } catch {
        if (!mounted) return;
        setAuthed(false);
        setChecking(false);
        router.replace("/");
      }
    })();
    return () => {
      mounted = false;
    };
  }, [router]);

  if (checking) {
    return (
      <div className="min-h-dvh w-full bg-black text-neutral-200 grid place-items-center">
        <div className="h-8 w-8 rounded-full border-2 border-white/20 border-t-white animate-spin" />
      </div>
    );
  }

  if (!authed) return null;
  return <>{children}</>;
}



