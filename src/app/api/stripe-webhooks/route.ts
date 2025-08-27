import { SubscriptionService } from "@/lib/subscriptionService";
import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-07-30.basil",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "Missing stripe-signature header" },
        { status: 400 }
      );
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    console.log("Webhook event received:", event.type);

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutSessionCompleted(
          event.data.object as Stripe.Checkout.Session
        );
        break;

      case "customer.subscription.created":
        await handleSubscriptionCreated(
          event.data.object as Stripe.Subscription
        );
        break;

      case "customer.subscription.updated":
        await handleSubscriptionUpdated(
          event.data.object as Stripe.Subscription
        );
        break;

      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(
          event.data.object as Stripe.Subscription
        );
        break;

      case "invoice.payment_succeeded":
        await handleInvoicePaymentSucceeded(
          event.data.object as Stripe.Invoice
        );
        break;

      case "invoice.payment_failed":
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}

async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session
) {
  console.log("Processing checkout session completed:", session.id);

  try {
    // Extract customer and subscription info
    const customerId = session.customer as string;
    const subscriptionId = session.subscription as string;
    const customerEmail = session.customer_details?.email;

    if (!customerId || !subscriptionId || !customerEmail) {
      console.error("Missing required session data:", {
        customerId,
        subscriptionId,
        customerEmail,
      });
      return;
    }

    // Get customer details from Stripe
    const customer = await stripe.customers.retrieve(customerId);
    if (customer.deleted) {
      console.error("Customer was deleted:", customerId);
      return;
    }

    // Find the user by email in Supabase
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id")
      .eq("email", customerEmail)
      .single();

    if (!profiles) {
      console.error("No profile found for email:", customerEmail);
      return;
    }

    const userId = profiles.id;

    // Update profile with Stripe customer ID
    await SubscriptionService.updateStripeCustomerId(userId, customerId);

    // Get subscription details from Stripe
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);

    // Create subscription record in database
    await SubscriptionService.createSubscription({
      user_id: userId,
      stripe_subscription_id: subscriptionId,
      stripe_customer_id: customerId,
      status: subscription.status,
      plan_type:
        subscription.items.data[0]?.price.recurring?.interval || "monthly",
      stripe_price_id: subscription.items.data[0]?.price.id || "",
      quantity: subscription.items.data[0]?.quantity || 1,
      current_period_start: new Date(
        subscription.current_period_start * 1000
      ).toISOString(),
      current_period_end: new Date(
        subscription.current_period_end * 1000
      ).toISOString(),
    });

    console.log("Subscription created successfully for user:", userId);
  } catch (error) {
    console.error("Error handling checkout session completed:", error);
  }
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  console.log("Processing subscription created:", subscription.id);

  try {
    const customerId = subscription.customer as string;
    const customer = await stripe.customers.retrieve(customerId);

    if (customer.deleted) {
      console.error("Customer was deleted:", customerId);
      return;
    }

    // Find user by Stripe customer ID
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id")
      .eq("stripe_customer_id", customerId)
      .single();

    if (!profiles) {
      console.error("No profile found for Stripe customer:", customerId);
      return;
    }

    const userId = profiles.id;

    // Create or update subscription record
    await SubscriptionService.syncSubscriptionFromStripe(
      userId,
      subscription.id,
      customerId,
      subscription.items.data[0]?.price.id || "",
      subscription.status
    );

    console.log("Subscription synced successfully for user:", userId);
  } catch (error) {
    console.error("Error handling subscription created:", error);
  }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  console.log("Processing subscription updated:", subscription.id);

  try {
    const customerId = subscription.customer as string;

    // Find user by Stripe customer ID
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id")
      .eq("stripe_customer_id", customerId)
      .single();

    if (!profiles) {
      console.error("No profile found for Stripe customer:", customerId);
      return;
    }

    const userId = profiles.id;

    // Update subscription record
    await SubscriptionService.syncSubscriptionFromStripe(
      userId,
      subscription.id,
      customerId,
      subscription.items.data[0]?.price.id || "",
      subscription.status
    );

    console.log("Subscription updated successfully for user:", userId);
  } catch (error) {
    console.error("Error handling subscription updated:", error);
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  console.log("Processing subscription deleted:", subscription.id);

  try {
    const customerId = subscription.customer as string;

    // Find user by Stripe customer ID
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id")
      .eq("stripe_customer_id", customerId)
      .single();

    if (!profiles) {
      console.error("No profile found for Stripe customer:", customerId);
      return;
    }

    const userId = profiles.id;

    // Update subscription status to canceled
    const existingSubscription =
      await SubscriptionService.getSubscriptionByStripeId(subscription.id);
    if (existingSubscription) {
      await SubscriptionService.updateSubscriptionStatus(
        existingSubscription.id,
        "canceled",
        {
          cancel_at_period_end: true,
          updated_at: new Date().toISOString(),
        }
      );
    }

    console.log("Subscription marked as canceled for user:", userId);
  } catch (error) {
    console.error("Error handling subscription deleted:", error);
  }
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  console.log("Processing invoice payment succeeded:", invoice.id);

  try {
    if (invoice.subscription) {
      const subscription = await stripe.subscriptions.retrieve(
        invoice.subscription as string
      );
      await handleSubscriptionUpdated(subscription);
    }
  } catch (error) {
    console.error("Error handling invoice payment succeeded:", error);
  }
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  console.log("Processing invoice payment failed:", invoice.id);

  try {
    if (invoice.subscription) {
      const subscription = await stripe.subscriptions.retrieve(
        invoice.subscription as string
      );
      await handleSubscriptionUpdated(subscription);
    }
  } catch (error) {
    console.error("Error handling invoice payment failed:", error);
  }
}
