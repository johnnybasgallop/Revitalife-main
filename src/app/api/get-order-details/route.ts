import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-07-30.basil",
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID is required" },
        { status: 400 }
      );
    }

    // Retrieve the checkout session
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items", "customer", "shipping", "billing_address"],
    });

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    // Extract relevant order information
    const orderDetails = {
      id: session.id,
      amount_total: session.amount_total,
      currency: session.currency,
      status: session.status,
      customer_email: session.customer_email,
      shipping: (session as any).shipping,
      billing_address: (session as any).billing_address,
      line_items: (session as any).line_items?.data || [],
      created: session.created,
      payment_status: session.payment_status,
      shipping_cost: (session as any).shipping_cost,
      total_details: (session as any).total_details,
    };

    return NextResponse.json(orderDetails);
  } catch (error) {
    console.error("Error fetching order details:", error);

    const errorMessage =
      process.env.NODE_ENV === "development"
        ? error instanceof Error
          ? error.message
          : "Unknown error"
        : "Failed to fetch order details";

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
