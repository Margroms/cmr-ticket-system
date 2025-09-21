import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase-client";

export async function POST(req: NextRequest) {
  try {
    const { ticket_id, action, admin_user } = await req.json();

    if (!ticket_id || !action || !admin_user) {
      return NextResponse.json(
        { error: "Missing required fields" },
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

    // Fetch the ticket first to verify it exists
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

    let updateData: any = {};

    if (action === "check_in") {
      if (ticket.checked_in) {
        return NextResponse.json(
          { error: "Ticket is already checked in" },
          { status: 400 }
        );
      }
      
      updateData = {
        checked_in: true,
        checked_in_at: new Date().toISOString(),
        checked_in_by: admin_user
      };
    } else if (action === "check_out") {
      if (!ticket.checked_in) {
        return NextResponse.json(
          { error: "Ticket is not checked in" },
          { status: 400 }
        );
      }
      
      updateData = {
        checked_in: false,
        checked_in_at: null,
        checked_in_by: null
      };
    } else {
      return NextResponse.json(
        { error: "Invalid action. Use 'check_in' or 'check_out'" },
        { status: 400 }
      );
    }

    // Update the ticket
    const { data: updatedTicket, error: updateError } = await supabase
      .from("tickets")
      .update(updateData)
      .eq("id", ticket_id)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json(
        { error: "Failed to update ticket" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Ticket ${action === "check_in" ? "checked in" : "checked out"} successfully`,
      ticket: updatedTicket
    });

  } catch (error) {
    console.error("Admin check-in API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}