import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-07-30.basil",
});

export async function POST(request: NextRequest) {
  try {
    const { stripeCustomerId, returnUrl } = await request.json();

    if (!stripeCustomerId) {
      return NextResponse.json(
        { error: "Stripe customer ID is required" },
        { status: 400 }
      );
    }

    console.log("🔍 Creating portal session for customer:", stripeCustomerId);
    console.log("🔍 Return URL:", returnUrl);

    // Create customer portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: returnUrl || `${process.env.NEXT_PUBLIC_BASE_URL}/account`,
    });

    console.log("✅ Portal session created:", session.id);
    console.log("✅ Portal URL:", session.url);

    if (!session.url) {
      console.error("❌ Portal session created but no URL returned");
      return NextResponse.json(
        { error: "Portal session created but no URL returned" },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("❌ Error creating portal session:", error);

    // Check if it's a Stripe error
    if (error instanceof Error) {
      if (error.message.includes("billing_portal")) {
        return NextResponse.json(
          {
            error:
              "Stripe Customer Portal is not enabled. Please enable it in your Stripe dashboard.",
          },
          { status: 400 }
        );
      }
      if (error.message.includes("customer")) {
        return NextResponse.json(
          { error: "Invalid customer ID or customer not found" },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { error: "Failed to create portal session" },
      { status: 500 }
    );
  }
}
