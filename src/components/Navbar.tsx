import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Search, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);
  const [cartCount, setCartCount] = useState(3);

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
          <div className="hidden md:flex items-center space-x-8">
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
                        className="absolute top-full left-1/2 transform -translate-x-1/2 w-screen max-w-4xl bg-card shadow-playful rounded-b-3xl border border-border mt-2"
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

          {/* Search and Cart Icons */}
          <div className="flex items-center space-x-4">
            <motion.button
              className="p-2 text-foreground hover:text-primary transition-colors duration-200"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Search size={24} />
            </motion.button>

            <motion.div 
              className="relative"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <button className="p-2 text-foreground hover:text-primary transition-colors duration-200">
                <ShoppingCart size={24} />
              </button>
              {cartCount > 0 && (
                <motion.span
                  className="absolute -top-1 -right-1 w-5 h-5 bg-secondary text-secondary-foreground text-xs font-bold rounded-full flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                  {cartCount}
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