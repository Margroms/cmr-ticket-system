export { auth as middleware } from "./lib/auth";

export const config = {
  matcher: ["/booking/:path*", "/payment/:path*", "/ticket/:path*"],
};
