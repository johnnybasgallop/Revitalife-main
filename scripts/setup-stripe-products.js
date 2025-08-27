#!/usr/bin/env node

/**
 * Stripe Product Setup Script for Revitalife
 *
 * This script creates the necessary products and prices in Stripe for:
 * 1. One-time purchase of Revitalife Superfood Mix
 * 2. Monthly subscription of Revitalife Superfood Mix
 *
 * Usage:
 * 1. Set your STRIPE_SECRET_KEY environment variable
 * 2. Run: node scripts/setup-stripe-products.js
 * 3. Copy the price IDs to your .env file
 */

const Stripe = require("stripe");

// Check if Stripe key is provided
if (!process.env.STRIPE_SECRET_KEY) {
  console.error("❌ STRIPE_SECRET_KEY environment variable is required");
  console.log("Please set it in your .env file or run:");
  console.log("export STRIPE_SECRET_KEY=sk_test_...");
  process.exit(1);
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-07-30.basil",
});

async function setupStripeProducts() {
  try {
    console.log("🚀 Setting up Stripe products for Revitalife (GBP)...\n");

    // 1. Create One-time Product
    console.log("📦 Creating one-time product...");
    const oneTimeProduct = await stripe.products.create({
      name: "Revitalife Superfood Mix (One-time)",
      description:
        "Premium superfood blend with natural ingredients for optimal wellness and vitality. Mango Flavor • 30 Servings",
      metadata: {
        category: "Superfoods",
        flavor: "Mango",
        servings: "30",
        subscription: "false",
        type: "one-time",
      },
    });
    console.log(`✅ One-time product created: ${oneTimeProduct.id}`);

    // 2. Create One-time Price (GBP)
    console.log("💰 Creating one-time price (GBP)...");
    const oneTimePrice = await stripe.prices.create({
      product: oneTimeProduct.id,
      unit_amount: 4799, // £47.99 in pence
      currency: "gbp",
      metadata: {
        type: "one-time",
        original_price: "56.99",
        sale_price: "47.99",
        savings_percentage: "16",
      },
    });
    console.log(`✅ One-time price created: ${oneTimePrice.id}`);

    // 3. Create Subscription Product
    console.log("🔄 Creating subscription product...");
    const subscriptionProduct = await stripe.products.create({
      name: "Revitalife Superfood Mix (Monthly Subscription)",
      description:
        "Premium superfood blend with natural ingredients for optimal wellness and vitality. Mango Flavor • 30 Servings • Auto-renewal",
      metadata: {
        category: "Superfoods",
        flavor: "Mango",
        servings: "30",
        subscription: "true",
        interval: "monthly",
        type: "subscription",
      },
    });
    console.log(`✅ Subscription product created: ${subscriptionProduct.id}`);

    // 4. Create Subscription Price (GBP)
    console.log("💰 Creating subscription price (GBP)...");
    const subscriptionPrice = await stripe.prices.create({
      product: subscriptionProduct.id,
      unit_amount: 3999, // £39.99 in pence
      currency: "gbp",
      recurring: {
        interval: "month",
      },
      metadata: {
        type: "subscription",
        original_price: "56.99",
        sale_price: "39.99",
        savings_percentage: "30",
        interval: "monthly",
      },
    });
    console.log(`✅ Subscription price created: ${subscriptionPrice.id}`);

    // 5. Display results
    console.log("\n🎉 Stripe setup complete! Here are your price IDs:\n");
    console.log("📋 Add these to your .env file:");
    console.log("=====================================");
    console.log(`STRIPE_ONETIME_PRICE_ID=${oneTimePrice.id}`);
    console.log(`STRIPE_SUBSCRIPTION_PRICE_ID=${subscriptionPrice.id}`);
    console.log("=====================================\n");

    console.log("📊 Product Summary (GBP):");
    console.log(`   One-time: £47.99 (${oneTimePrice.id})`);
    console.log(`   Subscription: £39.99/month (${subscriptionPrice.id})`);
    console.log(
      "\n✨ You can now use these price IDs in your checkout system!"
    );
  } catch (error) {
    console.error("❌ Error setting up Stripe products:", error.message);
    if (error.type) {
      console.error(`Error type: ${error.type}`);
    }
    process.exit(1);
  }
}

// Run the setup
setupStripeProducts();
