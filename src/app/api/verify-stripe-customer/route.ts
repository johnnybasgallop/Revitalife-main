import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-07-30.basil",
});

export async function POST(request: NextRequest) {
  try {
    const { stripeCustomerId } = await request.json();

    if (!stripeCustomerId) {
      return NextResponse.json(
        { error: "Stripe customer ID is required" },
        { status: 400 }
      );
    }

    console.log("🔍 Verifying Stripe customer:", stripeCustomerId);

    // Try to retrieve the customer from Stripe
    const customer = await stripe.customers.retrieve(stripeCustomerId);

    if (customer && !customer.deleted) {
      console.log("✅ Customer exists:", customer.id);
      return NextResponse.json({
        exists: true,
        customer: {
          id: customer.id,
          email: customer.email,
          name: customer.name,
        },
      });
    } else {
      console.log("❌ Customer not found or deleted:", stripeCustomerId);
      return NextResponse.json({
        exists: false,
        error: "Customer not found or deleted",
      });
    }
  } catch (error) {
    console.error("❌ Error verifying Stripe customer:", error);

    if (error instanceof Error) {
      if (error.message.includes("No such customer")) {
        return NextResponse.json({
          exists: false,
          error: "Customer not found",
        });
      }
    }

    return NextResponse.json(
      { error: "Failed to verify customer" },
      { status: 500 }
    );
  }
}
