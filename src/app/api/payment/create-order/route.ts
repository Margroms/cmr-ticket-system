import { NextRequest, NextResponse } from "next/server";
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const amount = typeof body?.amount === "number" ? body.amount : 100; // default 500 INR in paise
    const currency = (body?.currency as string) || "INR";

    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return NextResponse.json(
        { error: "Missing RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET in env" },
        { status: 500 }
      );
    }

    const { default: Razorpay } = await import("razorpay");
    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID as string,
      key_secret: process.env.RAZORPAY_KEY_SECRET as string,
    });

    const order = await instance.orders.create({ amount, currency }).catch((err: unknown) => {
      const unknownErr = err as { error?: { code?: string; description?: string; message?: string } } | string;
      const details = (typeof unknownErr === "object" && unknownErr && "error" in unknownErr)
        ? (unknownErr as any).error
        : unknownErr;
      throw new Error(
        typeof details === "object"
          ? `${details?.code || "ORDER_ERROR"}: ${details?.description || details?.message || "Failed to create order"}`
          : String(details)
      );
    });
    return NextResponse.json({ orderId: order.id, amount: order.amount, currency: order.currency });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Failed to create order";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}


