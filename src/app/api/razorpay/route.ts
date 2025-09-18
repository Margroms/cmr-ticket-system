import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { amount } = await req.json();

    if (typeof amount !== "number" || isNaN(amount) || amount <= 0) {
      return NextResponse.json({ success: false, message: "Invalid amount" }, { status: 400 });
    }

    const amountInPaisa = Math.round(amount * 100);

    const key_id = process.env.RAZORPAY_KEY_ID;  
    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    if (!key_id || !key_secret) {
      return NextResponse.json({ success: false, message: "Razorpay keys missing in env" }, { status: 500 });
    }

    const { default: Razorpay } = await import("razorpay");
    const razorpay = new Razorpay({ key_id, key_secret });

    const order = await razorpay.orders.create({
      amount: amountInPaisa,
      currency: "INR",
      receipt: `receipt${Math.floor(Math.random() * 10000)}`,
      payment_capture: true,
    });

    return NextResponse.json({ success: true, order, key_id });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json(
        { success: false, message: "Failed to create order", error: error.message },
        { status: 500 }
      );
    }
    return NextResponse.json({ success: false, message: "An unexpected error occurred" }, { status: 500 });
  }
}


