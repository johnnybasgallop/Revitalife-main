import type { Database } from "./supabase";
import { supabase } from "./supabase";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];
type Subscription = Database["public"]["Tables"]["subscriptions"]["Row"];

export class SubscriptionService {
  // Profile Management
  static async updateStripeCustomerId(
    userId: string,
    stripeCustomerId: string
  ) {
    const { error } = await supabase
      .from("profiles")
      .update({ stripe_customer_id: stripeCustomerId })
      .eq("id", userId);

    if (error) {
      console.error("Error updating stripe_customer_id:", error);
      throw error;
    }

    return { success: true };
  }

  static async getProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Error fetching profile:", error);
      return null;
    }

    return data;
  }

  // Subscription Management
  static async createSubscription(subscriptionData: {
    user_id: string;
    stripe_subscription_id: string;
    stripe_customer_id: string;
    status: string;
    plan_type: string;
    stripe_price_id: string;
    quantity: number;
    current_period_start?: string;
    current_period_end?: string;
  }): Promise<Subscription | null> {
    const { data, error } = await supabase
      .from("subscriptions")
      .insert([subscriptionData])
      .select()
      .single();

    if (error) {
      console.error("Error creating subscription:", error);
      throw error;
    }

    return data;
  }

  static async updateSubscriptionStatus(
    subscriptionId: string,
    status: string,
    additionalData?: Partial<Subscription>
  ) {
    const { error } = await supabase
      .from("subscriptions")
      .update({
        status,
        updated_at: new Date().toISOString(),
        ...additionalData,
      })
      .eq("id", subscriptionId);

    if (error) {
      console.error("Error updating subscription status:", error);
      throw error;
    }

    return { success: true };
  }

  static async getUserSubscriptions(userId: string): Promise<Subscription[]> {
    const { data, error } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching user subscriptions:", error);
      return [];
    }

    return data || [];
  }

  static async getActiveSubscription(
    userId: string
  ): Promise<Subscription | null> {
    const { data, error } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", userId)
      .eq("status", "active")
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // No active subscription found
        return null;
      }
      console.error("Error fetching active subscription:", error);
      return null;
    }

    return data;
  }

  // Utility Methods
  static async getOrCreateStripeCustomer(
    userId: string,
    email: string
  ): Promise<string> {
    // First check if user already has a Stripe customer ID
    const profile = await this.getProfile(userId);

    if (profile?.stripe_customer_id) {
      return profile.stripe_customer_id;
    }

    // If no Stripe customer ID exists, we'll need to create one
    // This should be done in the checkout API when creating the Stripe customer
    // For now, we'll return null and let the checkout API handle it
    return "";
  }

  static async syncSubscriptionFromStripe(
    userId: string,
    stripeSubscriptionId: string,
    stripeCustomerId: string,
    stripePriceId: string,
    status: string = "active"
  ) {
    // This method would be called from webhook handlers
    // to sync subscription data from Stripe
    try {
      // Check if subscription already exists
      const existingSubscription = await supabase
        .from("subscriptions")
        .select("*")
        .eq("stripe_subscription_id", stripeSubscriptionId)
        .single();

      if (existingSubscription.data) {
        // Update existing subscription
        return await this.updateSubscriptionStatus(
          existingSubscription.data.id,
          status,
          {
            stripe_customer_id: stripeCustomerId,
            stripe_price_id: stripePriceId,
            updated_at: new Date().toISOString(),
          }
        );
      } else {
        // Create new subscription
        return await this.createSubscription({
          user_id: userId,
          stripe_subscription_id: stripeSubscriptionId,
          stripe_customer_id: stripeCustomerId,
          status: status,
          plan_type: "monthly",
          stripe_price_id: stripePriceId,
          quantity: 1,
        });
      }
    } catch (error) {
      console.error("Error syncing subscription from Stripe:", error);
      throw error;
    }
  }

  // Check if user has active subscription
  static async hasActiveSubscription(userId: string): Promise<boolean> {
    const subscription = await this.getActiveSubscription(userId);
    return subscription !== null;
  }

  // Get subscription by Stripe subscription ID
  static async getSubscriptionByStripeId(
    stripeSubscriptionId: string
  ): Promise<Subscription | null> {
    const { data, error } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("stripe_subscription_id", stripeSubscriptionId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return null;
      }
      console.error("Error fetching subscription by Stripe ID:", error);
      return null;
    }

    return data;
  }
}
