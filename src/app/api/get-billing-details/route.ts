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

    // Fetch customer details from Stripe
    const customer = await stripe.customers.retrieve(stripeCustomerId, {
      expand: ["shipping", "invoice_settings.default_payment_method"],
    });

    if (!customer || customer.deleted) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      );
    }

    // Fetch payment methods
    const paymentMethods = await stripe.paymentMethods.list({
      customer: stripeCustomerId,
      type: "card",
    });

    // Format the response
    const billingDetails = {
      shipping_address: customer.shipping?.address
        ? {
            line1: customer.shipping.address.line1,
            line2: customer.shipping.address.line2,
            city: customer.shipping.address.city,
            state: customer.shipping.address.state,
            postal_code: customer.shipping.address.postal_code,
            country: customer.shipping.address.country,
          }
        : null,
      payment_methods: paymentMethods.data.map((method) => ({
        id: method.id,
        type: method.type,
        card: method.card
          ? {
              brand: method.card.brand,
              last4: method.card.last4,
              exp_month: method.card.exp_month,
              exp_year: method.card.exp_year,
            }
          : undefined,
      })),
    };

    return NextResponse.json(billingDetails);
  } catch (error) {
    console.error("Error fetching billing details:", error);
    return NextResponse.json(
      { error: "Failed to fetch billing details" },
      { status: 500 }
    );
  }
}
