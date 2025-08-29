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

    console.log(
      "🔍 Fetching subscription details for customer:",
      stripeCustomerId
    );

    // Get all subscriptions for the customer
    const subscriptions = await stripe.subscriptions.list({
      customer: stripeCustomerId,
      status: "active",
      limit: 1,
      expand: ["data.items.data.price", "data.default_payment_method"],
    });

    if (subscriptions.data.length === 0) {
      return NextResponse.json({
        subscription: null,
        message: "No active subscriptions found",
      });
    }

    const subscription = subscriptions.data[0];
    console.log("✅ Found active subscription:", subscription.id);

    // Debug: Log the raw subscription object to see what Stripe is actually sending
    console.log(
      "🔍 Raw Stripe subscription object:",
      JSON.stringify(subscription, null, 2)
    );
    console.log(
      "🔍 current_period_start type:",
      typeof (subscription as any).current_period_start,
      "value:",
      (subscription as any).current_period_start
    );
    console.log(
      "🔍 current_period_end type:",
      typeof (subscription as any).current_period_end,
      "value:",
      (subscription as any).current_period_end
    );

    // Try to get the subscription directly to see if that gives us more data
    try {
      const detailedSubscription = await stripe.subscriptions.retrieve(
        subscription.id,
        {
          expand: ["items.data.price", "default_payment_method"],
        }
      );
      console.log("🔍 Detailed subscription from retrieve:", {
        id: detailedSubscription.id,
        current_period_start: (detailedSubscription as any)
          .current_period_start,
        current_period_end: (detailedSubscription as any).current_period_end,
        status: detailedSubscription.status,
      });

      // Use the detailed subscription if it has the period dates
      if (
        (detailedSubscription as any).current_period_start &&
        (detailedSubscription as any).current_period_end
      ) {
        console.log("✅ Found period dates in detailed subscription");
        (subscription as any).current_period_start = (
          detailedSubscription as any
        ).current_period_start;
        (subscription as any).current_period_end = (
          detailedSubscription as any
        ).current_period_end;
      }
    } catch (error) {
      console.warn("⚠️ Could not retrieve detailed subscription:", error);
    }

    // Format the subscription data
    const subscriptionDetails = {
      id: subscription.id,
      status: subscription.status,
      plan_type:
        subscription.items.data[0]?.price.recurring?.interval || "monthly",
      quantity: subscription.items.data[0]?.quantity || 1,
      current_period_start: (subscription as any).current_period_start
        ? new Date(
            (subscription as any).current_period_start * 1000
          ).toISOString()
        : null,
      current_period_end: (subscription as any).current_period_end
        ? new Date(
            (subscription as any).current_period_end * 1000
          ).toISOString()
        : null,
      cancel_at_period_end: (subscription as any).cancel_at_period_end,
      trial_end: (subscription as any).trial_end
        ? new Date((subscription as any).trial_end * 1000).toISOString()
        : null,
      next_billing_date: (subscription as any).current_period_end
        ? new Date(
            (subscription as any).current_period_end * 1000
          ).toISOString()
        : null,
      stripe_price_id: subscription.items.data[0]?.price.id || "",
    };

    // If Stripe didn't provide period dates, try to calculate them
    if (
      !subscriptionDetails.current_period_start ||
      !subscriptionDetails.current_period_end
    ) {
      console.log("🔄 Calculating billing periods manually...");

      const created = (subscription as any).created;
      const interval = subscription.items.data[0]?.price.recurring?.interval;

      if (created && interval) {
        const startDate = new Date(created * 1000);
        let endDate = new Date(startDate);

        // Calculate end date based on interval
        if (interval === "month") {
          endDate.setMonth(endDate.getMonth() + 1);
        } else if (interval === "year") {
          endDate.setFullYear(endDate.getFullYear() + 1);
        } else if (interval === "week") {
          endDate.setDate(endDate.getDate() + 7);
        } else if (interval === "day") {
          endDate.setDate(endDate.getDate() + 1);
        }

        subscriptionDetails.current_period_start = startDate.toISOString();
        subscriptionDetails.current_period_end = endDate.toISOString();
        subscriptionDetails.next_billing_date = endDate.toISOString();

        console.log("✅ Calculated billing periods:", {
          start: subscriptionDetails.current_period_start,
          end: subscriptionDetails.current_period_end,
          interval,
        });
      }
    }

    console.log("📊 Subscription details:", subscriptionDetails);

    return NextResponse.json({
      subscription: subscriptionDetails,
      success: true,
    });
  } catch (error) {
    console.error("❌ Error fetching subscription details:", error);
    return NextResponse.json(
      { error: "Failed to fetch subscription details" },
      { status: 500 }
    );
  }
}
