import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  CreditCard,
  User,
  MapPin,
  Package,
  ArrowLeft,
  Lock,
  CheckCircle,
} from "lucide-react";
import { useCart } from "../contexts/CartContext";
import { toast } from "../hooks/use-toast";

import { createOrder } from "../APi/api.js"; 

import {
  getRazorpayKey,
  verifyPayment
} from "../APi/api.js";

// TypeScript declaration for Razorpay (kept for compatibility)
declare global {
  interface Window {
    Razorpay: any;
  }
}
export const BASE_URL = 'https://monkfish-app-phfed.ondigitalocean.app/api';
const razorpayKey = "rzp_test_Rd9FMehTGXSduO";
// Small fallback map: color name -> hex (used if cart item doesn't already include a hex)
const COLOR_MAP = {
  blue: "#3b82f6",
  red: "#ef4444",
  green: "#10b981",
  yellow: "#facc15",
  black: "#000000",
  white: "#ffffff",
  pink: "#ec4899",
  purple: "#a855f7",
};

const Checkout = () => {
  const { state, clearCart } = useCart();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    notes: "",
    country: "India",
    shippingMethod: "Cash on Delivery",
    countryCode: "+91",
  });

  const steps = [
    { id: 1, name: "Shipping", icon: MapPin },
    { id: 2, name: "Payment", icon: CreditCard },
    { id: 3, name: "Review", icon: Package },
  ];

  const shippingMethods = [
    { id: "Cash on Delivery", name: "Cash on Delivery" },
    { id: "Online", name: "Pay with Razorpay (Online)" },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const subtotal = state.total;
  const shippingAmount = 0;
  const taxRate = 0.18;
  const discountAmount = 0.0;
  const taxAmount = subtotal * taxRate;
  const totalAmount = subtotal + shippingAmount + taxAmount;

  // Dynamically load Razorpay script
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (typeof window.Razorpay !== 'undefined') {
        console.log("Razorpay already loaded");
        resolve(true);
        return;
      }

      // Check if script already exists
      const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
      if (existingScript) {
        console.log("Razorpay script tag exists, waiting for load");
        // Wait a bit for it to load
        setTimeout(() => {
          if (typeof window.Razorpay !== 'undefined') {
            console.log("Razorpay loaded from existing script");
            resolve(true);
          } else {
            resolve(false);
          }
        }, 500);
        return;
      }

      console.log("Loading Razorpay script...");
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.crossOrigin = 'anonymous';

      script.onload = () => {
        console.log("Razorpay script loaded successfully");
        // Give it a moment to initialize
        setTimeout(() => {
          if (typeof window.Razorpay !== 'undefined') {
            resolve(true);
          } else {
            console.error("Razorpay script loaded but Razorpay object not found");
            resolve(false);
          }
        }, 100);
      };

      script.onerror = (error) => {
        console.error("Failed to load Razorpay script:", error);
        resolve(false);
      };

      document.head.appendChild(script);
    });
  };

  const createPaymentOrder = async (orderId) => {
    try {
      console.log("Creating payment order for order ID:", orderId);
      const response = await axios.post(`${BASE_URL}/orders/${orderId}/checkout`);
      console.log("Payment order created:", response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating payment order:', error);
      throw error;
    }
  };

  // Razorpay integration
  const displayRazorpay = async (orderData) => {
    try {
      // Load Razorpay script
      const isScriptLoaded = await loadRazorpayScript();
      // console.log("Razorpay script loaded:", isScriptLoaded);

      if (!isScriptLoaded) {
        toast({
          title: "Payment Gateway Error",
          description: "Razorpay SDK failed to load. Please check your internet connection.",
          variant: "destructive",
        });
        throw new Error("Failed to load Razorpay script");
      }

      // Verify Razorpay is available
      if (typeof window.Razorpay === 'undefined') {
        console.error("Razorpay object not found on window");
        toast({
          title: "Payment Gateway Error",
          description: "Payment gateway not initialized. Please refresh and try again.",
          variant: "destructive",
        });
        throw new Error("Razorpay not initialized");
      }



      // Validate order data
      if (!orderData.orderId || !orderData.amount) {
        console.error("Invalid order data:", orderData);
        toast({
          title: "Order Error",
          description: "Invalid payment order data. Please try again.",
          variant: "destructive",
        });
        throw new Error("Invalid order data");
      }
      const options = {
        key: razorpayKey,
        amount: orderData.amount*100,
        currency: orderData.currency || "INR",
        name: "Techie Delight",
        description: `Order Payment - ${orderData.orderNumber}`,
        order_id: orderData.orderId,
        prefill: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          contact: `${formData.countryCode}${formData.phone}`,
        },
        theme: {
          color: '#8B5CF6',
        },
        handler: function (response) {
          console.log('Payment success response:', response);

          try {
            verifyPayment(
              response.razorpay_order_id,
              response.razorpay_payment_id,
              response.razorpay_signature
            )


          } catch (error) {
            console.error('Payment verification failed:', error);
            toast({
              title: "Payment Verification Failed",
              description: "Please contact support with your payment details.",
              variant: "destructive",
            });
            setIsProcessing(false);
          }
        }
        ,
        modal: {
          ondismiss: function () {
            console.log("Payment modal dismissed by user");
            toast({
              title: "Payment Cancelled",
              description: "You cancelled the payment. Please try again to complete your order.",
              variant: "destructive",
            });
            setIsProcessing(false);
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (error) {
      console.error("Error in displayRazorpay:", error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Step navigation logic
    if (currentStep === 1) {
      if (
        !formData.firstName ||
        !formData.lastName ||
        !formData.email ||
        !formData.phone ||
        !formData.addressLine1 ||
        !formData.city ||
        !formData.state ||
        !formData.postalCode
      ) {
        toast({
          title: "Validation Error",
          description: "Please fill all required shipping fields (marked with *).",
          variant: "destructive",
        });
        return;
      }
      setCurrentStep(2);
      return;
    }

    if (currentStep === 2) {
      setCurrentStep(3);
      return;
    }

    // Step 3: Place order
    setIsProcessing(true);

    // Get userId from localStorage
    const storedUser = localStorage.getItem("user");
    let userId = null;
    if (storedUser) {
      try {
        const userObj = JSON.parse(storedUser);
        userId = userObj?.user?._id || userObj?._id || null;
      } catch (err) {
        console.error("Error parsing stored user:", err);
      }
    }

    if (!userId) {
      toast({
        title: "User Not Authenticated",
        description: "Please log in before placing an order.",
        variant: "destructive",
      });
      setIsProcessing(false);
      return;
    }

    const fullPhoneNumber = `${formData.countryCode}${formData.phone}`;

    // Prepare base order payload
    const baseOrderData = {
      userId,
      orderNumber: `ORD-${new Date()
        .toISOString()
        .slice(0, 10)
        .replace(/-/g, "")}-${Math.floor(Math.random() * 1000)}`,
      currency: "INR",
      items: state.items.map((item) => ({
        productId: item.id,
        variantId:item.variantId,
        quantity: item.quantity,
        unitPrice: item.price,
        totalPrice: parseFloat((item.price * item.quantity).toFixed(2)),
        productName: item.name,
        productSku: "N/A",
      })),
      billingAddress: {
        type: "billing",
        name: `${formData.firstName} ${formData.lastName}`,
        company: formData.company || "",
        addressLine1: formData.addressLine1,
        addressLine2: formData.addressLine2,
        city: formData.city,
        state: formData.state,
        postalCode: formData.postalCode,
        country: formData.country,
        phone: fullPhoneNumber,
      },
      shippingAddress: {
        type: "shipping",
        name: `${formData.firstName} ${formData.lastName}`,
        addressLine1: formData.addressLine1,
        addressLine2: formData.addressLine2,
        city: formData.city,
        state: formData.state,
        postalCode: formData.postalCode,
        country: formData.country,
        phone: fullPhoneNumber,
      },
      subtotal: parseFloat(subtotal.toFixed(2)),
      taxAmount: parseFloat(taxAmount.toFixed(2)),
      shippingAmount: shippingAmount,
      discountAmount: parseFloat(discountAmount.toFixed(2)),
      totalAmount: parseFloat(totalAmount.toFixed(2)),
      orderStatus: "pending",
      paymentStatus: "pending",
    };

    console.log("Order Payload being sent:", baseOrderData);

    if (formData.shippingMethod === "Cash on Delivery") {
      // COD flow
      try {
        const orderData = {
          ...baseOrderData,
          paymentMethod: "cod",
          paymentStatus: "pending",
        };

        const order = await createOrder(orderData);

        toast({
          title: "Order placed successfully! 🎉",
          description: `Order ID: ${order._id}`,
        });

        clearCart();
        navigate(`/order/${userId}`);
      } catch (err) {
        console.error("COD Order Failed:", err);
        toast({
          title: "Order Failed",
          description: err.message || "Something went wrong.",
          variant: "destructive",
        });
      } finally {
        setIsProcessing(false);
      }
    } else {
      // Online / Razorpay flow
      try {
        // Step 1: Create order in your database with pending payment status
        const orderData = {
          ...baseOrderData,
          paymentMethod: "upi",
          paymentStatus: "pending",
          orderStatus: "pending",
        };

        const order = await createOrder(orderData);
        // console.log("Order created:", order);

        if (!order || !order._id) {
          throw new Error("Failed to create order in database");
        }

        const orderId = order._id;

        // Step 2: Create Razorpay order
        const orderResult = await createPaymentOrder(orderId);
        console.log("Payment order created:", orderResult);

        if (!orderResult || !orderResult.orderId) {
          throw new Error("Failed to create Razorpay order");
        }

        // Step 3: Open Razorpay payment modal and wait for payment
        await displayRazorpay(orderResult);

        // Step 4: Payment successful and verified in displayRazorpay handler
        toast({
          title: "Order placed successfully! 🎉",
          description: "Your payment has been processed.",
        });

        clearCart();
        navigate(`/order/${userId}`);
      } catch (err) {
        console.error("Payment / Order error:", err);

        // Handle different error types
        let errorMessage = "Something went wrong. Please try again.";

        if (err.message === "Payment cancelled by user") {
          errorMessage = "Payment was cancelled. Your order has not been placed.";
        } else if (err.message?.includes("create order")) {
          errorMessage = "Failed to create order. Please try again.";
        } else if (err.message?.includes("Razorpay")) {
          errorMessage = "Payment gateway error. Please try again.";
        } else if (err.error?.description) {
          errorMessage = err.error.description;
        } else if (err.message) {
          errorMessage = err.message;
        }

        toast({
          title: "Payment / Order Failed",
          description: errorMessage,
          variant: "destructive",
        });
      } finally {
        setIsProcessing(false);
      }
    }
  };
  if (state.items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-3xl font-bold mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground mb-4">Add items to checkout</p>
          <motion.button
            className="btn-hero"
            onClick={() => navigate("/")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Continue Shopping
          </motion.button>
        </div>
      </div>
    );
  }

  // Helper to get swatch color for display
  const swatchColor = (item) => {
    if (item.selectedColorHex) return item.selectedColorHex;
    if (item.colorHex) return item.colorHex;
    if (item.selectedColor && COLOR_MAP[item.selectedColor?.toLowerCase()]) {
      return COLOR_MAP[item.selectedColor?.toLowerCase()];
    }
    // last fallback: try to use selectedColor directly (maybe it's a hex already)
    return item.selectedColor ?? "#e5e7eb";
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.button
          className="flex items-center space-x-2 text-muted-foreground hover:text-primary mb-8"
          onClick={() => navigate(-1)}
          whileHover={{ x: -5 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowLeft size={20} />
          <span>Back to cart</span>
        </motion.button>

        <div className="text-center mb-12">
          <motion.h1
            className="text-4xl font-bold gradient-text mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Secure Checkout 🔒
          </motion.h1>
          <p className="text-muted-foreground">
            Complete your order safely and securely
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center space-x-3 sm:space-x-8">
            {steps.map((step, idx) => (
              <motion.div
                key={step.id}
                className="flex items-center space-x-3"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                    currentStep >= step.id
                      ? "bg-gradient-to-r from-primary to-secondary text-white"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {currentStep > step.id ? (
                    <CheckCircle size={20} />
                  ) : (
                    <step.icon size={20} />
                  )}
                </div>
                <span
                  className={`font-medium text-sm sm:text-base ${
                    currentStep >= step.id
                      ? "text-primary"
                      : "text-muted-foreground"
                  } hidden sm:inline`}
                >
                  {step.name}
                </span>
                {idx < steps.length - 1 && (
                  <div
                    className={`w-6 sm:w-12 h-0.5 mx-2 sm:mx-4 ${
                      currentStep > step.id ? "bg-primary" : "bg-muted"
                    }`}
                  />
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <motion.form
              onSubmit={handleSubmit}
              className="space-y-8"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Step 1: Shipping */}
              {currentStep === 1 && (
                <motion.div
                  className="bg-card rounded-3xl p-8 shadow-md"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex items-center space-x-3 mb-8">
                    <User className="text-primary w-6 h-6" />
                    <h2 className="text-2xl font-bold text-gray-800">
                      Shipping Information
                    </h2>
                  </div>
                  {/* shipping form fields (same as before) */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <div className="flex rounded-xl overflow-hidden border focus-within:ring-2 focus-within:ring-primary">
                        <select
                          name="countryCode"
                          value={formData.countryCode}
                          onChange={handleInputChange}
                          className="px-3 py-3 bg-gray-100 text-gray-700 border-r outline-none w-auto"
                        >
                          <option value="+91">🇮🇳 +91</option>
                          <option value="+1">🇺🇸 +1</option>
                          <option value="+44">🇬🇧 +44</option>
                        </select>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 outline-none"
                          placeholder="Enter phone number"
                        />
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Company (optional)
                      </label>
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Street Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="addressLine1"
                        value={formData.addressLine1}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Address Line 2 (optional)
                      </label>
                      <input
                        type="text"
                        name="addressLine2"
                        value={formData.addressLine2}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        State <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        ZIP Code <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Payment */}
              {currentStep === 2 && (
                <motion.div
                  className="bg-card rounded-3xl p-8 space-y-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex items-center space-x-3 mb-6">
                    <CreditCard className="text-primary" />
                    <h2 className="text-2xl font-bold">Payment Method</h2>
                  </div>
                  <div className="p-4 border-2 border-dashed rounded-xl text-center">
                    <p className="font-semibold text-primary">
                      Payment will be securely processed by Razorpay if you
                      choose online.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      You will enter card details in a pop-up window after
                      clicking Continue.
                    </p>
                  </div>

                  <div className="flex items-center space-x-3 mb-6 pt-4 border-t">
                    <Package className="text-primary" />
                    <h2 className="text-2xl font-bold">Shipping Method</h2>
                  </div>
                  <div className="space-y-4">
                    {shippingMethods.map((method) => (
                      <label
                        key={method.id}
                        className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer ${
                          formData.shippingMethod === method.id
                            ? "border-primary ring-2 ring-primary/50 bg-primary/5"
                            : "border-border bg-background hover:bg-muted/50"
                        }`}
                      >
                        <div className="flex items-center">
                          <input
                            type="radio"
                            name="shippingMethod"
                            value={method.id}
                            checked={formData.shippingMethod === method.id}
                            onChange={handleInputChange}
                            className="h-5 w-5 text-primary focus:ring-primary border-border"
                          />
                          <div className="ml-4">
                            <p className="font-medium text-foreground">
                              {method.name}
                            </p>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Step 3: Review */}
              {currentStep === 3 && (
                <motion.div
                  className="bg-card rounded-3xl p-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex items-center space-x-3 mb-6">
                    <Package className="text-primary" />
                    <h2 className="text-2xl font-bold">Review Your Order</h2>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold mb-4">Order Items</h3>
                      <div className="space-y-3">
                        {state.items.map((item) => (
                          <div
                            key={item.id + "-" + (item.selectedColor || "")}
                            className="flex items-center justify-between p-4 bg-muted/30 rounded-xl"
                          >
                            <div className="flex items-center space-x-4">
                              <div className="w-12 h-12 rounded-md overflow-hidden flex items-center justify-center bg-white">
                                {item.image ? (
                                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                ) : (
                                  <div className="text-3xl">{item.emoji ?? "🧸"}</div>
                                )}
                              </div>

                              <div>
                                <div className="font-medium">{item.name}</div>
                                <div className="text-sm flex items-center space-x-3 mt-1">
                                  <div>Qty: {item.quantity}</div>

                                  {/* Color display */}
                                  {item.selectedColor && (
                                    <div className="flex items-center space-x-2">
                                      <div
                                        className="w-4 h-4 rounded-full border"
                                        style={{ backgroundColor: swatchColor(item) }}
                                      />
                                      <div className="text-xs text-muted-foreground">
                                        {item.selectedColor}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="font-semibold text-primary">
                              ₹{(item.price * item.quantity).toFixed(2)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-semibold mb-2">Shipping Address</h3>
                        <div className="text-sm text-muted-foreground">
                          <p>
                            {formData.firstName} {formData.lastName}
                          </p>
                          <p>
                            {formData.addressLine1} {formData.addressLine2}
                          </p>
                          <p>
                            {formData.city}, {formData.state}{" "}
                            {formData.postalCode}
                          </p>
                          <p>{formData.email}</p>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">
                          Payment & Shipping
                        </h3>
                        <div className="text-sm text-muted-foreground">
                          <p className="font-medium text-primary">
                            {formData.shippingMethod === "Cash on Delivery"
                              ? "Cash on Delivery"
                              : "Razorpay (Online)"}
                          </p>
                          <p>Total: ₹{totalAmount.toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              <div className="flex justify-between">
                {currentStep > 1 && (
                  <motion.button
                    type="button"
                    className="px-8 py-3 border rounded-xl text-foreground hover:bg-muted transition-colors"
                    onClick={() => setCurrentStep(currentStep - 1)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Back
                  </motion.button>
                )}
                <motion.button
                  type="submit"
                  disabled={isProcessing}
                  className={`ml-auto px-8 py-3 rounded-xl font-semibold transition-all ${
                    currentStep === 3
                      ? "bg-gradient-to-r from-success to-accent text-success-foreground shadow-playful hover:shadow-glow"
                      : "bg-primary text-primary-foreground hover:bg-primary-glow"
                  } ${isProcessing ? "opacity-50 cursor-not-allowed" : ""}`}
                  whileHover={!isProcessing ? { scale: 1.02 } : {}}
                  whileTap={!isProcessing ? { scale: 0.98 } : {}}
                >
                  {isProcessing ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Processing...</span>
                    </div>
                  ) : currentStep === 3 ? (
                    "Place Order 🚀"
                  ) : (
                    "Continue"
                  )}
                </motion.button>
              </div>
            </motion.form>
          </div>

          {/* Order Summary */}
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-card rounded-3xl p-8 lg:sticky lg:top-8">
              <h3 className="text-2xl font-bold mb-6">Order Summary</h3>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span>
                  <span>
                    {shippingAmount === 0
                      ? "FREE"
                      : `₹${shippingAmount.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Tax (8%)</span>
                  <span>₹{taxAmount.toFixed(2)}</span>
                </div>
                <div className="border-t border-border pt-4">
                  <div className="flex justify-between text-xl font-bold">
                    <span>Total</span>
                    <span className="text-primary">
                      ₹{totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <Lock size={16} className="text-success" />
                  <span>Secure SSL encryption</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle size={16} className="text-success" />
                  <span>30-day money-back guarantee</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Package size={16} className="text-primary" />
                  <span>Free shipping on orders over $50</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Checkout;
