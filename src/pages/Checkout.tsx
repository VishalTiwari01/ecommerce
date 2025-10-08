import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  CreditCard,
  User,
  MapPin,
  Package,
  ArrowLeft,
  Lock,
  CheckCircle,
} from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { toast } from '../hooks/use-toast';
import { createOrder } from '../APi/api.js'; // adjust path as needed

// Dynamically load Razorpay script
const loadRazorpayScript = (src: string) => {
  return new Promise<boolean>((resolve) => {
    const script = document.createElement('script');
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
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India',
    shippingMethod: 'Cash on Delivery',
  });

  const steps = [
    { id: 1, name: 'Shipping', icon: MapPin },
    { id: 2, name: 'Payment', icon: CreditCard },
    { id: 3, name: 'Review', icon: Package },
  ];

  const shippingMethods = [
    { id: 'Cash on Delivery', name: 'Cash on Delivery' },
    { id: 'Online', name: 'Pay with Razorpay (Online)' },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const subtotal = state.total;
  const shippingCost = 0; // adjust if you have shipping cost
  const tax = subtotal * 0.08;
  const total = subtotal + shippingCost + tax;
  const amountInPaise = Math.round(total * 100);

  // Razorpay integration
  const displayRazorpay = async () => {
    const res = await loadRazorpayScript('https://checkout.razorpay.com/v1/checkout.js');
    if (!res) {
      toast({
        title: "Payment Gateway Error",
        description: "Razorpay SDK failed to load. Are you online?",
        variant: "destructive",
      });
      setIsProcessing(false);
      return null;
    }

    // In production you must call your backend to create the Razorpay order and get order_id
    const data = {
      order_id: `rzp_order_${Math.floor(Math.random() * 1000000)}`, // mock
      currency: 'INR',
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
        handler: async function (response: any) {
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
      paymentObject.on('payment.failed', (err: any) => {
        reject(err);
      });
      paymentObject.open();
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (currentStep === 1) {
      if (!formData.firstName || !formData.address || !formData.email) {
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

    // Step 3: actual order placement
    setIsProcessing(true);

    // Get userId from localStorage
    const storedUser = localStorage.getItem("user");
    let userId: string | null = null;
    if (storedUser) {
      try {
        const userObj = JSON.parse(storedUser);
        // Adjust this path depending on how your user object is structured
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

    if (formData.shippingMethod === 'Cash on Delivery') {
      // COD flow
      try {
        const orderData = {
          userId,
          orderNumber: `ORDER-${Date.now()}`,
          paymentMethod: "cod",
          items: state.items.map(item => ({
            productId: item.id,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
          })),
          billingAddress: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            city: formData.city,
            state: formData.state,
            zipCode: formData.zipCode,
            country: formData.country,
          },
          shippingAddress: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            city: formData.city,
            state: formData.state,
            zipCode: formData.zipCode,
            country: formData.country,
          },
          subtotal: parseFloat(subtotal.toFixed(2)),
          totalAmount: parseFloat(total.toFixed(2)),
        };

        const order = await createOrder(orderData);

        toast({
          title: "Order placed successfully! 🎉",
          description: `Order ID: ${order._id}`,
        });

        clearCart();
        navigate(`/order/${order._id}`);
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
      // Online payment flow
      try {
        const paymentResponse = await displayRazorpay();
        if (!paymentResponse) {
          // Razorpay failed or user cancelled
          return;
        }
        const orderData = {
          userId,
          orderNumber: `ORDER-${Date.now()}`,
          paymentMethod: "upi", // or choose an allowed method; adjust accordingly
          items: state.items.map(item => ({
            productId: item.id,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
          })),
          billingAddress: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            city: formData.city,
            state: formData.state,
            zipCode: formData.zipCode,
            country: formData.country,
          },
          shippingAddress: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            city: formData.city,
            state: formData.state,
            zipCode: formData.zipCode,
            country: formData.country,
          },
          subtotal: parseFloat(subtotal.toFixed(2)),
          totalAmount: parseFloat(total.toFixed(2)),
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
        navigate(`/order/${order._name || order._id}`);
      } catch (err: any) {
        console.error("Payment / Order error:", err);
        toast({
          title: "Payment / Order Failed",
          description: err.error?.description || err.message || "Something went wrong.",
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
            onClick={() => navigate('/')}
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
          <p className="text-muted-foreground">Complete your order safely and securely</p>
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
                      ? 'bg-gradient-to-r from-primary to-secondary text-white'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {currentStep > step.id ? <CheckCircle size={20} /> : <step.icon size={20} />}
                </div>
                <span
                  className={`font-medium ${
                    currentStep >= step.id ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  {step.name}
                </span>
                {idx < steps.length - 1 && (
                  <div className={`w-12 h-0.5 mx-4 ${currentStep > step.id ? 'bg-primary' : 'bg-muted'}`} />
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
              {/* Step 1 */}
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
                      <label className="block text-sm font-medium mb-2">First Name *</label>
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
                      <label className="block text-sm font-medium mb-2">Last Name *</label>
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
                      <label className="block text-sm font-medium mb-2">Email Address *</label>
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
                      <label className="block text-sm font-medium mb-2">Phone Number *</label>
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
                      <label className="block text-sm font-medium mb-2">Street Address *</label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">City *</label>
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
                      <label className="block text-sm font-medium mb-2">State *</label>
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
                      <label className="block text-sm font-medium mb-2">ZIP Code *</label>
                      <input
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 2 */}
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
                      Payment will be securely processed by Razorpay if you choose online.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      You will enter card details in a pop-up window after clicking Continue.
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
                            ? 'border-primary ring-2 ring-primary/50 bg-primary/5'
                            : 'border-border bg-background hover:bg-muted/50'
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
                            <p className="font-medium text-foreground">{method.name}</p>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Step 3 */}
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
                            key={item.id + '-' + (item.selectedColor || '')}
                            className="flex items-center justify-between p-4 bg-muted/30 rounded-xl"
                          >
                            <div className="flex items-center space-x-4">
                              <div className="text-3xl">{item.emoji}</div>
                              <div>
                                <div className="font-medium">{item.name}</div>
                                <div className="text-sm">Qty: {item.quantity}</div>
                              </div>
                            </div>
                            <div className="font-semibold text-primary">
                              ${(item.price * item.quantity).toFixed(2)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-semibold mb-2">Shipping Address</h3>
                        <div className="text-sm text-muted-foreground">
                          <p>{formData.firstName} {formData.lastName}</p>
                          <p>{formData.address}</p>
                          <p>{formData.city}, {formData.state} {formData.zipCode}</p>
                          <p>{formData.email}</p>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">Payment & Shipping</h3>
                        <div className="text-sm text-muted-foreground">
                          <p className="font-medium text-primary">
                            {formData.shippingMethod === 'Cash on Delivery' ? 'Cash on Delivery' : 'Razorpay (Online)'}
                          </p>
                          <p>Total: ${total.toFixed(2)}</p>
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
                      ? 'bg-gradient-to-r from-success to-accent text-success-foreground shadow-playful hover:shadow-glow'
                      : 'bg-primary text-primary-foreground hover:bg-primary-glow'
                  } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                  whileHover={!isProcessing ? { scale: 1.02 } : {}}
                  whileTap={!isProcessing ? { scale: 0.98 } : {}}
                >
                  {isProcessing ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Processing...</span>
                    </div>
                  ) : currentStep === 3 ? (
                    'Place Order 🚀'
                  ) : (
                    'Continue'
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
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span>
                  <span>{shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Tax (8%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-border pt-4">
                  <div className="flex justify-between text-xl font-bold">
                    <span>Total</span>
                    <span className="text-primary">${total.toFixed(2)}</span>
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
