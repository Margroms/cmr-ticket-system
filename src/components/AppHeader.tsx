"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase-client";

export default function AppHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthed, setIsAuthed] = useState(false);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    supabase.auth.getUser().then(({ data }) => {
      if (!isMounted) return;
      setIsAuthed(!!data.user);
      setEmail(data.user?.email ?? null);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, sess) => {
      setIsAuthed(!!sess);
      setEmail(sess?.user?.email ?? null);
    });
    return () => {
      sub?.subscription?.unsubscribe?.();
      isMounted = false;
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    router.replace("/");
  };

  const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
    const active = pathname === href;
    return (
      <Link
        href={href}
        className={
          "h-10 px-5 rounded-xl text-sm font-medium ring-1 transition-all flex items-center justify-center " +
          (active
            ? "bg-white text-black ring-white"
            : "bg-neutral-900 text-neutral-300 ring-white/10 hover:bg-neutral-800")
        }
      >
        {children}
      </Link>
    );
  };

  return (
    <header className="w-full sticky top-0 z-40 bg-black/60 backdrop-blur supports-[backdrop-filter]:bg-black/40">
      <div className="mx-auto max-w-5xl px-6 py-4 flex items-center justify-between">
        {pathname !== "/" ? (
          <button
            onClick={() => {
              if (typeof window !== "undefined" && window.history.length > 1) {
                router.back();
              } else {
                router.push("/");
              }
            }}
            aria-label="Go back"
            className="h-10 w-10 rounded-xl ring-1 ring-white/10 hover:bg-neutral-800 flex items-center justify-center text-neutral-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
              <path fillRule="evenodd" d="M9.53 4.47a.75.75 0 010 1.06L4.81 10.25H21a.75.75 0 010 1.5H4.81l4.72 4.72a.75.75 0 11-1.06 1.06l-6-6a.75.75 0 010-1.06l6-6a.75.75 0 011.06 0z" clipRule="evenodd" />
            </svg>
          </button>
        ) : (
          <> </>
        )}
        <nav className="flex items-center gap-3">
          {isAuthed ? (
            <>
              <NavLink href="/profile">Profile</NavLink>
              <button
                onClick={signOut}
                className="h-10 px-5 rounded-xl text-sm font-medium bg-white text-black ring-1 ring-white/70 hover:bg-neutral-100 active:translate-y-[1px] transition-all flex items-center justify-center"
                title={email ?? undefined}
              >
                Logout
              </button>
            </>
          ) : (
            <> </>
          )}
        </nav>
      </div>
    </header>
  );
}


