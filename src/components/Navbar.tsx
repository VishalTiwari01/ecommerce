import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Search, Menu, X, User } from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signOut, signIn, selectUser } from "../redux/slices/authSlice";
import { useCart } from "../contexts/CartContext";
import Logo from "../assest/logoA.png";
import UserDropdown from "./UserDropdown";
import SignInModal from "./SignInModal";

const Navbar = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const { getItemCount, toggleCart } = useCart();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hoveredMenu, setHoveredMenu] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const menuItems = [
    {
      name: "Products",
      subCategories: [
        { name: "Ages 0-3", path: "/category/0-3" },
        { name: "Ages 4-7", path: "/category/4-7" },
        { name: "Ages 8-12", path: "/category/8-12" },
        { name: "Best Sellers", path: "/category/bestsellers" },
      ],
    },
    { name: "Toys", path: "/category/toys" },
    { name: "Water Bottles", path: "/category/bottle" },
    { name: "Backpacks", path: "/category/backpacks" },
  ];

  const handleLogout = () => {
    dispatch(signOut());
  };

  const handleSignIn = (userData) => {
    // Login is handled in redux via loginUser
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    if (user && token) {
      dispatch(signIn({ user, token }));
    }
  }, [dispatch]);

  return (
    <motion.nav
      className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border shadow-card"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <motion.img
              src={Logo}
              alt="Logo"
              className="w-12 h-12 rounded-full object-cover"
              animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8 max-w-3xl">
            {menuItems.map((item) => (
              <div
                key={item.name}
                className="relative"
                onMouseEnter={() => setHoveredMenu(item.name)}
                onMouseLeave={() => setHoveredMenu(null)}
              >
                <Link
                  to={item.path || "#"}
                  className="text-foreground hover:text-primary font-semibold transition-colors duration-200 py-2"
                >
                  {item.name}
                </Link>

                {/* Mega Menu */}
                {item.subCategories && (
                  <AnimatePresence>
                    {hoveredMenu === item.name && (
                      <motion.div
                        className="absolute top-full left-1/3 transform -translate-x-1/2 w-screen max-w-2xl bg-card shadow-playful rounded-b-3xl border border-border mt-4"
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="grid grid-cols-2 gap-8 p-8">
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

                          {/* Emoji Image */}
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

          {/* Right Icons */}
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
            <motion.div className="relative" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <button
                className="p-2 text-foreground hover:text-primary transition-colors duration-200"
                onClick={toggleCart}
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

            {/* User Icon + Dropdown */}
            <motion.div className="relative" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="p-2 text-foreground hover:text-primary transition-colors duration-200"
              >
                <User size={24} />
              </button>

              <UserDropdown
                isOpen={isDropdownOpen}
                onClose={() => setIsDropdownOpen(false)}
                isAuthenticated={!!user}
                onSignInClick={() => setIsModalOpen(true)}
                onLogout={handleLogout}
              />
            </motion.div>

            {/* Mobile Menu */}
            <button
              className="md:hidden p-2 text-foreground hover:text-primary transition-colors duration-200"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
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
                    to={item.path || "#"}
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

      {/* Sign In Modal */}
      <SignInModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSignIn={handleSignIn}
      />
    </motion.nav>
  );
};

export default Navbar;
