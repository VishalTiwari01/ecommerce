import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CreditCard, User, MapPin, Package, ArrowLeft, Lock, CheckCircle } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { toast } from '../hooks/use-toast';

// --- NEW HELPER FUNCTION TO LOAD RAZORPAY SCRIPT ---
const loadRazorpayScript = (src) => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
};
// ----------------------------------------------------

// IMPORTANT: Replace with your actual Razorpay Key ID
const RAZORPAY_KEY_ID = "YOUR_RAZORPAY_KEY_ID"; 
// Example: "rzp_test_XXXXXXXXXX" for testing

const Checkout = () => {
  const { state, clearCart } = useCart();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  const [formData, setFormData] = useState({
    // Shipping Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    
    // Payment Information (Mock data for display, actual card processing is via Razorpay)
    cardNumber: '4111111111111111', // Mock for review step
    expiryDate: '12/25', // Mock for review step
    cvv: '123', // Mock for review step
    cardName: 'John Doe', // Mock for review step
    
    // Shipping Method
    shippingMethod: 'standard'
  });

  // ... (Steps and shippingMethods constants remain the same)
  const steps = [
    { id: 1, name: 'Shipping', icon: MapPin },
    { id: 2, name: 'Payment', icon: CreditCard },
    { id: 3, name: 'Review', icon: Package }
  ];

  const shippingMethods = [
    { id: 'Cash on Delivery', name: 'Cash on Delivery' },
    { id: 'Online', name: 'Online Shipping'},
    
  ];

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const subtotal = state.total;
  const shippingCost = shippingMethods.find(method => method.id === formData.shippingMethod)?.price || 0;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shippingCost + tax;
  
  // Razorpay requires the amount in the smallest currency unit (e.g., paise for INR). 
  // We'll assume the currency is INR for this example.
  const amountInPaise = Math.round(total * 100); 

  // --- NEW RAZORPAY INTEGRATION FUNCTION ---
  const displayRazorpay = async () => {
    const res = await loadRazorpayScript('https://checkout.razorpay.com/v1/checkout.js');

    if (!res) {
      toast({
        title: "Payment Gateway Error",
        description: "Razorpay SDK failed to load. Are you connected to the internet?",
        variant: "destructive"
      });
      return;
    }

    // --- CRITICAL: MOCK BACKEND CALL FOR ORDER CREATION ---
    // IN A REAL APPLICATION, YOU MUST CALL YOUR BACKEND API HERE 
    // TO CREATE A RAZORPAY ORDER OBJECT SECURELY AND GET THE 'order_id'
    // THE 'amount', 'currency' MUST BE CALCULATED ON THE BACKEND.
    
    // Simulating a backend API call to create an order
    const data = {
        order_id: `rzp_order_${Math.floor(Math.random() * 1000000)}`, // Replace with actual backend Order ID
        currency: 'INR', // Replace with your actual currency
        amount: amountInPaise, // Replace with actual backend amount in paise
    }; 

    if (!data.order_id) {
        toast({
            title: "Order Error",
            description: "Failed to create order on the server.",
            variant: "destructive"
        });
        setIsProcessing(false);
        return;
    }
    // --- END MOCK BACKEND CALL ---

    const options = {
        key: RAZORPAY_KEY_ID, 
        amount: data.amount, 
        currency: data.currency,
        name: "My Awesome Store",
        description: "Payment for Order",
        order_id: data.order_id, 
        handler: function (response) {
            // This handler is called on successful payment
            
            // CRITICAL: Call your backend API again to verify the payment signature
            // using response.razorpay_payment_id and response.razorpay_order_id 
            // and response.razorpay_signature for maximum security.
            
            const mockOrderId = `ORDER-${Math.floor(Math.random() * 1000000000)}`;
            
            toast({
                title: "Order placed successfully! 🎉",
                description: `Payment ID: ${response.razorpay_payment_id}. Your order ID is ${mockOrderId}.`,
            });
            
            clearCart();
            navigate(`/order/${mockOrderId}`);
            setIsProcessing(false);
        },
        prefill: {
            name: `${formData.firstName} ${formData.lastName}`,
            email: formData.email,
            contact: formData.phone
        },
        theme: {
            "color": "#FFC0CB" // A playful theme color
        }
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.on('payment.failed', function (response) {
        toast({
            title: "Payment Failed",
            description: `Error: ${response.error.code} - ${response.error.description}`,
            variant: "destructive"
        });
        setIsProcessing(false);
    });
    paymentObject.open();
  };
  // ----------------------------------------------------


  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation (You should add comprehensive form validation here)
    if (currentStep === 1) {
        // Simple check for required fields in step 1
        if (!formData.firstName || !formData.address || !formData.email) {
            toast({ title: "Validation Error", description: "Please fill all required shipping fields.", variant: "destructive" });
            return;
        }
        setCurrentStep(currentStep + 1);
        return;
    }
    
    if (currentStep === 2) {
        // In a real application, you would validate payment info here, 
        // but since we're using Razorpay to handle actual card details, 
        // we'll just move to the review step.
        setCurrentStep(currentStep + 1);
        return;
    }

    // Current Step is 3 (Review/Place Order)
    setIsProcessing(true);
    
    // 1. Call the Razorpay function instead of the mock API call
    await displayRazorpay();
    
    // Note: setIsProcessing(false) is now handled inside displayRazorpay's handler/failure.
    // The code execution stops here as Razorpay modal opens.
  };

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
      
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <div className="text-6xl mb-6">🛒</div>
          <h2 className="text-3xl font-bold text-foreground font-kids mb-4">
            Your cart is empty
          </h2>
          <p className="text-muted-foreground mb-8">
            Add some amazing products before checkout!
          </p>
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

  // --- COMPONENT RENDER (REMAINS LARGELY THE SAME) ---
  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back button */}
        <motion.button
          className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors mb-8"
          onClick={() => navigate(-1)}
          whileHover={{ x: -5 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowLeft size={20} />
          <span>Back to cart</span>
        </motion.button>

        {/* Header */}
        <div className="text-center mb-12">
          <motion.h1 
            className="text-4xl font-bold font-kids gradient-text mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Secure Checkout 🔒
          </motion.h1>
          <p className="text-muted-foreground">
            Complete your order safely and securely
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center space-x-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.id}
                className="flex items-center space-x-3"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                  currentStep >= step.id 
                    ? 'bg-gradient-to-r from-primary to-secondary text-white' 
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {currentStep > step.id ? (
                    <CheckCircle size={20} />
                  ) : (
                    <step.icon size={20} />
                  )}
                </div>
                <span className={`font-medium ${
                  currentStep >= step.id ? 'text-primary' : 'text-muted-foreground'
                }`}>
                  {step.name}
                </span>
                {index < steps.length - 1 && (
                  <div className={`w-12 h-0.5 mx-4 ${
                    currentStep > step.id ? 'bg-primary' : 'bg-muted'
                  }`} />
                )}
              </motion.div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <motion.form 
              onSubmit={handleSubmit}
              className="space-y-8"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Step 1: Shipping Information */}
              {currentStep === 1 && (
                <motion.div
                  className="bg-card rounded-3xl p-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex items-center space-x-3 mb-6">
                    <User className="text-primary" />
                    <h2 className="text-2xl font-bold text-foreground font-kids">
                      Shipping Information
                    </h2>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        required
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        required
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Street Address *
                      </label>
                      <input
                        type="text"
                        name="address"
                        required
                        value={formData.address}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        required
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        State *
                      </label>
                      <input
                        type="text"
                        name="state"
                        required
                        value={formData.state}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        ZIP Code *
                      </label>
                      <input
                        type="text"
                        name="zipCode"
                        required
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
              
              {/* Step 2: Payment Information & Shipping Method Selection (NEW/MODIFIED) */}
              {currentStep === 2 && (
                <motion.div
                    className="bg-card rounded-3xl p-8 space-y-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    {/* Payment Section - Simplified for Razorpay, as card inputs are in the modal */}
                    <div className="flex items-center space-x-3 mb-6">
                        <CreditCard className="text-primary" />
                        <h2 className="text-2xl font-bold text-foreground font-kids">
                            Payment Method
                        </h2>
                    </div>
                    <div className="p-4 border-2 border-dashed border-primary/50 bg-primary/10 rounded-xl text-center">
                        <p className="font-semibold text-primary">
                            Payment will be securely processed by Razorpay.
                        </p>
                        <p className="text-sm text-muted-foreground">
                            You will enter card details in a pop-up window after clicking 'Continue'.
                        </p>
                    </div>

                    {/* Shipping Method Section */}
                    <div className="flex items-center space-x-3 mb-6 pt-4 border-t border-border">
                        <Package className="text-primary" />
                        <h2 className="text-2xl font-bold text-foreground font-kids">
                            Shipping Method
                        </h2>
                    </div>
                    <div className="space-y-4">
                        {shippingMethods.map((method) => (
                            <label
                                key={method.id}
                                className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-all ${
                                    formData.shippingMethod === method.id ? 'border-primary ring-2 ring-primary/50 bg-primary/5' : 'border-border bg-background hover:bg-muted/50'
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
              
              {/* Step 3: Review */}
              {currentStep === 3 && (
                <motion.div
                  className="bg-card rounded-3xl p-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex items-center space-x-3 mb-6">
                    <Package className="text-primary" />
                    <h2 className="text-2xl font-bold text-foreground font-kids">
                      Review Your Order
                    </h2>
                  </div>

                  <div className="space-y-6">
                    {/* Order Items */}
                    <div>
                      <h3 className="font-semibold text-foreground mb-4">Order Items</h3>
                      <div className="space-y-3">
                        {state.items.map((item) => (
                          // NOTE: The total displayed here in the original code for each item was incorrect. 
                          // It was showing the order's grand total. Corrected to show item total.
                          <div key={`${item.id}-${item.selectedColor}`} className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
                            <div className="flex items-center space-x-4">
                              <div className="text-3xl">{item.emoji}</div>
                              <div>
                                <div className="font-medium text-foreground">{item.name}</div>
                                <div className="text-sm text-muted-foreground">
                                  Qty: {item.quantity}
                                </div>
                              </div>
                            </div>
                            <div className="font-semibold text-primary">
                              ${(item.price * item.quantity).toFixed(2)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Shipping & Payment Summary */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-semibold text-foreground mb-2">Shipping Address</h3>
                        <div className="text-sm text-muted-foreground">
                          <p>{formData.firstName} {formData.lastName}</p>
                          <p>{formData.address}</p>
                          <p>{formData.city}, {formData.state} {formData.zipCode}</p>
                          <p>{formData.email}</p>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-2">Payment Method</h3>
                        <div className="text-sm text-muted-foreground">
                          <p className="font-medium text-primary">Razorpay (Online Payment)</p>
                          <p>Total amount: ${total.toFixed(2)}</p>
                        </div>
                        <h3 className="font-semibold text-foreground mt-4 mb-2">Shipping Method</h3>
                        <div className="text-sm text-muted-foreground">
                            <p>{shippingMethods.find(m => m.id === formData.shippingMethod)?.name}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between">
                {currentStep > 1 && (
                  <motion.button
                    type="button"
                    className="px-8 py-3 border border-border rounded-xl text-foreground hover:bg-muted transition-colors"
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
                  ) : (
                    currentStep === 3 ? 'Place Order 🚀' : 'Continue'
                  )}
                </motion.button>
              </div>
            </motion.form>
          </div>

          {/* Order Summary (REMAINS THE SAME) */}
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-card rounded-3xl p-8 sticky top-8">
              <h3 className="text-2xl font-bold text-foreground font-kids mb-6">
                Order Summary
              </h3>

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
                  <div className="flex justify-between text-xl font-bold text-foreground">
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