import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase-client";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const ticket_id = searchParams.get("ticket_id");
    const admin_user = searchParams.get("admin_user");

    if (!ticket_id || !admin_user) {
      return NextResponse.json(
        { error: "Missing ticket_id or admin_user parameter" },
        { status: 400 }
      );
    }

    // Simple admin authentication check
    if (admin_user !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Fetch the ticket
    const { data: ticket, error: fetchError } = await supabase
      .from("tickets")
      .select("*")
      .eq("id", ticket_id)
      .single();

    if (fetchError || !ticket) {
      return NextResponse.json(
        { error: "Ticket not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      ticket: ticket
    });

  } catch (error) {
    console.error("Admin ticket lookup API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}