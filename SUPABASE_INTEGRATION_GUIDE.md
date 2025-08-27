# Supabase Integration Guide for Revitalife Subscriptions

## 🏗️ **Database Schema Overview**

Your subscription system now integrates with these Supabase tables:

### **1. `profiles` Table (Enhanced)**

```sql
-- Existing fields
id: UUID (Primary Key)
email: TEXT
full_name: TEXT
created_at: TIMESTAMP
updated_at: TIMESTAMP

-- New fields for subscriptions
stripe_customer_id: TEXT  -- Links user to Stripe customer
```

### **2. `subscriptions` Table (Enhanced)**

```sql
id: UUID (Primary Key)
user_id: UUID (References auth.users)
stripe_subscription_id: TEXT (Unique Stripe subscription ID)
stripe_customer_id: TEXT (Stripe customer ID)
status: TEXT (active, canceled, past_due, etc.)
plan_type: TEXT (monthly, yearly)
stripe_price_id: TEXT (Stripe price ID for the plan)
quantity: INTEGER (Number of subscriptions)
current_period_start: TIMESTAMP
current_period_end: TIMESTAMP
cancel_at_period_end: BOOLEAN
created_at: TIMESTAMP
updated_at: TIMESTAMP
```

### **3. `orders` Table (New)**

```sql
id: UUID (Primary Key)
user_id: UUID (References auth.users)
stripe_session_id: TEXT (Stripe checkout session)
stripe_payment_intent_id: TEXT (Stripe payment intent)
status: TEXT (pending, completed, failed)
total_amount: DECIMAL (Order total)
currency: TEXT (gbp)
shipping_address: JSONB
billing_address: JSONB
created_at: TIMESTAMP
updated_at: TIMESTAMP
```

### **4. `order_items` Table (New)**

```sql
id: UUID (Primary Key)
order_id: UUID (References orders)
product_name: TEXT
product_description: TEXT
quantity: INTEGER
unit_price: DECIMAL
total_price: DECIMAL
is_subscription: BOOLEAN
stripe_price_id: TEXT
created_at: TIMESTAMP
```

### **5. `subscription_events` Table (New)**

```sql
id: UUID (Primary Key)
subscription_id: UUID (References subscriptions)
event_type: TEXT (created, updated, canceled, etc.)
stripe_event_id: TEXT (Stripe webhook event ID)
event_data: JSONB (Full event data)
created_at: TIMESTAMP
```

## 🚀 **Setup Instructions**

### **Step 1: Run Database Migration**

1. Go to your **Supabase Dashboard** → **SQL Editor**
2. Copy and paste the contents of `supabase/migrations/001_create_subscription_tables.sql`
3. Click **Run** to execute the migration

### **Step 2: Verify Tables Created**

Check that all tables exist in **Supabase Dashboard** → **Table Editor**:

- ✅ `profiles` (enhanced)
- ✅ `subscriptions` (enhanced)
- ✅ `orders` (new)
- ✅ `order_items` (new)
- ✅ `subscription_events` (new)

### **Step 3: Check Row Level Security (RLS)**

Verify RLS policies are active in **Supabase Dashboard** → **Authentication** → **Policies**:

- Users can only see their own orders
- Users can only see their own subscription data
- Proper access controls are in place

## 🔄 **Data Flow Integration**

### **User Registration/Login**

```typescript
// When user signs up/logs in
const { user } = await supabase.auth.signUp({
  email: "user@example.com",
  password: "password",
});

// Profile is automatically created in 'profiles' table
// 'stripe_customer_id' will be null initially
```

### **Subscription Purchase Flow**

```typescript
// 1. User adds subscription to basket
// 2. User proceeds to checkout
// 3. Stripe checkout session created
// 4. On successful payment:
//    - Order created in 'orders' table
//    - Order items created in 'order_items' table
//    - Subscription created in 'subscriptions' table
//    - Profile updated with 'stripe_customer_id'
```

### **Subscription Management**

```typescript
// Get user's active subscription
const activeSub = await SubscriptionService.getActiveSubscription(userId);

// Get user's order history
const orders = await SubscriptionService.getUserOrders(userId);

// Update subscription status
await SubscriptionService.updateSubscriptionStatus(subId, "canceled");
```

