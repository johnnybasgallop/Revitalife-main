import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-07-30.basil",
});

export async function POST(request: NextRequest) {
  try {
    const { stripeCustomerId, address } = await request.json();

    if (!stripeCustomerId || !address) {
      return NextResponse.json(
        { error: "Stripe customer ID and address are required" },
        { status: 400 }
      );
    }

    // Update customer shipping address in Stripe
    const customer = await stripe.customers.update(stripeCustomerId, {
      shipping: {
        name: "Customer",
        address: {
          line1: address.line1,
          line2: address.line2 || undefined,
          city: address.city,
          state: address.state,
          postal_code: address.postal_code,
          country: address.country,
        },
      },
    });

    return NextResponse.json({
      success: true,
      customer: {
        id: customer.id,
        shipping: customer.shipping,
      },
    });
  } catch (error) {
    console.error("Error updating shipping address:", error);
    return NextResponse.json(
      { error: "Failed to update shipping address" },
      { status: 500 }
    );
  }
}
