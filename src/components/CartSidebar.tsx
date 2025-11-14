import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, ShoppingBag, CreditCard } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser } from '../redux/slices/authSlice';
import { useState } from 'react';
import SignInModal from './SignInModal';

const CartSidebar = () => {
  const { state, removeItem, updateQuantity, closeCart } = useCart();
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const [isSignInModalOpen, setSignInModalOpen] = useState(false);

  const handleCheckout = () => {
    closeCart();
    if (!user) {
      setSignInModalOpen(true);
    } else {
      navigate('/checkout');
    }
  };

  // Subtotal uses salePrice when available and lower than price
  const calculateSubtotal = () => {
    return state.items.reduce((acc, item) => {
      const unit = typeof item.salePrice === 'number' && item.salePrice < item.price ? item.salePrice : item.price;
      return acc + unit * item.quantity;
    }, 0);
  };

  const sidebarVariants = {
    hidden: { x: '100%' },
    visible: { x: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } },
    exit: { x: '100%', transition: { type: 'spring', stiffness: 300, damping: 30 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: (i) => ({ opacity: 1, x: 0, transition: { delay: i * 0.05, duration: 0.3 } }),
    exit: { opacity: 0, x: 20 },
  };

  const getItemImage = (item) => {
    if (item.image && typeof item.image === 'string' && item.image.trim()) return item.image;
    if (item.imageUrl && typeof item.imageUrl === 'string' && item.imageUrl.trim()) return item.imageUrl;
    if (item.images && Array.isArray(item.images) && item.images.length) return item.images[0];
    return 'https://via.placeholder.com/150?text=No+Image';
  };

  const getUnitPrice = (item) => {
    return typeof item.salePrice === 'number' && item.salePrice < item.price ? item.salePrice : item.price;
  };

  const getLineSavings = (item) => {
    if (typeof item.salePrice === 'number' && item.salePrice < item.price) {
      return (item.price - item.salePrice) * item.quantity;
    }
    return 0;
  };

  const totalSavings = state.items.reduce((s, it) => s + getLineSavings(it), 0);

  return (
    <>
      <AnimatePresence>
        {state.isOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeCart}
            />

            <motion.div
              className="fixed top-0 right-0 h-full w-full sm:max-w-md bg-card shadow-2xl z-[100] flex flex-col"
              variants={sidebarVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="flex items-center justify-between p-6 border-b border-border">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
                    <ShoppingBag size={20} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-foreground font-kids">Shopping Cart</h2>
                    <p className="text-sm text-muted-foreground">
                      {state.items.length} item{state.items.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>

                <motion.button
                  className="p-2 hover:bg-muted rounded-full transition-colors"
                  onClick={closeCart}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X size={24} className="text-muted-foreground" />
                </motion.button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                {state.items.length === 0 ? (
                  <motion.div
                    className="flex flex-col items-center justify-center h-full text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="text-6xl mb-4">🛒</div>
                    <h3 className="text-lg font-semibold text-foreground mb-2 font-kids">Your cart is empty</h3>
                    <p className="text-muted-foreground mb-4">Add some amazing products to get started!</p>
                    <motion.button className="btn-fun" onClick={closeCart} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      Continue Shopping ✨
                    </motion.button>
                  </motion.div>
                ) : (
                  <motion.div layout className="space-y-4">
                    <AnimatePresence>
                      {state.items.map((item, index) => {
                        const img = getItemImage(item);
                        const unit = getUnitPrice(item);
                        const hasSale = typeof item.salePrice === 'number' && item.salePrice < item.price;
                        const lineTotal = unit * item.quantity;
                        const savings = getLineSavings(item);

                        return (
                          <motion.div
                            key={`${item.id}-${item.variantId ?? item.selectedColor ?? index}`}
                            className="bg-muted/30 rounded-2xl p-4 flex items-center space-x-4"
                            variants={itemVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            custom={index}
                            whileHover={{ scale: 1.02 }}
                          >
                            {/* Image */}
                            <div className="w-16 h-16 rounded-xl overflow-hidden bg-white flex items-center justify-center border">
                              <img src={img} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
                            </div>

                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-foreground truncate font-kids">{item.name}</h4>

                              <div className="flex items-center space-x-2 mt-1">
                                {item.selectedColorHex || item.selectedColor ? (
                                  <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full border" style={{ backgroundColor: item.selectedColorHex ?? item.selectedColor }} />
                                  </div>
                                ) : null}
                                <span className="text-xs text-muted-foreground">{item.category}</span>
                              </div>

                              <div className="mt-2 flex items-baseline gap-3">
                                {hasSale ? (
                                  <>
                                    <span className="text-sm font-bold text-primary">₹{unit.toFixed(2)}</span>
                                    <span className="text-xs text-muted-foreground line-through">₹{item.price.toFixed(2)}</span>
                                    {/* <span className="text-xs text-success">Save ₹{(item.price - item.salePrice).toFixed(2)}</span> */}
                                  </>
                                ) : (
                                  <p className="text-sm font-bold text-primary">₹{unit.toFixed(2)}</p>
                                )}
                              </div>

                              {/* per-line total (optional) */}
                              {/* <div className="text-xs text-muted-foreground mt-1">
                                Line total: ₹{lineTotal.toFixed(2)}
                                {savings > 0 && <span className="ml-2 text-xs text-green-600">You saved ₹{savings.toFixed(2)}</span>}
                              </div> */}
                            </div>

                            <div className="flex items-center space-x-2">
                              <motion.button
                                className="w-8 h-8 bg-muted hover:bg-muted/80 rounded-full flex items-center justify-center"
                                onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <Minus size={12} />
                              </motion.button>

                              <span className="w-8 text-center font-semibold">{item.quantity}</span>

                              <motion.button
                                className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center hover:bg-primary-glow"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <Plus size={12} />
                              </motion.button>
                            </div>

                            <motion.button
                              className="text-destructive hover:text-destructive/80 p-1"
                              onClick={() => removeItem({ id: item.id, variantId: item.variantId, selectedColor: item.selectedColor })}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <X size={16} />
                            </motion.button>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </motion.div>
                )}
              </div>

              {state.items.length > 0 && (
                <div className="border-t border-border p-6 space-y-4">
                  <div className="flex justify-between items-center text-sm text-muted-foreground">
                    <span>Subtotal:</span>
                    <span>₹{calculateSubtotal().toFixed(2)}</span>
                  </div>

                  {totalSavings > 0 && (
                    <div className="flex justify-between items-center text-sm text-green-600">
                      <span>Total savings:</span>
                      <span>₹{totalSavings.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-foreground">Total:</span>
                    <span className="text-2xl font-bold text-primary">₹{state.total.toFixed(2)}</span>
                  </div>

                  <motion.button
                    className="w-full bg-gradient-to-r from-success to-accent text-success-foreground py-4 rounded-2xl font-bold text-lg flex items-center justify-center space-x-3 shadow-playful hover:shadow-glow disabled:from-gray-400 disabled:to-gray-500 disabled:shadow-none disabled:cursor-not-allowed"
                    onClick={handleCheckout}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <CreditCard size={24} />
                    <span>Checkout</span>
                    <span className="text-xl">🚀</span>
                  </motion.button>

                  <p className="text-xs text-center text-muted-foreground">Secure checkout • Free shipping on orders over $50</p>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <SignInModal
        isOpen={isSignInModalOpen}
        onClose={() => setSignInModalOpen(false)}
        onSignIn={(user) => {
          setSignInModalOpen(false);
          navigate('/checkout');
        }}
      />
    </>
  );
};

export default CartSidebar;
