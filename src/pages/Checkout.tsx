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
const loadRazorpayScript = (src: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const RAZORPAY_KEY_ID = "YOUR_RAZORPAY_KEY_ID"; // Replace with your key

const Checkout = () => {
  const { state, clearCart } = useCart();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

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
    notes: '',
    country: "India",
    shippingMethod: "Cash on Delivery",
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
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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
  const discountAmount = 0.00; 
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

    return new Promise<any>((resolve, reject) => {
      const options: any = {
        key: RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency,
        name: "My Awesome Store",
        description: "Payment for your order",
        order_id: data.order_id,
        handler: function (response: any) {
          resolve(response);
        },
        prefill: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: "#3399cc",
        },
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.on("payment.failed", (err: any) => {
        reject(err);
      });
      paymentObject.open();
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Step navigation logic
    if (currentStep === 1) {
      if (
        !formData.firstName ||
        !formData.addressLine1 ||
        !formData.email ||
        !formData.postalCode
      ) {
        toast({
          title: "Validation Error",
          description: "Please fill all required shipping fields.",
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
    let userId: string | null = null;
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

    // Prepare base order payload
    const baseOrderData: any = {
      userId,
      orderNumber: `ORD-${new Date()
        .toISOString()
        .slice(0, 10)
        .replace(/-/g, "")}-${Math.floor(Math.random() * 1000)}`,
      currency: "INR",
      items: state.items.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
        unitPrice: item.price,
        totalPrice: parseFloat((item.price * item.quantity).toFixed(2)),
        productName: item.name,
        productSku: item.sku || 'N/A',
        
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
        phone: formData.phone,
      },
      shippingAddress: {
        type: "shipping",
        name: `${formData.firstName} ${formData.lastName}`,
        addressLine1: formData.addressLine1,
        
        city: formData.city,
        state: formData.state,
        postalCode: formData.postalCode,
        country: formData.country,
      },
      subtotal: parseFloat(subtotal.toFixed(2)),
      taxAmount: parseFloat(taxAmount.toFixed(2)),
      shippingAmount: shippingAmount,

      discountAmount: parseFloat(discountAmount.toFixed(2)),
      totalAmount: parseFloat(totalAmount.toFixed(2)),
      
    };

    if (formData.shippingMethod === "Cash on Delivery") {
      // COD flow
      try {
        const orderData = {
          ...baseOrderData,
          paymentMethod: "cod",
        };

        const order = await createOrder(orderData);

        toast({
  title: "Order placed successfully! 🎉",
  description: `Order ID: ${order._id}`,
});

clearCart();
navigate(`/order/${userId}`);
      } catch (err: any) {
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
          paymentInfo: {
            id: paymentResponse.razorpay_payment_id,
            order_id: paymentResponse.razorpay_order_id,
            signature: paymentResponse.razorpay_signature,
          },
        };

        const order = await createOrder(orderData);

        toast({
  title: "Order placed successfully! 🎉",
  description: `Payment ID: ${paymentResponse.razorpay_payment_id}, Order ID: ${order._id}`,
});

clearCart();
navigate(`/order/${userId}`);
      } catch (err: any) {
        console.error("Payment / Order error:", err);
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

        <div className="flex justify-center mb-12">
          <div className="flex items-center space-x-8">
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
                  className={`font-medium ${
                    currentStep >= step.id
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  {step.name}
                </span>
                {idx < steps.length - 1 && (
                  <div
                    className={`w-12 h-0.5 mx-4 ${
                      currentStep > step.id ? "bg-primary" : "bg-muted"
                    }`}
                  />
                )}
              </motion.div>
            ))}
          </div>
        </div>

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
                  className="bg-card rounded-3xl p-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex items-center space-x-3 mb-6">
                    <User className="text-primary" />
                    <h2 className="text-2xl font-bold">Shipping Information</h2>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        First Name *
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
                      <label className="block text-sm font-medium mb-2">
                        Last Name *
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
                      <label className="block text-sm font-medium mb-2">
                        Email Address *
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
                      <label className="block text-sm font-medium mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-2">
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
                      <label className="block text-sm font-medium mb-2">
                        Street Address *
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
                      <label className="block text-sm font-medium mb-2">
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
                      <label className="block text-sm font.medium mb-2">
                        City *
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
                      <label className="block text-sm font-medium mb-2">
                        State *
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
                      <label className="block text-sm font-medium mb-2">
                        ZIP Code *
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
                            {formData.city}, {formData.state} {formData.postalCode}
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

          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-card rounded-3xl p-8 sticky top-8">
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
                    <span className="text-primary">₹{totalAmount.toFixed(2)}</span>
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

// import React, { useState, createContext, useContext } from 'react';
// import { motion } from 'framer-motion';
// import {
//   CreditCard,
//   User,
//   MapPin,
//   Package,
//   ArrowLeft,
//   Lock,
//   CheckCircle,
//   Truck,
//   Building2,
//   StickyNote,
// } from 'lucide-react';

// const mockCartState = {
//   items: [
//     { id: '1', name: 'Premium Wireless Headphones', price: 199.99, quantity: 1, sku: 'WH-001-BLACK', emoji: '🎧' },
//     { id: '2', name: 'Quick Charge Adapter', price: 50.00, quantity: 5, sku: 'QC-20W-W', emoji: '🔌' },
//   ],
//   total: 199.99 * 1 + 50.00 * 5, // 199.99 + 250 = 449.99
// };

// const CartContext = createContext(
//   /** @type {CartContextType} */ ({
//     state: mockCartState,
//     clearCart: () => console.log('Mock clearCart called.'),
//     addItem: () => {},
//     removeItem: () => {},
//   })
// );

// /** @returns {CartContextType} */
// const useCart = () => useContext(CartContext);

// // 2. Mock Toast Notification
// /** @typedef {Object} ToastOptions */
// /**
//  * @typedef {object} ToastOptions
//  * @property {string} title
//  * @property {string} description
//  * @property {'default' | 'destructive'} [variant]
//  */
// /** @param {ToastOptions} options */
// const toast = (options) => {
//   const isDestructive = options.variant === 'destructive';
//   const color = isDestructive ? 'bg-red-500' : 'bg-green-500';
//   const icon = isDestructive ? '❌' : '✅';
//   console.log(`[TOAST ${icon}] ${options.title}: ${options.description}`);
//   // Simple in-app alert for visualization purposes, replacing the use of external toast system
//   const toastEl = document.createElement('div');
//   toastEl.innerHTML = `
//     <div style="position: fixed; top: 20px; right: 20px; padding: 15px; border-radius: 12px; z-index: 1000; box-shadow: 0 4px 12px rgba(0,0,0,0.1); font-family: sans-serif; transition: all 0.3s ease-in-out;" class="${color} text-white">
//       <strong>${options.title}</strong>
//       <p style="font-size: 0.9em;">${options.description}</p>
//     </div>
//   `;
//   document.body.appendChild(toastEl);
//   setTimeout(() => document.body.removeChild(toastEl), 4000);
// };

// // 3. Mock API Call
// /** @param {any} orderData */
// const createOrder = async (orderData) => {
//   console.log('--- MOCK API: Creating Order ---');
//   console.log(JSON.stringify(orderData, null, 2));
//   await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
//   if (Math.random() < 0.1) {
//     throw new Error('Mock network failure during order placement.');
//   }
//   return {
//     _id: `ORD-${Date.now()}`,
//     orderNumber: orderData.orderNumber,
//     totalAmount: orderData.totalAmount,
//   };
// };

// // 4. Mock Router
// const useNavigate = () => {
//   /** @param {string | number} target */
//   return (target) => {
//     if (typeof target === 'number') {
//       console.log(`Mock Navigation: Going back ${Math.abs(target)} steps.`);
//     } else {
//       console.log(`Mock Navigation: Navigating to ${target}`);
//       // Simple hash change to simulate navigation in a single-file environment
//       window.location.hash = target;
//     }
//   };
// };

// const RAZORPAY_KEY_ID = "YOUR_RAZORPAY_KEY_ID"; // Replace with your key

// // Dynamically load Razorpay script
// /** @param {string} src */
// const loadRazorpayScript = (src) => {
//   return new Promise((resolve) => {
//     const script = document.createElement('script');
//     script.src = src;
//     script.onload = () => resolve(true);
//     script.onerror = () => resolve(false);
//     document.body.appendChild(script);
//   });
// };

// const Checkout = () => {
//   const { state, clearCart } = useCart();
//   const navigate = useNavigate();

//   const [currentStep, setCurrentStep] = useState(1);
//   const [isProcessing, setIsProcessing] = useState(false);

//   // Updated formData keys to map closer to the desired JSON output
//   const [formData, setFormData] = useState({
//     // Address fields mapping: name, addressLine1, addressLine2, city, state, postalCode, country, phone
//     firstName: '',
//     lastName: '',
//     company: '', // Optional: added for billingAddress completeness
//     email: '',
//     phone: '',
//     addressLine1: '', // Renamed from 'address'
//     addressLine2: '', // New optional field
//     city: '',
//     state: '',
//     postalCode: '', // Renamed from 'zipCode'
//     country: 'India',
//     notes: '', // New optional field
//     shippingMethod: 'Cash on Delivery',
//   });

//   const steps = [
//     { id: 1, name: 'Shipping', icon: MapPin },
//     { id: 2, name: 'Payment', icon: CreditCard },
//     { id: 3, name: 'Review', icon: Package },
//   ];

//   const shippingMethods = [
//     { id: 'Cash on Delivery', name: 'Cash on Delivery (COD)' },
//     { id: 'Online', name: 'Pay with Razorpay (Online)' },
//   ];

//   /** @param {React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>} e */
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const subtotal = state.total;
//   const shippingAmount = 50.00; // Fixed shipping cost to match provided JSON example
//   const taxRate = 0.08;
//   const taxAmount = subtotal * taxRate;
//   const discountAmount = 0.00; // Mock discount amount, adjust if needed
//   const totalAmount = subtotal + shippingAmount + taxAmount - discountAmount;
//   const amountInPaise = Math.round(totalAmount * 100);

//   // Razorpay integration
//   const displayRazorpay = async () => {
//     // Check if Razorpay key is set
//     if (RAZORPAY_KEY_ID === "YOUR_RAZORPAY_KEY_ID") {
//         toast({
//             title: "Configuration Error",
//             description: "Please replace 'YOUR_RAZORPAY_KEY_ID' with a valid key.",
//             variant: "destructive",
//         });
//         setIsProcessing(false);
//         return null;
//     }

//     const res = await loadRazorpayScript('https://checkout.razorpay.com/v1/checkout.js');
//     if (!res) {
//       toast({
//         title: "Payment Gateway Error",
//         description: "Razorpay SDK failed to load. Are you online?",
//         variant: "destructive",
//       });
//       setIsProcessing(false);
//       return null;
//     }

//     // In a real application, you call your backend to create the Razorpay Order (pre-purchase)
//     // Here we mock the server response structure for a successful order creation
//     const data = {
//       order_id: `order_${Math.floor(Math.random() * 10000000000)}`, // mock order_id
//       currency: 'INR',
//       amount: amountInPaise,
//     };

//     if (!data.order_id) {
//       toast({
//         title: "Order Creation Error",
//         description: "Failed to get payment order id from server.",
//         variant: "destructive",
//       });
//       setIsProcessing(false);
//       return null;
//     }

//     // Promise to handle the outcome of the Razorpay modal interaction
//     return new Promise((resolve, reject) => {
//       const options = {
//         key: RAZORPAY_KEY_ID,
//         amount: data.amount,
//         currency: data.currency,
//         name: "My Awesome Store",
//         description: "Payment for your order",
//         order_id: data.order_id,
//         // The handler function is called when payment is successful
//         handler: async function (response) {
//           resolve(response);
//         },
//         // Pre-fill user information
//         prefill: {
//           name: `${formData.firstName} ${formData.lastName}`,
//           email: formData.email,
//           contact: formData.phone,
//         },
//         theme: {
//           color: "#007bff", // Blue theme to match primary color
//         },
//       };

//       const paymentObject = new (window).Razorpay(options);

//       // Handle payment failure or user closing the modal
//       paymentObject.on('payment.failed', (err) => {
//         reject(new Error(err.error?.description || "Payment failed or cancelled."));
//       });

//       paymentObject.open();
//     });
//   };

//   /** @param {React.FormEvent} e */
//   const handleSubmit = async (e) => {
//     e.preventDefault();

// if (currentStep === 1) {
//   if (!formData.firstName || !formData.addressLine1 || !formData.email || !formData.postalCode) {
//     toast({
//       title: "Validation Error",
//       description: "Please fill all required shipping fields.",
//       variant: "destructive",
//     });
//     return;
//   }
//   setCurrentStep(2);
//   return;
// }

//     if (currentStep === 2) {
//       setCurrentStep(3);
//       return;
//     }

//     // Step 3: actual order placement
//     setIsProcessing(true);

//     // --- Mock User ID Retrieval ---
//     // Since this is a standalone file, we'll mock the userId
//     const userId = "MOCK_USER_68ce7bacdce516268e77aadd";

//     // Construct Address Objects based on the JSON structure
//     const billingAddress = {
//       type: "billing",
//       name: `${formData.firstName} ${formData.lastName}`,
//       company: formData.company || 'N/A',
//       addressLine1: formData.addressLine1,
//       addressLine2: formData.addressLine2,
//       city: formData.city,
//       state: formData.state,
//       postalCode: formData.postalCode,
//       country: formData.country,
//       phone: formData.phone,
//     };

//     const shippingAddress = {
//       type: "shipping",
//       name: `${formData.firstName} ${formData.lastName}`,
//       addressLine1: formData.addressLine1,

//       city: formData.city,
//       state: formData.state,
//       postalCode: formData.postalCode,
//       country: formData.country,
//       // Note: Removed phone from shipping to match the provided JSON structure
//     };

//     // Construct Items array matching the JSON structure
//     const orderItems = state.items.map(item => ({
//       productId: item.id,
//       quantity: item.quantity,
//       unitPrice: parseFloat(item.price.toFixed(2)),
//       totalPrice: parseFloat((item.price * item.quantity).toFixed(2)),
//       productName: item.name,
//       productSku: item.sku || 'N/A',
//     }));

//     // Base Order Data object matching the JSON structure
// const baseOrderData = {
  // userId,
  // orderNumber: `ORD-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(Math.random() * 1000)}`,
  // items: orderItems,
  // billingAddress,
  // shippingAddress,
  // subtotal: parseFloat(subtotal.toFixed(2)),
  // taxAmount: parseFloat(taxAmount.toFixed(2)),
  // shippingAmount: parseFloat(shippingAmount.toFixed(2)),
  // discountAmount: parseFloat(discountAmount.toFixed(2)),
  // totalAmount: parseFloat(totalAmount.toFixed(2)),
  // currency: "INR",
  // notes: formData.notes,
// };

//     if (formData.shippingMethod === 'Cash on Delivery') {
//       // COD flow
//       try {
//         const orderData = {
//           ...baseOrderData,
//           paymentMethod: "cod",
//         };

//         const order = await createOrder(orderData);

//         toast({
//           title: "Order placed successfully! 🎉",
//           description: `Order ID: ${order._id}. Payment method: COD.`,
//         });

//         clearCart();
//         navigate(`/order-confirmation/${order._id}`);
//       } catch (err) {
//         toast({
//           title: "Order Failed",
//           description: err.message || "Something went wrong during COD placement.",
//           variant: "destructive",
//         });
//       } finally {
//         setIsProcessing(false);
//       }
//     } else {
//       // Online payment flow
//       try {
//         const paymentResponse = await displayRazorpay();
//         if (!paymentResponse) {
//           // Razorpay failed or user cancelled, already handled in displayRazorpay reject
//           setIsProcessing(false);
//           return;
//         }

//         // Finalize order with successful payment info
//         const orderData = {
//           ...baseOrderData,
//           paymentMethod: "online_payment",
//           paymentInfo: {
//             id: paymentResponse.razorpay_payment_id,
//             order_id: paymentResponse.razorpay_order_id,
//             signature: paymentResponse.razorpay_signature,
//             status: "paid", // Assuming successful payment here
//           },
//         };

//         const order = await createOrder(orderData);

//         toast({
//           title: "Order placed successfully! 🎉",
//           description: `Payment ID: ${paymentResponse.razorpay_payment_id}, Order ID: ${order._id}`,
//         });

//         clearCart();
//         navigate(`/order-confirmation/${order._id}`);
//       } catch (err) {
//         console.error("Payment / Order error:", err);
//         toast({
//           title: "Payment / Order Failed",
//           description: err.message || "Online payment or order placement failed.",
//           variant: "destructive",
//         });
//       } finally {
//         setIsProcessing(false);
//       }
//     }
//   };

//   if (state.items.length === 0) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <div className="text-6xl mb-4">🛒</div>
//           <h2 className="text-3xl font-bold mb-2">Your cart is empty</h2>
//           <p className="text-muted-foreground mb-4">Add items to checkout</p>
//           <motion.button
//             className="px-6 py-3 rounded-xl font-semibold bg-primary text-primary-foreground hover:bg-primary-glow transition-colors"
//             onClick={() => navigate('/')}
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//           >
//             Continue Shopping
//           </motion.button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen p-4 sm:p-8" style={{ fontFamily: 'Inter, sans-serif' }}>
//       {/* Tailwind Config for readability (not strictly necessary but helps define custom colors) */}
//       <style>{`
//         .bg-background { background-color: #f7f9fb; }
//         .bg-card { background-color: #ffffff; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05); }
//         .text-primary { color: #007bff; }
//         .bg-primary { background-color: #007bff; }
//         .text-primary-foreground { color: #ffffff; }
//         .bg-primary-glow:hover { box-shadow: 0 0 20px rgba(0, 123, 255, 0.5); }
//         .gradient-text { background: linear-gradient(to right, #007bff, #0056b3); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
//         .text-success { color: #28a745; }
//         .text-success-foreground { color: #ffffff; }
//         .from-success { background-color: #28a745; }
//         .to-accent { background-color: #00bcd4; }
//         .shadow-playful { box-shadow: 0 5px 15px rgba(40, 167, 69, 0.3); }
//         .hover\\:shadow-glow:hover { box-shadow: 0 0 25px rgba(40, 167, 69, 0.7); }
//         .text-muted-foreground { color: #6c757d; }
//         .border-border { border-color: #e9ecef; }
//         input:focus { border-color: #007bff; }
//       `}</style>
//       <main className="max-w-7xl mx-auto py-8">
//         <motion.button
//           className="flex items-center space-x-2 text-muted-foreground hover:text-primary mb-8"
//           onClick={() => navigate(-1)}
//           whileHover={{ x: -5 }}
//           whileTap={{ scale: 0.95 }}
//         >
//           <ArrowLeft size={20} />
//           <span>Back to cart</span>
//         </motion.button>

//         <div className="text-center mb-12">
//           <motion.h1
//             className="text-4xl sm:text-5xl font-extrabold mb-4"
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//           >
//             <span className="gradient-text">Secure Checkout</span> 🔒
//           </motion.h1>
//           <p className="text-muted-foreground">Complete your order safely and securely in 3 simple steps</p>
//         </div>

//         {/* Step Indicator */}
//         <div className="flex justify-center mb-12 overflow-x-auto p-2">
//           <div className="flex items-center space-x-4 sm:space-x-8">
//             {steps.map((step, idx) => (
//               <motion.div
//                 key={step.id}
//                 className="flex items-center space-x-3"
//                 initial={{ opacity: 0, scale: 0.8 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 transition={{ delay: idx * 0.1 }}
//               >
//                 <div
//                   className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all flex-shrink-0 ${
//                     currentStep >= step.id
//                       ? 'bg-primary text-white'
//                       : 'bg-muted text-muted-foreground'
//                   }`}
//                 >
//                   {currentStep > step.id ? <CheckCircle size={20} /> : <step.icon size={20} />}
//                 </div>
//                 <span
//                   className={`font-medium text-sm sm:text-base whitespace-nowrap ${
//                     currentStep >= step.id ? 'text-primary' : 'text-muted-foreground'
//                   }`}
//                 >
//                   {step.name}
//                 </span>
//                 {idx < steps.length - 1 && (
//                   <div className={`w-12 h-0.5 mx-2 sm:mx-4 transition-colors ${currentStep > step.id ? 'bg-primary' : 'bg-border'}`} />
//                 )}
//               </motion.div>
//             ))}
//           </div>
//         </div>

//         <div className="grid lg:grid-cols-3 gap-8 sm:gap-12">
//           <div className="lg:col-span-2">
//             <motion.form
//               onSubmit={handleSubmit}
//               className="space-y-8"
//               initial={{ opacity: 0, x: -20 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ duration: 0.6 }}
//             >
//               {/* Step 1: Shipping Information (Mapping to JSON Address fields) */}
//               {currentStep === 1 && (
//                 <motion.div
//                   className="bg-card rounded-3xl p-6 sm:p-8"
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                 >
//                   <div className="flex items-center space-x-3 mb-6 border-b pb-4">
//                     <User className="text-primary" />
//                     <h2 className="text-xl sm:text-2xl font-bold">Billing/Shipping Details</h2>
//                   </div>
//                   <div className="grid md:grid-cols-2 gap-6">
//                     <div>
//                       <label className="block text-sm font-medium mb-2">First Name *</label>
//                       <input
//                         type="text"
//                         name="firstName"
//                         value={formData.firstName}
//                         onChange={handleInputChange}
//                         required
//                         className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-shadow"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium mb-2">Last Name *</label>
//                       <input
//                         type="text"
//                         name="lastName"
//                         value={formData.lastName}
//                         onChange={handleInputChange}
//                         required
//                         className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-shadow"
//                       />
//                     </div>
//                     <div className="md:col-span-2">
//                       <label className="block text-sm font-medium mb-2">Company (Optional - Billing)</label>
//                       <div className="relative">
//                         <Building2 size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
//                         <input
//                           type="text"
//                           name="company"
//                           value={formData.company}
//                           onChange={handleInputChange}
//                           className="w-full pl-10 pr-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-shadow"
//                           placeholder="Example Corp"
//                         />
//                       </div>
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium mb-2">Email Address *</label>
//                       <input
//                         type="email"
//                         name="email"
//                         value={formData.email}
//                         onChange={handleInputChange}
//                         required
//                         className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-shadow"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium mb-2">Phone Number *</label>
//                       <input
//                         type="tel"
//                         name="phone"
//                         value={formData.phone}
//                         onChange={handleInputChange}
//                         required
//                         className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-shadow"
//                       />
//                     </div>
//                     <div className="md:col-span-2">
//                       <label className="block text-sm font-medium mb-2">Address Line 1 (Street Address) *</label>
//                       <input
//                         type="text"
//                         name="addressLine1"
//                         value={formData.addressLine1}
//                         onChange={handleInputChange}
//                         required
//                         className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-shadow"
//                       />
//                     </div>
//                     <div className="md:col-span-2">
//                       <label className="block text-sm font-medium mb-2">Address Line 2 (Apt, Suite, Optional)</label>
//                       <input
//                         type="text"
//                         name="addressLine2"
//                         value={formData.addressLine2}
//                         onChange={handleInputChange}
//                         className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-shadow"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium mb-2">City *</label>
//                       <input
//                         type="text"
//                         name="city"
//                         value={formData.city}
//                         onChange={handleInputChange}
//                         required
//                         className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-shadow"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium mb-2">State *</label>
//                       <input
//                         type="text"
//                         name="state"
//                         value={formData.state}
//                         onChange={handleInputChange}
//                         required
//                         className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-shadow"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium mb-2">Postal Code (ZIP) *</label>
//                       <input
//                         type="text"
//                         name="postalCode"
//                         value={formData.postalCode}
//                         onChange={handleInputChange}
//                         required
//                         className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-shadow"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium mb-2">Country</label>
//                       <input
//                         type="text"
//                         name="country"
//                         value={formData.country}
//                         readOnly
//                         className="w-full px-4 py-3 border border-border rounded-xl bg-muted/50 text-muted-foreground cursor-not-allowed"
//                       />
//                     </div>
//                     <div className="md:col-span-2">
//                       <label className="block text-sm font-medium mb-2">Order Notes (Optional)</label>
//                       <div className="relative">
//                         <StickyNote size={18} className="absolute left-3 top-4 text-muted-foreground" />
//                         <textarea
//                           name="notes"
//                           rows={3}
//                           value={formData.notes}
//                           onChange={handleInputChange}
//                           className="w-full pl-10 pr-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-shadow"
//                           placeholder="e.g., Please deliver before 5 PM."
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 </motion.div>
//               )}

//               {/* Step 2: Payment and Shipping Method */}
//               {currentStep === 2 && (
//                 <motion.div
//                   className="bg-card rounded-3xl p-6 sm:p-8 space-y-8"
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                 >
//                   <div className="flex items-center space-x-3 mb-6 border-b pb-4">
//                     <Truck className="text-primary" />
//                     <h2 className="text-xl sm:text-2xl font-bold">Shipping Method</h2>
//                   </div>
//                   <div className="space-y-4">
//                     {shippingMethods.map((method) => (
//                       <label
//                         key={method.id}
//                         className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-all ${
//                           formData.shippingMethod === method.id
//                             ? 'border-primary ring-2 ring-primary/50 bg-primary/5'
//                             : 'border-border bg-background hover:bg-muted/50'
//                         }`}
//                       >
//                         <div className="flex items-center">
//                           <input
//                             type="radio"
//                             name="shippingMethod"
//                             value={method.id}
//                             checked={formData.shippingMethod === method.id}
//                             onChange={handleInputChange}
//                             className="h-5 w-5 text-primary accent-primary focus:ring-primary border-border"
//                           />
//                           <div className="ml-4">
//                             <p className="font-medium text-foreground">{method.name}</p>
//                             <p className="text-xs text-muted-foreground">
//                                 {method.id === 'Cash on Delivery' ? 'Pay cash to the courier upon delivery.' : 'Pay securely using credit card, UPI, or net banking.'}
//                             </p>
//                           </div>
//                         </div>
//                         <span className="font-semibold text-primary">
//                             {method.id === 'Cash on Delivery' ? '' : `₹${totalAmount.toFixed(2)}`}
//                         </span>
//                       </label>
//                     ))}
//                   </div>

//                   <div className="flex items-center space-x-3 mb-6 pt-4 border-t">
//                     <CreditCard className="text-primary" />
//                     <h2 className="text-xl sm:text-2xl font-bold">Payment Preview</h2>
//                   </div>
//                   <div className="p-4 border-2 border-dashed rounded-xl bg-primary/5 text-center">
//                     <p className="font-semibold text-primary">
//                       Selected Method: **{formData.shippingMethod === 'Cash on Delivery' ? 'Cash on Delivery' : 'Online Payment (Razorpay)'}**
//                     </p>
//                     <p className="text-sm text-muted-foreground mt-2">
//                       Online payment will be processed securely via a Razorpay modal after clicking Continue.
//                     </p>
//                   </div>
//                 </motion.div>
//               )}

//               {/* Step 3: Review Order */}
//               {currentStep === 3 && (
//                 <motion.div
//                   className="bg-card rounded-3xl p-6 sm:p-8"
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                 >
//                   <div className="flex items-center space-x-3 mb-6 border-b pb-4">
//                     <Package className="text-primary" />
//                     <h2 className="text-xl sm:text-2xl font-bold">Review & Place Order</h2>
//                   </div>
//                   <div className="space-y-8">
//                     {/* Order Items Review */}
//                     <div>
//                       <h3 className="font-semibold mb-4 text-lg">Order Items ({state.items.length})</h3>
//                       <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
//                         {state.items.map((item) => (
//                           <div
//                             key={item.id + '-' + (item.selectedColor || '')}
//                             className="flex items-center justify-between p-3 bg-muted/30 rounded-xl"
//                           >
//                             <div className="flex items-center space-x-4">
//                               <div className="text-xl">{item.emoji || '📦'}</div>
//                               <div>
//                                 <div className="font-medium">{item.name}</div>
//                                 <div className="text-sm text-muted-foreground">Qty: {item.quantity} | SKU: {item.sku || 'N/A'}</div>
//                               </div>
//                             </div>
//                             <div className="font-semibold text-primary text-sm">
//                               ₹{(item.price * item.quantity).toFixed(2)}
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     </div>

//                     {/* Address & Payment Summary */}
//                     <div className="grid md:grid-cols-2 gap-6 pt-4 border-t border-border">
//                       <div>
//                         <h3 className="font-semibold mb-2 text-lg">Shipping Address</h3>
//                         <div className="text-sm text-muted-foreground space-y-1 p-3 bg-muted/20 rounded-xl">
//                           <p className="font-medium text-foreground">{formData.firstName} {formData.lastName}</p>
//                           <p>{formData.addressLine1}{formData.addressLine2 && `, ${formData.addressLine2}`}</p>
//                           <p>{formData.city}, {formData.state} - {formData.postalCode}</p>
//                           <p>{formData.country}</p>
//                           <p>Phone: {formData.phone}</p>
//                         </div>
//                       </div>
//                       <div>
//                         <h3 className="font-semibold mb-2 text-lg">Payment Method</h3>
//                         <div className="text-sm space-y-1 p-3 bg-muted/20 rounded-xl">
//                           <p className="font-medium text-primary">
//                             {formData.shippingMethod === 'Cash on Delivery' ? 'Cash on Delivery (COD)' : 'Online Payment (Razorpay)'}
//                           </p>
//                           <p className="text-muted-foreground">Order Total: <span className="font-semibold">₹{totalAmount.toFixed(2)}</span></p>
//                           <p className="text-xs italic text-muted-foreground">Currency: INR</p>
//                         </div>
//                         {formData.notes && (
//                             <div className='mt-4'>
//                                 <h3 className="font-semibold mb-1 text-sm">Notes</h3>
//                                 <p className="text-xs text-muted-foreground italic">"{formData.notes}"</p>
//                             </div>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 </motion.div>
//               )}

//               {/* Navigation Buttons */}
//               <div className="flex justify-between mt-8">
//                 {currentStep > 1 && (
//                   <motion.button
//                     type="button"
//                     className="px-6 sm:px-8 py-3 border border-border rounded-xl text-foreground hover:bg-muted transition-colors font-medium"
//                     onClick={() => setCurrentStep(currentStep - 1)}
//                     whileHover={{ scale: 1.02 }}
//                     whileTap={{ scale: 0.98 }}
//                   >
//                     <ArrowLeft size={16} className="inline mr-2" /> Back
//                   </motion.button>
//                 )}
//                 <motion.button
//                   type="submit"
//                   disabled={isProcessing}
//                   className={`${currentStep > 1 ? 'ml-auto' : 'w-full'} px-8 py-3 rounded-xl font-semibold transition-all flex items-center justify-center space-x-2 ${
//                     currentStep === 3
//                       ? 'bg-gradient-to-r from-success to-accent text-success-foreground shadow-playful hover:shadow-glow'
//                       : 'bg-primary text-primary-foreground hover:bg-primary-glow'
//                   } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
//                   whileHover={!isProcessing ? { scale: 1.02 } : {}}
//                   whileTap={!isProcessing ? { scale: 0.98 } : {}}
//                 >
//                   {isProcessing ? (
//                     <>
//                       <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
//                       <span>Processing...</span>
//                     </>
//                   ) : currentStep === 3 ? (
//                     'Place Order ₹' + totalAmount.toFixed(2) + ' 🚀'
//                   ) : (
//                     'Continue'
//                   )}
//                 </motion.button>
//               </div>
//             </motion.form>
//           </div>

//           {/* Order Summary Card */}
//           <motion.div
//             className="lg:col-span-1"
//             initial={{ opacity: 0, x: 20 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.6, delay: 0.2 }}
//           >
//             <div className="bg-card rounded-3xl p-6 sm:p-8 sticky top-8">
//               <h3 className="text-2xl font-bold mb-6 border-b pb-4">Invoice Summary</h3>
//               <div className="space-y-4 mb-6">
//                 <div className="flex justify-between text-muted-foreground">
//                   <span>Subtotal</span>
//                   <span>₹{subtotal.toFixed(2)}</span>
//                 </div>
//                 <div className="flex justify-between text-muted-foreground">
//                   <span>Shipping Amount</span>
//                   <span>₹{shippingAmount.toFixed(2)}</span>
//                 </div>
//                 <div className="flex justify-between text-muted-foreground">
//                   <span>Tax Amount ({taxRate * 100}%)</span>
//                   <span>₹{taxAmount.toFixed(2)}</span>
//                 </div>
//                 {discountAmount > 0 && (
//                     <div className="flex justify-between text-success font-semibold">
//                         <span>Discount Amount</span>
//                         <span>- ₹{discountAmount.toFixed(2)}</span>
//                     </div>
//                 )}
//                 <div className="border-t border-border pt-4">
//                   <div className="flex justify-between text-xl font-bold">
//                     <span>Total Amount</span>
//                     <span className="text-primary">₹{totalAmount.toFixed(2)}</span>
//                   </div>
//                 </div>
//               </div>

//               <div className="space-y-3 text-sm text-muted-foreground pt-4 border-t">
//                 <div className="flex items-center space-x-2">
//                   <Lock size={16} className="text-success" />
//                   <span>Secure SSL connection</span>
//                 </div>
//                 <div className="flex items-center space-x-2">
//                   <CheckCircle size={16} className="text-success" />
//                   <span>Encrypted Payment Processing</span>
//                 </div>
//                 <div className="flex items-center space-x-2">
//                   <CreditCard size={16} className="text-primary" />
//                   <span>Razorpay for all Online Payments</span>
//                 </div>
//               </div>
//             </div>
//           </motion.div>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default Checkout;
