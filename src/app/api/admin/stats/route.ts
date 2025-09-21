import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase-client";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const admin_user = searchParams.get("admin_user");

    // Simple admin authentication check
    if (admin_user !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get total tickets count
    const { count: totalTickets, error: totalError } = await supabase
      .from("tickets")
      .select("*", { count: "exact", head: true });

    if (totalError) {
      throw totalError;
    }

    // Get checked-in tickets count
    const { count: checkedInTickets, error: checkedInError } = await supabase
      .from("tickets")
      .select("*", { count: "exact", head: true })
      .eq("checked_in", true);

    if (checkedInError) {
      throw checkedInError;
    }

    // Get tickets by gender
    const { data: genderStats, error: genderError } = await supabase
      .from("tickets")
      .select("gender")
      .not("gender", "is", null);

    if (genderError) {
      throw genderError;
    }

    const boyTickets = genderStats?.filter(t => t.gender === "Boy").length || 0;
    const girlTickets = genderStats?.filter(t => t.gender === "Girl").length || 0;

    // Get recent tickets
    const { data: recentTickets, error: recentError } = await supabase
      .from("tickets")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10);

    if (recentError) {
      throw recentError;
    }

    return NextResponse.json({
      success: true,
      stats: {
        totalTickets: totalTickets || 0,
        checkedInTickets: checkedInTickets || 0,
        pendingTickets: (totalTickets || 0) - (checkedInTickets || 0),
        boyTickets,
        girlTickets,
      },
      recentTickets: recentTickets || []
    });

  } catch (error) {
    console.error("Admin stats API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}