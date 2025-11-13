# Razorpay Quick Start Guide

## 🚀 Quick Setup (5 Minutes)

### 1. Get Razorpay Key
```bash
# Visit: https://dashboard.razorpay.com/app/keys
# Copy your Key ID (starts with rzp_test_ or rzp_live_)
```

### 2. Update Checkout.tsx
```typescript
// Line 61 in /src/pages/Checkout.tsx
const RAZORPAY_KEY_ID = "rzp_test_YOUR_KEY_HERE";
```

### 3. Test Payment
```bash
npm run dev
# Navigate to checkout
# Select "Pay with Razorpay (Online)"
# Use test card: 4111 1111 1111 1111
```

## 📋 What's Been Implemented

### ✅ Frontend (Ready to Use)
- Razorpay script loading
- Payment modal integration
- Success/failure/cancel handlers
- Error handling with toast notifications
- Payment API helper functions

### ⏳ Backend (Needs Implementation)
You need to create these endpoints:

```javascript
// 1. Get Razorpay Key
GET /api/payment/razorpay-key
Response: { key: "rzp_test_..." }

// 2. Create Payment Order
POST /api/payment/create-order
Body: { orderId: "ORD-123", amount: 1000 }
Response: { orderId: "rzp_order_...", amount: 100000, currency: "INR" }

// 3. Verify Payment
POST /api/payment/verify
Body: { orderId: "...", paymentId: "...", signature: "..." }
Response: { verified: true }
```

## 🔧 Current Mode: Mock (Development)

The integration currently uses **mock order creation** for testing:
```typescript
// This is temporary - replace with backend call
const mockOrderData = {
  orderId: `rzp_order_${Math.floor(Math.random() * 1000000)}`,
  amount: amountInPaise,
  currency: "INR",
};
```

## 🎯 Switch to Production Mode

### Update displayRazorpay() function:

**Find (around line 105-117):**
```typescript
// TODO: Replace with actual API call to get Razorpay key from backend
const razorpayKey = RAZORPAY_KEY_ID;

// In production, you should call your backend...
const mockOrderData = {
  orderId: `rzp_order_${Math.floor(Math.random() * 1000000)}`,
  amount: amountInPaise,
  currency: "INR",
};
```

**Replace with:**
```typescript
const razorpayKey = await getRazorpayKey();
const orderResult = await createPaymentOrder(baseOrderData.orderNumber, totalAmount);
```

### Update handleSubmit() function:

**Find (around line 330-335):**
```typescript
// TODO: In production, verify payment on backend before creating order
// const verificationResult = await verifyPayment(
//   paymentResponse.razorpay_order_id,
//   paymentResponse.razorpay_payment_id,
//   paymentResponse.razorpay_signature
// );
```

**Uncomment:**
```typescript
const verificationResult = await verifyPayment(
  paymentResponse.razorpay_order_id,
  paymentResponse.razorpay_payment_id,
  paymentResponse.razorpay_signature
);

if (!verificationResult.verified) {
  throw new Error("Payment verification failed");
}
```

## 🧪 Test Cards (Razorpay Test Mode)

| Card Number | Type | Result |
|-------------|------|--------|
| 4111 1111 1111 1111 | Visa | Success |
| 5555 5555 5555 4444 | Mastercard | Success |
| 4000 0000 0000 0002 | Visa | Declined |

**CVV:** Any 3 digits  
**Expiry:** Any future date  
**Name:** Any name

## 📱 Payment Flow

```
User clicks "Place Order" 
    ↓
Razorpay modal opens
    ↓
User enters card details
    ↓
Payment processed
    ↓
Success → Order created → Redirect to orders
Failure → Error toast → Stay on checkout
Cancel → Warning toast → Stay on checkout
```

## 🔍 Debugging

### Check Browser Console
```javascript
// You should see these logs:
"Payment Order Data:" { orderId, amount, currency }
"Payment Success Response:" { razorpay_payment_id, ... }
"Payment completed successfully:" { ... }
```

### Check Network Tab
- Razorpay script should load from `checkout.razorpay.com`
- POST to `/api/orders` should succeed after payment

### Common Issues

**Modal doesn't open:**
- Check if RAZORPAY_KEY_ID is set correctly
- Check browser console for errors
- Verify internet connection

**Payment succeeds but order fails:**
- Check backend order creation endpoint
- Verify authentication token
- Check order payload in console

## 📚 Key Files

```
/src/pages/Checkout.tsx          # Main checkout component
/src/APi/api.js                  # Payment API functions
/RAZORPAY_INTEGRATION.md         # Detailed documentation
```

## 🎨 Customization

### Change Theme Color
```typescript
theme: {
  color: '#8B5CF6',  // Purple - change to your brand color
}
```

### Change Store Name
```typescript
name: "My Awesome Store",  // Update to your store name
```

### Modify Prefill Data
```typescript
prefill: {
  name: `${formData.firstName} ${formData.lastName}`,
  email: formData.email,
  contact: `${formData.countryCode}${formData.phone}`,
}
```

## ⚡ Quick Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🆘 Need Help?

1. Check `/RAZORPAY_INTEGRATION.md` for detailed docs
2. Visit Razorpay docs: https://razorpay.com/docs/
3. Check browser console for errors
4. Verify all TODO comments are addressed

## ✨ What's Different from RegistrationForm?

The implementation follows the same pattern as RegistrationForm but adapted for e-commerce:

| Feature | RegistrationForm | Checkout |
|---------|------------------|----------|
| Payment for | Tournament registration | Product orders |
| Amount source | `tournament.entryFee` | `totalAmount` (cart total) |
| Success redirect | `/payment-status` | `/order/:userId` |
| Order creation | Before payment | After payment |
| Verification | Required | Optional (TODO) |

Both use the same core Razorpay integration pattern! 🎉
