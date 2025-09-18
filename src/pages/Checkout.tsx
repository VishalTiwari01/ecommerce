import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CreditCard, User, MapPin, Package, ArrowLeft, Lock, CheckCircle } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { toast } from '../hooks/use-toast';
import Navbar from '../components/Navbar';

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
    
    // Payment Information
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
    
    // Shipping Method
    shippingMethod: 'standard'
  });

  const steps = [
    { id: 1, name: 'Shipping', icon: MapPin },
    { id: 2, name: 'Payment', icon: CreditCard },
    { id: 3, name: 'Review', icon: Package }
  ];

  const shippingMethods = [
    { id: 'standard', name: 'Standard Shipping', time: '5-7 business days', price: 0 },
    { id: 'express', name: 'Express Shipping', time: '2-3 business days', price: 9.99 },
    { id: 'overnight', name: 'Overnight Shipping', time: '1 business day', price: 19.99 }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
      return;
    }

    // Process order
    setIsProcessing(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast({
      title: "Order placed successfully! 🎉",
      description: "Thank you for your purchase. You'll receive a confirmation email shortly.",
    });
    
    clearCart();
    navigate('/');
    setIsProcessing(false);
  };

  const subtotal = state.total;
  const shippingCost = shippingMethods.find(method => method.id === formData.shippingMethod)?.price || 0;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shippingCost + tax;

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
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

              {/* Step 2: Payment Information */}
              {currentStep === 2 && (
                <motion.div
                  className="bg-card rounded-3xl p-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex items-center space-x-3 mb-6">
                    <CreditCard className="text-primary" />
                    <h2 className="text-2xl font-bold text-foreground font-kids">
                      Payment Information
                    </h2>
                    <Lock size={20} className="text-success" />
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Card Number *
                      </label>
                      <input
                        type="text"
                        name="cardNumber"
                        required
                        placeholder="1234 5678 9012 3456"
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Expiry Date *
                        </label>
                        <input
                          type="text"
                          name="expiryDate"
                          required
                          placeholder="MM/YY"
                          value={formData.expiryDate}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          CVV *
                        </label>
                        <input
                          type="text"
                          name="cvv"
                          required
                          placeholder="123"
                          value={formData.cvv}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Name on Card *
                      </label>
                      <input
                        type="text"
                        name="cardName"
                        required
                        value={formData.cardName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                      />
                    </div>
                  </div>

                  {/* Shipping Method */}
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold text-foreground mb-4">
                      Shipping Method
                    </h3>
                    <div className="space-y-3">
                      {shippingMethods.map((method) => (
                        <label key={method.id} className="flex items-center justify-between p-4 border border-border rounded-xl cursor-pointer hover:border-primary transition-colors">
                          <div className="flex items-center space-x-3">
                            <input
                              type="radio"
                              name="shippingMethod"
                              value={method.id}
                              checked={formData.shippingMethod === method.id}
                              onChange={handleInputChange}
                              className="text-primary"
                            />
                            <div>
                              <div className="font-medium text-foreground">{method.name}</div>
                              <div className="text-sm text-muted-foreground">{method.time}</div>
                            </div>
                          </div>
                          <div className="font-semibold text-primary">
                            {method.price === 0 ? 'FREE' : `$${method.price}`}
                          </div>
                        </label>
                      ))}
                    </div>
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
                          <p>Card ending in {formData.cardNumber.slice(-4)}</p>
                          <p>{formData.cardName}</p>
                          <p>Expires {formData.expiryDate}</p>
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

          {/* Order Summary */}
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
                  <span>Tax</span>
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