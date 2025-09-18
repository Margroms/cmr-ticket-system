"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function AppHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthed, setIsAuthed] = useState(false);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const { data } = await authClient.session.get();
        if (!isMounted) return;
        const emailAddr = (data?.session?.user?.email as string | undefined) ?? null;
        setIsAuthed(!!data?.session);
        setEmail(emailAddr);
      } catch {
        if (!isMounted) return;
        setIsAuthed(false);
        setEmail(null);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  const signOut = async () => {
    await authClient.signOut();
    router.replace("/");
  };

  const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
    const active = pathname === href;
    return (
      <Link
        href={href}
        className={
          "h-9 px-3 rounded-lg text-sm font-medium ring-1 transition-colors " +
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
        <div />
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
            <Link
              href="/"
              className="h-10 px-5 rounded-xl text-sm font-medium bg-white text-black ring-1 ring-white/70 hover:bg-neutral-100 active:translate-y-[1px] transition-all flex items-center justify-center"
            >
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}


