import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Create a Supabase client for the cron job
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET() {
  try {
    // Verify this is called by Vercel Cron
    // In production, you might want to add additional security checks

    // Perform a simple query to keep the database active
    // We'll just count the profiles - this is lightweight and non-intrusive
    const { count, error } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true });

    if (error) {
      console.error("Keep-alive query failed:", error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    console.log(`✅ Keep-alive successful - ${count} profiles in database`);

    return NextResponse.json({
      success: true,
      message: "Database keep-alive successful",
      timestamp: new Date().toISOString(),
      profileCount: count,
    });
  } catch (error) {
    console.error("Keep-alive error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
