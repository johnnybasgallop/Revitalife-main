import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, notifications } = await request.json();

    // Basic validation
    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }

    // Insert the signup data into Supabase
    const { data, error } = await supabase
      .from("app_signups")
      .insert([
        {
          name,
          email,
          phone: phone || null,
          notifications: notifications || false,
        },
      ])
      .select();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to save signup data" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Successfully signed up for early access!",
        data,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("App signup error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}


