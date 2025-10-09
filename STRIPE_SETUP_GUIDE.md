# 🚨 Stripe Setup Required - Checkout Not Working

## The Problem

Your checkout is failing because Stripe isn't properly configured. You're getting "Failed to create checkout session" because the environment variables aren't set up.

## 🔧 Quick Fix

### 1. Create Environment File

Create a `.env.local` file in your project root with:

```bash
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here

# Base URL for your application
NEXT_PUBLIC_BASE_URL=https://www.revitalifestores.com/
```

### 2. Get Your Stripe Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Sign in or create an account
3. Go to **Developers → API keys**
4. Copy your **publishable key** (starts with `pk_test_`)
5. Copy your **secret key** (starts with `sk_test_`)
6. Replace the placeholder values in `.env.local`

### 3. Restart Your Development Server

```bash
# Stop your current server (Ctrl+C)
# Then restart
npm run dev
```

## 🧪 Test the Fix

1. Add an item to your basket
2. Click "Proceed to Checkout"
3. You should now be redirected to Stripe's checkout page

## 🔍 If Still Not Working

### Check Console for Errors

The enhanced error handling will now show you exactly what's wrong:

- **"Stripe is not configured"** → Environment variables missing
- **"Invalid API key"** → Wrong Stripe key format
- **Other errors** → Check the specific error message

### Verify Environment Variables

Make sure your `.env.local` file:

- Is in the project root (same folder as `package.json`)
- Has no spaces around the `=` sign
- Has the correct key names (exactly as shown above)
- Contains valid Stripe keys

## 🎯 What I Fixed

1. **Enhanced Error Handling** - Now shows specific error messages
2. **Environment Variable Check** - API route checks if Stripe is configured
3. **Better Error Notifications** - Shows errors in the UI instead of just console
4. **Development Mode Logging** - More detailed errors in development

## 🚀 Next Steps

Once Stripe is working:

1. Test with Stripe test cards (4242 4242 4242 4242)
2. Set up success/cancel pages
3. Configure webhooks for production
4. Switch to live keys when ready

Let me know if you still get errors after setting up the environment variables!
