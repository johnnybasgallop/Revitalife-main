# Stripe Integration Setup

This guide will help you set up Stripe checkout functionality for your Revitalife application.

## Environment Variables

Create a `.env.local` file in your project root with the following variables:

```bash
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here

# Base URL for your application (used in checkout success/cancel URLs)
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## Getting Your Stripe Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Sign in or create an account
3. Go to Developers → API keys
4. Copy your publishable key and secret key
5. Replace the placeholder values in your `.env.local` file

## Features Implemented

- **Shopping Basket**: Add/remove items, adjust quantities
- **Basket Context**: Global state management for cart items
- **Stripe Checkout**: Secure payment processing
- **Success/Cancel Pages**: Handle post-payment flow
- **Responsive Design**: Works on mobile and desktop

## How It Works

1. Users can add products to their basket from the Buy Section
2. The basket icon in the header shows the current item count
3. Clicking the basket icon opens the basket panel
4. Users can adjust quantities or remove items
5. Clicking "Proceed to Checkout" redirects to Stripe
6. After payment, users are redirected to success/cancel pages

## Testing

- Use Stripe test cards for development
- Test card number: 4242 4242 4242 4242
- Any future expiry date and CVC will work

## Production Deployment

- Update `NEXT_PUBLIC_BASE_URL` to your production domain
- Use live Stripe keys instead of test keys
- Ensure your domain is configured in Stripe dashboard
