import { NextResponse } from "next/server";

// Dummy allow-all middleware to avoid Edge runtime importing Node-only modules.
export function middleware() {
  return NextResponse.next();
}

export const config = {
  // If you want to protect routes later with real auth, adjust this.
  matcher: ["/booking/:path*", "/payment/:path*", "/ticket/:path*"],
};
