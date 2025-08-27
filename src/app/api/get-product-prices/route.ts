import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-07-30.basil",
});

export async function GET() {
  try {
    // Check if Stripe key is configured
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: "Stripe is not configured" },
        { status: 500 }
      );
    }

    const oneTimePriceId = process.env.STRIPE_ONETIME_PRICE_ID;
    const subscriptionPriceId = process.env.STRIPE_SUBSCRIPTION_PRICE_ID;

    if (!oneTimePriceId || !subscriptionPriceId) {
      return NextResponse.json(
        { error: "Stripe price IDs not configured" },
        { status: 500 }
      );
    }

    // Fetch both prices from Stripe
    const [oneTimePrice, subscriptionPrice] = await Promise.all([
      stripe.prices.retrieve(oneTimePriceId),
      stripe.prices.retrieve(subscriptionPriceId),
    ]);

    // Calculate savings percentages (GBP pricing)
    const originalPrice = 56.99;
    const oneTimeSavings = (
      ((originalPrice - oneTimePrice.unit_amount! / 100) / originalPrice) *
      100
    ).toFixed(0);
    const subscriptionSavings = (
      ((originalPrice - subscriptionPrice.unit_amount! / 100) / originalPrice) *
      100
    ).toFixed(0);

    const pricing = {
      oneTime: {
        original: originalPrice,
        sale: oneTimePrice.unit_amount! / 100,
        savings: parseInt(oneTimeSavings),
        priceId: oneTimePrice.id,
        currency: "gbp",
      },
      subscription: {
        original: originalPrice,
        sale: subscriptionPrice.unit_amount! / 100,
        savings: parseInt(subscriptionSavings),
        interval: "monthly",
        priceId: subscriptionPrice.id,
        currency: "gbp",
      },
    };

    return NextResponse.json({ pricing });
  } catch (error) {
    console.error("Error fetching product prices:", error);
    return NextResponse.json(
      { error: "Failed to fetch product prices" },
      { status: 500 }
    );
  }
}
