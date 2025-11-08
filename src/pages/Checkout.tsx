import React, { useState } from "react";
import { motion } from "framer-motion";
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

// Dynamically load Razorpay script
const loadRazorpayScript = (src) => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

// NOTE: Remember to replace this with your actual Key ID
const RAZORPAY_KEY_ID = "YOUR_RAZORPAY_KEY_ID"; 

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

  const handleInputChange = (
    e
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const subtotal = state.total;
  const shippingAmount = 0; // or compute if you have a shipping rate
  const taxRate = 0.08;
  const discountAmount = 0.0;
  const taxAmount = subtotal * taxRate;
  const totalAmount = subtotal + shippingAmount + taxAmount;
  const amountInPaise = Math.round(totalAmount * 100);

  // Razorpay integration
  const displayRazorpay = async () => {
    const loaded = await loadRazorpayScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );
    if (!loaded) {
      toast({
        title: "Payment Gateway Error",
        description: "Razorpay SDK failed to load. Are you online?",
        variant: "destructive",
      });
      setIsProcessing(false);
      return null;
    }

    // In real usage, call backend to create an order and return order_id, amount etc.
    // Here we mock
    const data = {
      order_id: `rzp_order_${Math.floor(Math.random() * 1000000)}`,
      currency: "INR",
      amount: amountInPaise,
    };

    if (!data.order_id) {
      toast({
        title: "Order Creation Error",
        description: "Failed to get order id from server.",
        variant: "destructive",
      });
      setIsProcessing(false);
      return null;
    }

    return new Promise((resolve, reject) => {
      const options = {
        key: RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency,
        name: "My Awesome Store",
        description: "Payment for your order",
        order_id: data.order_id,
        handler: function (response) {
          resolve(response);
        },
        prefill: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          // Use the full number including the country code
          contact: `${formData.countryCode}${formData.phone}`, 
        },
        theme: {
          color: "#3399cc",
        },
      };

      const paymentObject = new (window).Razorpay(options);
      paymentObject.on("payment.failed", (err) => {
        reject(err);
      });
      paymentObject.open();
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Step navigation logic
    if (currentStep === 1) {
      // --- FIX: Add comprehensive validation for ALL required fields ---
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

    // Get userId from localStorage (or however your auth works)
    const storedUser = localStorage.getItem("user");
    let userId = null;
    if (storedUser) {
      try {
        const userObj = JSON.parse(storedUser);
        // Assuming user data is stored as { user: { _id: '...' } } or just { _id: '...' }
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

    // --- FIX: Ensure a combined phone number is used for contact fields ---
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
        // Ensure item data is correct and matches backend schema
        productId: item.id,
        quantity: item.quantity,
        unitPrice: item.price,
        totalPrice: parseFloat((item.price * item.quantity).toFixed(2)),
        productName: item.name,
        productSku: item.sku || "N/A",
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
        // Using the full number
        phone: fullPhoneNumber, 
      },
      shippingAddress: {
        type: "shipping",
        name: `${formData.firstName} ${formData.lastName}`,
        addressLine1: formData.addressLine1,
        addressLine2: formData.addressLine2, // Include this for completeness
        city: formData.city,
        state: formData.state,
        postalCode: formData.postalCode,
        country: formData.country,
        // Added phone here as backends often require it in both
        phone: fullPhoneNumber, 
      },
      subtotal: parseFloat(subtotal.toFixed(2)),
      taxAmount: parseFloat(taxAmount.toFixed(2)),
      shippingAmount: shippingAmount,
      discountAmount: parseFloat(discountAmount.toFixed(2)),
      totalAmount: parseFloat(totalAmount.toFixed(2)),
      // Backend might expect status fields on initial creation
      orderStatus: "Pending", // Default status
      paymentStatus: "Pending", // Default status
    };
    
    // --- Log payload for debugging ---
    console.log("Order Payload being sent:", baseOrderData);

    if (formData.shippingMethod === "Cash on Delivery") {
      // COD flow
      try {
        const orderData = {
          ...baseOrderData,
          paymentMethod: "cod",
          paymentStatus: "Pending", // COD is usually 'Pending' or 'Unpaid'
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
        const paymentResponse = await displayRazorpay();
        if (!paymentResponse) {
          setIsProcessing(false);
          return;
        }

        const orderData = {
          ...baseOrderData,
          paymentMethod: "credit_card",
          paymentStatus: "Paid", // Payment is successful at this point
          orderStatus: "Processing", // Or whatever your initial paid status is
          paymentInfo: {
            id: paymentResponse.razorpay_payment_id,
            order_id: paymentResponse.razorpay_order_id,
            signature: paymentResponse.razorpay_signature,
            // Include currency and amount for backend verification
            currency: baseOrderData.currency,
            amount: amountInPaise / 100, // Send amount in Rupee
          },
        };

        const order = await createOrder(orderData);

        toast({
          title: "Order placed successfully! 🎉",
          description: `Payment ID: ${paymentResponse.razorpay_payment_id}, Order ID: ${order._id}`,
        });

        clearCart();
        navigate(`/order/${userId}`);
      } catch (err) {
        console.error("Payment / Order error:", err);
        // Display user-friendly error from backend or generic message
        toast({
          title: "Payment / Order Failed",
          description:
            err.error?.description || err.message || "Something went wrong.",
          variant: "destructive",
        });
      } finally {
        setIsProcessing(false);
      }
    }
  };

  // ... (rest of the component JSX remains the same, except for the input labels)

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

        {/* Step Indicator - IMPROVED RESPONSIVENESS for small screens */}
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
                  className={`font-medium text-sm sm:text-base ${ // Small text on mobile
                    currentStep >= step.id
                      ? "text-primary"
                      : "text-muted-foreground"
                  } hidden sm:inline`} // Hide text on very small mobile screens for space
                >
                  {step.name}
                </span>
                {idx < steps.length - 1 && (
                  <div
                    // Reduced width and margin on small screens
                    className={`w-6 sm:w-12 h-0.5 mx-2 sm:mx-4 ${ 
                      currentStep > step.id ? "bg-primary" : "bg-muted"
                    }`}
                  />
                )}
              </motion.div>
            ))}
          </div>
        </div>
        {/* End Step Indicator */}

        {/* Main Content Grid - Mobile first (single column), then 2/3 and 1/3 on laptop */}
        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <motion.form
              onSubmit={handleSubmit}
              className="space-y-8"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Step 1: Shipping + address + optional fields */}
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

                  <div className="grid md:grid-cols-2 gap-6">
                    {/* First Name */}
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

                    {/* Last Name */}
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

                    {/* Email */}
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

                    {/* Phone Number with Country Code - IMPROVED RESPONSIVENESS for input group */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <div className="flex rounded-xl overflow-hidden border focus-within:ring-2 focus-within:ring-primary">
                        <select
                          name="countryCode"
                          value={formData.countryCode}
                          onChange={handleInputChange}
                          // Added w-auto to prevent it from taking too much space on mobile
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

                    {/* Company (Optional) */}
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

                    {/* Address Line 1 */}
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

                    {/* Address Line 2 */}
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

                    {/* City */}
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

                    {/* State */}
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

                    {/* ZIP Code */}
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

              {/* Step 2: Payment & shipping method */}
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
                              <div className="text-3xl">{item.emoji}</div>
                              <div>
                                <div className="font-medium">{item.name}</div>
                                <div className="text-sm">
                                  Qty: {item.quantity}
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

          {/* Order Summary - IMPROVED RESPONSIVENESS for sticky position */}
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Added lg:sticky to prevent sticky behavior on mobile */}
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
          {/* End Order Summary */}
        </div>
      </main>
    </div>
  );
};

export default Checkout;