## 🎯 **Key Integration Points**

### **1. AuthContext Integration**

```typescript
// Your existing AuthContext now works with subscription data
const { user } = useAuth();
const profile = await SubscriptionService.getProfile(user.id);
const hasActiveSubscription = await SubscriptionService.getActiveSubscription(
  user.id
);
```

### **2. Basket Integration**

```typescript
// Basket items now include Stripe price IDs
const basketItem = {
  id: "product-id",
  name: "Product Name",
  price: 47.99,
  quantity: 1,
  isSubscription: true,
  stripePriceId: "price_123...", // From Stripe
};
```

### **3. Checkout Integration**

```typescript
// Checkout API creates orders in Supabase
const order = await SubscriptionService.createOrder({
  user_id: userId,
  stripe_session_id: sessionId,
  total_amount: 47.99,
  currency: "gbp",
});
```

## 🔧 **Service Layer Usage**

### **Import the Service**

```typescript
import { SubscriptionService } from "@/lib/subscriptionService";
```

### **Common Operations**

```typescript
// Get user profile with Stripe info
const profile = await SubscriptionService.getProfile(userId);

// Create new subscription
const subscription = await SubscriptionService.createSubscription({
  user_id: userId,
  stripe_subscription_id: "sub_123...",
  stripe_customer_id: "cus_123...",
  status: "active",
  plan_type: "monthly",
  stripe_price_id: "price_123...",
  quantity: 1,
});

// Get user's orders
const orders = await SubscriptionService.getUserOrders(userId);

// Update subscription status
await SubscriptionService.updateSubscriptionStatus(subId, "canceled");
```

## 🚨 **Important Notes**

### **Security**

- All tables have Row Level Security (RLS) enabled
- Users can only access their own data
- Proper authentication required for all operations

### **Data Consistency**

- Stripe IDs are stored as references
- Orders and subscriptions are linked via user_id
- All monetary values stored in GBP (pence for Stripe)

### **Performance**

- Indexes created on frequently queried fields
- RLS policies optimized for user-specific queries
- Proper foreign key relationships maintained

## 🔍 **Testing the Integration**

### **1. Test User Registration**

```typescript
// Create a test user
const { user } = await supabase.auth.signUp({
  email: "test@example.com",
  password: "testpass123",
});

// Verify profile created
const profile = await SubscriptionService.getProfile(user.id);
console.log("Profile:", profile);
```

### **2. Test Subscription Creation**

```typescript
// Create a test subscription
const subscription = await SubscriptionService.createSubscription({
  user_id: user.id,
  stripe_subscription_id: "sub_test_123",
  stripe_customer_id: "cus_test_123",
  status: "active",
  plan_type: "monthly",
  stripe_price_id: "price_test_123",
  quantity: 1,
});

console.log("Subscription created:", subscription);
```

### **3. Test Order Creation**

```typescript
// Create a test order
const order = await SubscriptionService.createOrder({
  user_id: user.id,
  stripe_session_id: "cs_test_123",
  total_amount: 47.99,
  currency: "gbp",
});

console.log("Order created:", order);
```

## 🆘 **Troubleshooting**

### **Common Issues**

1. **RLS Policy Errors**: Check that user is authenticated
2. **Foreign Key Errors**: Ensure referenced records exist
3. **Permission Errors**: Verify table permissions are correct

### **Debug Queries**

```sql
-- Check user profiles
SELECT * FROM profiles WHERE id = 'your-user-id';

-- Check user subscriptions
SELECT * FROM subscriptions WHERE user_id = 'your-user-id';

-- Check user orders
SELECT * FROM orders WHERE user_id = 'your-user-id';
```

## 🎉 **Next Steps**

With this integration complete, you can now:

1. ✅ Track user subscriptions in Supabase
2. ✅ Store order history and details
3. ✅ Manage subscription lifecycle events
4. ✅ Build user dashboards for subscription management
5. ✅ Handle webhooks for real-time updates

Your subscription system is now fully integrated with Supabase! 🚀
