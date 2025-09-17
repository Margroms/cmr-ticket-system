"use client";

import { createAuthClient } from "better-auth/client";
import { emailOTPClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL:
    typeof window !== "undefined"
      ? (process.env.NEXT_PUBLIC_APP_URL || window.location.origin)
      : process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  plugins: [emailOTPClient()],
});


