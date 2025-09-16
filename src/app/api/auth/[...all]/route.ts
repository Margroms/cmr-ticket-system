import { auth } from "@/lib/auth";

// Force Node.js runtime so Nodemailer and other Node APIs work.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const GET = auth.handler;
export const POST = auth.handler;
export const PUT = auth.handler;
export const DELETE = auth.handler;
export const PATCH = auth.handler;
export const HEAD = auth.handler;


