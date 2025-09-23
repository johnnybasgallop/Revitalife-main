import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-07-30.basil",
});

// Stripe Price IDs - replace these with your actual price IDs from Stripe Dashboard
const STRIPE_PRICES = {
  oneTime: process.env.STRIPE_ONETIME_PRICE_ID || "price_1ABC123...", // Replace with actual price ID
  subscription: process.env.STRIPE_SUBSCRIPTION_PRICE_ID || "price_1XYZ789...", // Replace with actual price ID
};

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

    const { items, customerId, userEmail, returnUrl } = await request.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "No items provided" }, { status: 400 });
    }

    // Check if any items are subscriptions
    const hasSubscriptions = items.some((item: any) => item.isSubscription);

    if (hasSubscriptions && !customerId) {
      return NextResponse.json(
        { error: "Customer ID required for subscriptions" },
        { status: 400 }
      );
    }

    let stripeCustomerId = customerId;

    // If we have subscriptions and a customer ID, ensure the customer exists in Stripe
    if (hasSubscriptions && customerId) {
      try {
        // Try to retrieve the customer from Stripe
        await stripe.customers.retrieve(customerId);
        stripeCustomerId = customerId;
      } catch (error: any) {
        // If customer doesn't exist in Stripe, create a new one
        if (error.code === "resource_missing") {
          console.log(`Creating new Stripe customer for user: ${customerId}`);
          const newCustomer = await stripe.customers.create({
            email: userEmail,
            metadata: {
              source: "revitalife_app",
              supabase_user_id: customerId,
            },
          });
          stripeCustomerId = newCustomer.id;
          console.log(`Created Stripe customer: ${stripeCustomerId}`);
        } else {
          throw error;
        }
      }
    }

    // Create line items using pre-created Stripe Price IDs
    const lineItems = items.map((item: any) => {
      // Use the stripePriceId from the basket item if available, otherwise fall back to default prices
      if (item.stripePriceId) {
        return {
          price: item.stripePriceId,
          quantity: item.quantity,
        };
      } else if (item.isSubscription) {
        // Use pre-created subscription price ID
        return {
          price: STRIPE_PRICES.subscription,
          quantity: item.quantity,
        };
      } else {
        // Use pre-created one-time price ID
        return {
          price: STRIPE_PRICES.oneTime,
          quantity: item.quantity,
        };
      }
    });

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const safeCancelUrl =
      typeof returnUrl === "string" && returnUrl.startsWith("http")
        ? returnUrl
        : baseUrl;

    // Create checkout session configuration
    const sessionConfig: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: hasSubscriptions ? "subscription" : "payment",
      currency: "gbp", // Force GBP currency

      // Customer configuration for subscriptions
      ...(hasSubscriptions &&
        stripeCustomerId && {
          customer: stripeCustomerId,
        }),

      // Success and cancel URLs
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: safeCancelUrl,

      // Customer email collection (only for one-time purchases)
      ...(hasSubscriptions ? {} : { customer_email: undefined }),

      // Billing address collection
      billing_address_collection: "required",

      // Shipping address collection (UK-focused)
      shipping_address_collection: {
        allowed_countries: ["GB", "IE", "DE", "FR", "NL", "BE"], // UK and nearby EU countries
      },

      // Enhanced branding and customization
      ...(hasSubscriptions ? {} : { submit_type: "pay" }), // Only set submit_type for one-time payments
      allow_promotion_codes: true, // Enable discount codes
      locale: "en-GB", // Force UK locale

      // Custom text and branding
      custom_text: {
        submit: {
          message: hasSubscriptions
            ? "Your subscription will be processed securely by Stripe. You'll be charged monthly and can cancel anytime."
            : "Your order will be processed securely by Stripe. You'll receive a confirmation email once payment is complete.",
        },
        shipping_address: {
          message:
            "We'll ship your order to this address. Please ensure it's correct for timely delivery.",
        },
      },

      metadata: {
        items: JSON.stringify(
          items.map((item: any) => ({
            id: item.id,
            name: item.name,
            quantity: item.quantity,
            isSubscription: item.isSubscription,
            subscriptionInterval: item.subscriptionInterval,
          }))
        ),
        hasSubscriptions: hasSubscriptions.toString(),
        customer_id: stripeCustomerId || "guest",
        currency: "gbp",
        country: "gb",
      },
    };

    // Add shipping options only for one-time purchases (GBP pricing)
    if (!hasSubscriptions) {
      sessionConfig.shipping_options = [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: 0,
              currency: "gbp",
            },
            display_name: "Free UK shipping",
            delivery_estimate: {
              minimum: {
                unit: "business_day",
                value: 2,
              },
              maximum: {
                unit: "business_day",
                value: 5,
              },
            },
          },
        },
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: 499, // £4.99 in pence
              currency: "gbp",
            },
            display_name: "Express UK shipping",
            delivery_estimate: {
              minimum: {
                unit: "business_day",
                value: 1,
              },
              maximum: {
                unit: "business_day",
                value: 2,
              },
            },
          },
        },
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: 999, // £9.99 in pence
              currency: "gbp",
            },
            display_name: "International shipping",
            delivery_estimate: {
              minimum: {
                unit: "business_day",
                value: 3,
              },
              maximum: {
                unit: "business_day",
                value: 7,
              },
            },
          },
        },
      ];
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create(sessionConfig);

    // Log the session details for debugging
    console.log("Stripe session created:", {
      id: session.id,
      url: session.url,
      status: session.status,
      mode: session.mode,
      hasSubscriptions,
      customerId: stripeCustomerId,
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
