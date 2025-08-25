import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

export async function POST(request: NextRequest) {
  try {
    // Check if Stripe key is configured
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error("STRIPE_SECRET_KEY is not configured");
      return NextResponse.json(
        { error: "Stripe is not configured" },
        { status: 500 }
      );
    }

    const { items } = await request.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "No items provided" }, { status: 400 });
    }

    // Create line items for Stripe
    const lineItems = items.map((item: any) => {
      // Convert relative image URLs to absolute URLs for Stripe
      const imageUrl = item.image.startsWith("http")
        ? item.image
        : `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}${
            item.image
          }`;

      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
            description: item.description || "",
            images: [imageUrl],
          },
          unit_amount: Math.round(item.price * 100), // Convert to cents
        },
        quantity: item.quantity,
      };
    });

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
      }/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
      }/cancel`,
      metadata: {
        items: JSON.stringify(
          items.map((item: any) => ({
            id: item.id,
            name: item.name,
            quantity: item.quantity,
          }))
        ),
      },
    });

    // Log the session details for debugging
    console.log("Stripe session created:", {
      id: session.id,
      url: session.url,
      status: session.status,
    });

    if (!session.url) {
      console.error("Stripe session created but no URL returned:", session);
      return NextResponse.json(
        { error: "Stripe checkout session created but no URL returned" },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Error creating checkout session:", error);

    // Return more detailed error information in development
    const errorMessage =
      process.env.NODE_ENV === "development"
        ? error instanceof Error
          ? error.message
          : "Unknown error"
        : "Failed to create checkout session";

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
