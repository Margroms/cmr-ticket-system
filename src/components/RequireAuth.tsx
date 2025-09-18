"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase-client";

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      const has = !!data.session;
      setAuthed(has);
      setChecking(false);
      if (!has) router.replace("/");
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, sess) => {
      setAuthed(!!sess);
      if (!sess) router.replace("/");
    });
    return () => {
      sub?.subscription?.unsubscribe?.();
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



