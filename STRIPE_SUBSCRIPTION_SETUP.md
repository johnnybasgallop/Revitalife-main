# Stripe Subscription Setup Guide

## 🚀 **Step 1: Set Up Stripe Products & Prices**

### Option A: Use the Setup Script (Recommended)

1. Install Stripe: `npm install stripe`
2. Set your Stripe secret key: `export STRIPE_SECRET_KEY=sk_test_...`
3. Run the setup script: `node scripts/setup-stripe-products.js`
4. Copy the price IDs to your `.env` file

### Option B: Manual Stripe Dashboard Setup

1. Go to [Stripe Dashboard > Products](https://dashboard.stripe.com/products)
2. Create two products:
   - **One-time**: Revitalife Superfood Mix (One-time) - $59.99
   - **Subscription**: Revitalife Superfood Mix (Monthly) - $49.99/month
3. Copy the price IDs from each product

## 🔑 **Step 2: Environment Variables**

Add these to your `.env.local` file:

```bash
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_... # Your Stripe secret key
STRIPE_PUBLISHABLE_KEY=pk_test_... # Your Stripe publishable key

# Stripe Product Price IDs
STRIPE_ONETIME_PRICE_ID=price_... # One-time purchase price ID
STRIPE_SUBSCRIPTION_PRICE_ID=price_... # Monthly subscription price ID

# App Configuration
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## 🧪 **Step 3: Test the System**

1. Start your dev server: `npm run dev`
2. Go to the buy section
3. Toggle between one-time and subscription
4. Try adding items to cart (subscription requires login)
5. Test checkout flow

## 📋 **What's Already Implemented**

✅ Subscription toggle in BuySection
✅ Authentication requirement for subscriptions
✅ Basket handling for subscription items
✅ Stripe checkout integration
✅ Price calculations and display
✅ Visual indicators and badges

## 🔄 **Next Steps for Full Subscription System**

1. **Webhook Handler** - Handle subscription lifecycle events
2. **Customer Portal** - Let users manage subscriptions
3. **Subscription Management** - Track active subscriptions
4. **Billing History** - Show past charges
5. **Cancellation Flow** - Handle subscription cancellations

## 🚨 **Important Notes**

- **Test Mode**: Use `sk_test_` keys for development
- **Production**: Switch to `sk_live_` keys when ready
- **Webhooks**: Essential for subscription management
- **Customer ID**: Required for subscription checkouts
- **Price IDs**: Must match exactly what's in Stripe

## 🆘 **Troubleshooting**

**Error: "Customer ID required for subscriptions"**

- User must be logged in to purchase subscriptions
- Check that `useAuth()` is working properly

**Error: "Invalid price ID"**

- Verify your environment variables are set correctly
- Run the setup script again to get fresh price IDs

**Subscription not recurring**

- Check that the price has `recurring.interval` set to "month"
- Verify webhook endpoints are configured

## 📞 **Need Help?**

- Check Stripe logs in your dashboard
- Verify all environment variables are set
- Test with Stripe's test card numbers
- Use Stripe CLI for local webhook testing
