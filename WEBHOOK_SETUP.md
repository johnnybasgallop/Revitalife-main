# Stripe Webhook Setup Guide

## 🎯 **What This Does**

The webhook automatically updates your Supabase database when:

- ✅ **Subscription payment succeeds** → User becomes subscribed
- ✅ **Subscription payment fails** → User subscription status updated
- ✅ **Subscription is canceled** → User subscription marked as canceled
- ✅ **Subscription is updated** → User subscription details synced

## 🚀 **Setup Steps**

### **Step 1: Get Your Webhook Secret**

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/webhooks)
2. Click **"Add endpoint"**
3. Set **Endpoint URL** to: `https://yourdomain.com/api/stripe-webhooks`
4. Select these events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Click **"Add endpoint"**
6. Copy the **Signing secret** (starts with `whsec_`)

### **Step 2: Add to Environment Variables**

Add this to your `.env.local`:

```bash
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

### **Step 3: Test the Webhook**

1. **Start your dev server**: `npm run dev`
2. **Use Stripe CLI** to test locally:
   ```bash
   # Install Stripe CLI
   stripe listen --forward-to localhost:3000/api/stripe-webhooks
   ```
3. **Make a test subscription** in your app
4. **Check the logs** to see webhook events

## 🔄 **How It Works**

### **1. User Subscribes**

```
User → Checkout → Stripe → Webhook → Supabase Database
```

### **2. Webhook Processes Events**

- **`checkout.session.completed`** → Creates subscription record
- **`invoice.payment_succeeded`** → Updates subscription status
- **`customer.subscription.updated`** → Syncs subscription changes

### **3. Database Updated**

- User profile gets `stripe_customer_id`
- Subscription record created with status `active`
- All future payments automatically tracked

## 🧪 **Testing the Flow**

### **Test 1: Create Subscription**

1. Go to your buy section
2. Toggle to subscription
3. Add to cart
4. Checkout with test card: `4242 4242 4242 4242`
5. Check Supabase database for new subscription

### **Test 2: Verify Webhook**

1. Check your server logs for webhook events
2. Verify subscription status in Supabase
3. Check user profile has `stripe_customer_id`

## 🚨 **Important Notes**

### **Security**

- Webhook signature verified automatically
- Only processes events from Stripe
- Validates all data before database updates

### **Error Handling**

- Failed webhooks are logged
- Database operations wrapped in try-catch
- Graceful fallbacks for missing data

### **Production**

- Use HTTPS endpoint
- Set up webhook retries in Stripe
- Monitor webhook delivery in Stripe Dashboard

## 🔍 **Troubleshooting**

### **Webhook Not Receiving Events**

1. Check endpoint URL is correct
2. Verify webhook secret in environment
3. Check Stripe Dashboard for delivery status

### **Database Not Updating**

1. Check webhook logs in your server
2. Verify Supabase connection
3. Check RLS policies are correct

### **Subscription Status Wrong**

1. Check webhook event processing
2. Verify subscription data in Stripe
3. Check database schema matches

## 🎉 **What You Get**

With this webhook setup:

- ✅ **Automatic subscription tracking**
- ✅ **Real-time status updates**
- ✅ **Payment success/failure handling**
- ✅ **Subscription lifecycle management**
- ✅ **User profile integration**

Your subscription system is now **fully automated**! 🚀
