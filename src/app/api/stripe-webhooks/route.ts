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
    console.log("🔄 Webhook received - starting processing");

    const body = await request.text();
    const signature = request.headers.get("stripe-signature");

    if (!signature) {
      console.error("❌ Missing stripe-signature header");
      return NextResponse.json(
        { error: "Missing stripe-signature header" },
        { status: 400 }
      );
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
      console.log("✅ Webhook signature verified successfully");
    } catch (err) {
      console.error("❌ Webhook signature verification failed:", err);
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    console.log("🎯 Processing webhook event:", event.type);
    console.log("📋 Event data:", JSON.stringify(event.data, null, 2));

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed":
        console.log("🛒 Processing checkout.session.completed");
        await handleCheckoutSessionCompleted(
          event.data.object as Stripe.Checkout.Session
        );
        break;

      case "customer.subscription.created":
        console.log("📅 Processing customer.subscription.created");
        await handleSubscriptionCreated(
          event.data.object as Stripe.Subscription
        );
        break;

      case "customer.subscription.updated":
        console.log("🔄 Processing customer.subscription.updated");
        await handleSubscriptionUpdated(
          event.data.object as Stripe.Subscription
        );
        break;

      case "customer.subscription.deleted":
        console.log("🗑️ Processing customer.subscription.deleted");
        await handleSubscriptionDeleted(
          event.data.object as Stripe.Subscription
        );
        break;

      case "invoice.payment_succeeded":
        console.log("💰 Processing invoice.payment_succeeded");
        await handleInvoicePaymentSucceeded(
          event.data.object as Stripe.Invoice
        );
        break;

      case "invoice.payment_failed":
        console.log("💸 Processing invoice.payment_failed");
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      default:
        console.log(`⚠️ Unhandled event type: ${event.type}`);
    }

    console.log("✅ Webhook processing completed successfully");
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("❌ Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}

async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session
) {
  console.log(
    "🛒 Starting handleCheckoutSessionCompleted for session:",
    session.id
  );

  try {
    // Extract customer and subscription info
    const customerId = session.customer as string;
    const subscriptionId = session.subscription as string;
    const customerEmail = session.customer_details?.email;

    console.log("📋 Session data:", {
      customerId,
      subscriptionId,
      customerEmail,
      mode: session.mode,
    });

    if (!customerId || !subscriptionId || !customerEmail) {
      console.error("❌ Missing required session data:", {
        customerId,
        subscriptionId,
        customerEmail,
      });
      return;
    }

    // Get customer details from Stripe
    console.log("🔍 Retrieving customer from Stripe:", customerId);
    const customer = await stripe.customers.retrieve(customerId);
    if (customer.deleted) {
      console.error("❌ Customer was deleted:", customerId);
      return;
    }
    console.log("✅ Customer retrieved successfully:", customer.id);

    // Find the user by email in Supabase (this is the key fix!)
    console.log("🔍 Looking for user profile with email:", customerEmail);

    // Debug: Let's see all profiles to understand what's happening
    const { data: allProfiles, error: allProfilesError } = await supabase
      .from("profiles")
      .select("id, email");

    if (allProfilesError) {
      console.error("❌ Error fetching all profiles:", allProfilesError);
    } else {
      console.log("📋 All profiles in table:", allProfiles);
    }

    const { data: profiles, error: profileError } = await supabase
      .from("profiles")
      .select("id")
      .eq("email", customerEmail)
      .single();

    if (profileError) {
      console.error("❌ Error finding user profile:", profileError);
      return;
    }

    if (!profiles) {
      console.error("❌ No profile found for email:", customerEmail);
      return;
    }

    const userId = profiles.id;
    console.log("✅ Found user profile:", userId);

    // Update profile with Stripe customer ID
    console.log("🔄 Updating profile with Stripe customer ID");
    await SubscriptionService.updateStripeCustomerId(userId, customerId);
    console.log("✅ Profile updated with Stripe customer ID");

    // Get subscription details from Stripe
    console.log(
      "🔍 Retrieving subscription details from Stripe:",
      subscriptionId
    );
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    console.log("✅ Subscription retrieved:", subscription.status);

    // Create subscription record in database
    console.log("💾 Creating subscription record in database");

    // Fix the date conversion - check if values exist and are valid
    let currentPeriodStart = null;
    let currentPeriodEnd = null;

    // Access subscription properties safely
    const periodStart = (subscription as any).current_period_start;
    const periodEnd = (subscription as any).current_period_end;

    if (periodStart) {
      try {
        // Stripe sends Unix timestamp in seconds, convert to milliseconds
        const timestamp = periodStart;
        console.log("🔍 Processing current_period_start timestamp:", timestamp);

        if (typeof timestamp === "number" && timestamp > 0) {
          currentPeriodStart = new Date(timestamp * 1000).toISOString();
          console.log(
            "✅ Converted current_period_start to:",
            currentPeriodStart
          );
        } else {
          console.warn("⚠️ Invalid current_period_start timestamp:", timestamp);
        }
      } catch (error) {
        console.warn(
          "⚠️ Error converting current_period_start:",
          error,
          "Value:",
          periodStart
        );
      }
    } else {
      console.log("ℹ️ No current_period_start in subscription");
    }

    if (periodEnd) {
      try {
        // Stripe sends Unix timestamp in seconds, convert to milliseconds
        const timestamp = periodEnd;
        console.log("🔍 Processing current_period_end timestamp:", timestamp);

        if (typeof timestamp === "number" && timestamp > 0) {
          currentPeriodEnd = new Date(timestamp * 1000).toISOString();
          console.log("✅ Converted current_period_end to:", currentPeriodEnd);
        } else {
          console.warn("⚠️ Invalid current_period_end timestamp:", timestamp);
        }
      } catch (error) {
        console.warn(
          "⚠️ Error converting current_period_end:",
          error,
          "Value:",
          periodEnd
        );
      }
    } else {
      console.log("ℹ️ No current_period_end in subscription");
    }

    const subscriptionRecord = await SubscriptionService.createSubscription({
      user_id: userId,
      stripe_subscription_id: subscriptionId,
      stripe_customer_id: customerId,
      status: subscription.status,
      plan_type:
        subscription.items.data[0]?.price.recurring?.interval || "monthly",
      stripe_price_id: subscription.items.data[0]?.price.id || "",
      quantity: subscription.items.data[0]?.quantity || 1,
      current_period_start: currentPeriodStart || undefined,
      current_period_end: currentPeriodEnd || undefined,
    });

    console.log("✅ Subscription created successfully for user:", userId);
    console.log("📊 Subscription record:", subscriptionRecord);

    // Update the profile's subscription status
    console.log("🔄 Updating profile subscription status to active");
    const { error: profileUpdateError } = await supabase
      .from("profiles")
      .update({ subscription_status: "active" })
      .eq("id", userId);

    if (profileUpdateError) {
      console.error(
        "❌ Error updating profile subscription status:",
        profileUpdateError
      );
    } else {
      console.log("✅ Profile subscription status updated to active");
    }
  } catch (error) {
    console.error("❌ Error in handleCheckoutSessionCompleted:", error);
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
  console.log("🔄 Processing subscription updated:", subscription.id);

  try {
    const customerId = subscription.customer as string;

    // Find user by Stripe customer ID
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id")
      .eq("stripe_customer_id", customerId)
      .single();

    if (!profiles) {
      console.error("❌ No profile found for Stripe customer:", customerId);
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

    // Update profile subscription status based on subscription status
    let profileStatus = "inactive";
    if (subscription.status === "active") {
      profileStatus = "active";
    } else if (
      subscription.status === "canceled" ||
      subscription.status === "unpaid"
    ) {
      profileStatus = "inactive";
    } else if (subscription.status === "past_due") {
      profileStatus = "past_due";
    }

    console.log("🔄 Updating profile subscription status to:", profileStatus);
    const { error: profileUpdateError } = await supabase
      .from("profiles")
      .update({ subscription_status: profileStatus })
      .eq("id", userId);

    if (profileUpdateError) {
      console.error(
        "❌ Error updating profile subscription status:",
        profileUpdateError
      );
    } else {
      console.log("✅ Profile subscription status updated to:", profileStatus);
    }

    console.log("✅ Subscription updated successfully for user:", userId);
  } catch (error) {
    console.error("❌ Error handling subscription updated:", error);
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
    if ((invoice as any).subscription) {
      const subscription = await stripe.subscriptions.retrieve(
        (invoice as any).subscription as string
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
    if ((invoice as any).subscription) {
      const subscription = await stripe.subscriptions.retrieve(
        (invoice as any).subscription as string
      );
      await handleSubscriptionUpdated(subscription);
    }
  } catch (error) {
    console.error("Error handling invoice payment failed:", error);
  }
}
