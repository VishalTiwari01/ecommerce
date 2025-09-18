import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Search, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hoveredMenu, setHoveredMenu] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { getItemCount, toggleCart } = useCart();

  const menuItems = [
    { 
      name: 'Products', 
      subCategories: [
        { name: 'Ages 0-3', path: '/products/0-3' },
        { name: 'Ages 4-7', path: '/products/4-7' },
        { name: 'Ages 8-12', path: '/products/8-12' },
        { name: 'Best Sellers', path: '/products/bestsellers' }
      ]
    },
    { name: 'Toys', path: '/toys' },
    { name: 'Water Bottles', path: '/bottles' },
    { name: 'Backpacks', path: '/backpacks' },
  ];

  return (
    <motion.nav 
      className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border shadow-card"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Animated Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <motion.div 
              className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center"
              animate={{ 
                rotate: [0, 5, -5, 0],
                scale: [1, 1.05, 1]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <span className="text-white font-bold text-xl">🎈</span>
            </motion.div>
            <motion.span 
              className="text-2xl font-bold gradient-text font-kids"
              animate={{ 
                backgroundPosition: ["0%", "100%", "0%"]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              KidsWorld
            </motion.span>
          </Link>

          {/* Desktop Navigation */}
          <div className=" md:flex items-center space-x-8 ">
            {menuItems.map((item) => (
              <div
                key={item.name}
                className="relative"
                onMouseEnter={() => setHoveredMenu(item.name)}
                onMouseLeave={() => setHoveredMenu(null)}
              >
                <Link
                  to={item.path || '#'}
                  className="text-foreground hover:text-primary font-semibold transition-colors duration-200 py-2"
                >
                  {item.name}
                </Link>

                {/* Mega Menu */}
                {item.subCategories && (
                  <AnimatePresence>
                    {hoveredMenu === item.name && (
                      <motion.div
                        className="absolute top-full transform -translate-x-1/2 w-screen  max-w-3xl bg-card shadow-playful rounded-b-3xl border border-border mt-5"
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="grid grid-cols-2 gap-8 p-8">
                          {/* Links Column */}
                          <div>
                            <h3 className="text-lg font-bold text-primary mb-4">Shop by Age</h3>
                            <div className="space-y-3">
                              {item.subCategories.map((subItem) => (
                                <Link
                                  key={subItem.name}
                                  to={subItem.path}
                                  className="block text-foreground hover:text-secondary transition-colors duration-200 font-medium"
                                >
                                  {subItem.name}
                                </Link>
                              ))}
                            </div>
                          </div>

                          {/* Image Spotlight */}
                          <motion.div 
                            className="flex items-center justify-center"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1 }}
                          >
                            <div className="w-48 h-32 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl flex items-center justify-center">
                              <span className="text-6xl">🧸</span>
                            </div>
                          </motion.div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            ))}
          </div>

          {/* Search, Cart, and Mobile Menu Icons */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Search */}
            <AnimatePresence mode="wait">
              {isSearchOpen ? (
                <motion.div
                  key="search-input"
                  className="relative flex items-center"
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 200, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-full h-10 px-4 pr-10 text-sm bg-card border border-border rounded-full outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                  <motion.button
                    className="absolute right-2 p-2 text-foreground hover:text-primary transition-colors duration-200"
                    onClick={() => setIsSearchOpen(false)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <X size={20} />
                  </motion.button>
                </motion.div>
              ) : (
                <motion.button
                  key="search-button"
                  className="p-2 text-foreground hover:text-primary transition-colors duration-200"
                  onClick={() => setIsSearchOpen(true)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Search size={24} />
                </motion.button>
              )}
            </AnimatePresence>

            {/* Cart */}
            <motion.div
              className="relative"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <button
                className="p-2 text-foreground hover:text-primary transition-colors duration-200"
                onClick={toggleCart}
                aria-label="Toggle shopping cart"
              >
                <ShoppingCart size={24} />
              </button>
              {getItemCount() > 0 && (
                <motion.span
                  className="absolute -top-1 -right-1 w-5 h-5 bg-secondary text-secondary-foreground text-xs font-bold rounded-full flex items-center justify-center"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30, mass: 1 }}
                >
                  {getItemCount()}
                </motion.span>
              )}
            </motion.div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-foreground hover:text-primary transition-colors duration-200"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              className="md:hidden py-4 border-t border-border"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="space-y-3">
                {menuItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path || '#'}
                    className="block py-2 text-foreground hover:text-primary font-semibold transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;