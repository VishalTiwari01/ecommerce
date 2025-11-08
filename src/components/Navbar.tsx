import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  Search,
  Menu,
  X,
  User,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signOut, signIn, selectUser } from "../redux/slices/authSlice";
import { useCart } from "../contexts/CartContext";
import Logo from "../assest/logoA.png";
import UserDropdown from "./UserDropdown";
import SignInModal from "./SignInModal";

// ✅ Utility function to lowercase the first letter
const toLowerFirst = (str) =>
  str ? str.charAt(0).toLowerCase() + str.slice(1) : "";

// ✅ Recursive dropdown component
const DropdownItem = ({ item }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link
        to={item.path || "#"}
        className="block text-foreground hover:text-secondary font-medium py-1 transition-colors duration-200 flex justify-between items-center"
      >
        {toLowerFirst(item.name)}
        {item.children && <ChevronRight size={16} className="ml-2" />}
      </Link>

      {item.children && (
        <AnimatePresence>
          {hovered && (
            <motion.div
              className="absolute left-full top-0 ml-2 bg-card border border-border rounded-xl shadow-lg p-4 min-w-[180px] z-50"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              {item.children.map((child) => (
                <DropdownItem key={`${item.name}-${child.name}`} item={child} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
};

const Navbar = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const { getItemCount, toggleCart } = useCart();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hoveredMenu, setHoveredMenu] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mobileOpenMenu, setMobileOpenMenu] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // ✅ Menu items data
  const menuItems = [
    {
      name: "Products",
      subCategories: [
        {
          name: "Decor",
          path: "/category/decor",
          children: [
            { name: "Candles", path: "/category/candles" },
            { name: "Ceramics", path: "/category/ceramics" },
            { name: "Fridge Magnets", path: "/category/fridge" },
            { name: "Kids Chair", path: "/category/kid" },
            { name: "Organisers", path: "/category/organisers" },
          ],
        },
        {
          name: "Electronics",
          path: "/category/electronics",
          children: [
            { name: "Learning Toys", path: "/category/learning" },
            { name: "Outdoor Toys", path: "/category/outdoor" },
          ],
        },
        {
          name: "Essentials",
          path: "/category/essentials",
          children: [
            { name: "Swimming", path: "/category/swimming" },
            { name: "Soaps", path: "/category/soaps" },
            { name: "Wallets", path: "/category/wallets" },
            { name: "Mugs", path: "/category/mugs" },
            { name: "Tooth Brushes", path: "/category/toothbrushes" },
          ],
        },
        {
          name: "Festive Gifting",
          path: "/category/festive",
          children: [
            { name: "Ceramics", path: "/category/ceramics" },
            { name: "Christmas Collection", path: "/category/christmas" },
            { name: "Paper Bags", path: "/category/paperbags" },
            { name: "Valentine’s Day", path: "/category/valentine" },
          ],
        },
        {
          name: "Stationery",
          path: "/category/stationery",
          children: [
            { name: "Boards", path: "/category/boards" },
            { name: "Bookmarks", path: "/category/bookmarks" },
            { name: "Calculators", path: "/category/calculators" },
            { name: "Erasers", path: "/category/erasers" },
            { name: "Pencils", path: "/category/pencils" },
            { name: "Pens", path: "/category/pens" },
            { name: "Pouches", path: "/category/pouches" },
          ],
        },
      ],
    },
    {
      name: "Toys & Games",
      subCategories: [
        { name: "Balls", path: "/category/balls" },
        { name: "Cards", path: "/category/cards" },
        { name: "Educational", path: "/category/educational" },
        { name: "Games", path: "/category/game" },
        { name: "Toys", path: "/category/toy" },
      ],
    },
    {
      name: "Water Bottles",
      subCategories: [
        { name: "Bottles", path: "/category/bottle" },
        { name: "Mugs", path: "/category/mug" },
        { name: "Sippers", path: "/category/sipper" },
        { name: "Tumblers", path: "/category/tumbler" },
      ],
    },
    {
      name: "Bags & Pouches",
      subCategories: [
        { name: "Bags", path: "/category/bag" },
        { name: "Pouches", path: "/category/pouche" },
        { name: "Duffle Bags", path: "/category/duffle" },
        { name: "Luggage", path: "/category/luggage" },
        { name: "Sling Bags", path: "/category/sling" },
      ],
    },
  ];

  // ✅ Filter menu based on category search
  const filteredMenuItems = useMemo(() => {
    if (!searchTerm) return menuItems;

    const term = searchTerm.toLowerCase();

    const filterCategories = (items) =>
      items
        .map((item) => {
          const nameMatch = item.name.toLowerCase().includes(term);

          const subCategories =
            item.subCategories
              ?.map((sub) => {
                const subMatch = sub.name.toLowerCase().includes(term);

                const children =
                  sub.children?.filter((child) =>
                    child.name.toLowerCase().includes(term)
                  ) || [];

                if (subMatch || children.length > 0) {
                  return { ...sub, children };
                }
                return null;
              })
              .filter(Boolean) || [];

          if (nameMatch || subCategories.length > 0) {
            return { ...item, subCategories };
          }
          return null;
        })
        .filter(Boolean);

    return filterCategories(menuItems);
  }, [searchTerm]);

  const handleLogout = () => {
    dispatch(signOut());
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");
    if (user && token) dispatch(signIn({ user, token }));
  }, [dispatch]);

  return (
    <motion.nav
      className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border shadow-card"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ====== NAVBAR TOP ====== */}
        <div className="flex justify-between items-center h-16">
          {/* LOGO */}
          <Link to="/" className="flex items-center space-x-3">
            <motion.img
              src={Logo}
              alt="Logo"
              className="w-12 h-12 rounded-full object-cover"
              animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.05, 1] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </Link>

          {/* ===== DESKTOP MENU ===== */}
          <div className="hidden md:flex items-center space-x-8 max-w-3xl">
            {filteredMenuItems.map((item) => (
              <div
                key={item.name}
                className="relative"
                onMouseEnter={() => setHoveredMenu(item.name)}
                onMouseLeave={() => setHoveredMenu(null)}
              >
                <Link
                  to={item.path || "#"}
                  className="text-foreground hover:text-primary font-semibold transition-colors duration-200 py-4 flex items-center"
                >
                  {toLowerFirst(item.name)}
                  {item.subCategories && (
                    <ChevronDown size={16} className="ml-1" />
                  )}
                </Link>

                {/* ====== DROPDOWN ====== */}
                {item.subCategories && hoveredMenu === item.name && (
                  <AnimatePresence>
                    <motion.div
                      className="absolute top-full left-0 transform -translate-x-1/2 w-screen max-w-lg bg-card shadow-playful rounded-b-3xl border border-border mt-0 z-50"
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="grid grid-cols-2 gap-8 p-8">
                        <div className="space-y-3">
                          {item.subCategories.map((sub) => (
                            <DropdownItem
                              key={`${item.name}-${sub.name}`}
                              item={sub}
                            />
                          ))}
                        </div>
                        <div className="flex items-center justify-center">
                          <div className="w-48 h-32 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl flex items-center justify-center">
                            <span className="text-6xl">🧸</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                )}
              </div>
            ))}
          </div>

          {/* ====== RIGHT ICONS ====== */}
          <div className="flex items-center space-x-3">
            {/* SEARCH */}
            <AnimatePresence mode="wait">
              {isSearchOpen ? (
                <motion.div
                  key="search"
                  className="relative flex items-center"
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 200, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <input
                    type="text"
                    placeholder="Search category..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full h-10 px-4 pr-10 text-sm bg-card border border-border rounded-full outline-none focus:ring-2 focus:ring-primary"
                  />
                  <button
                    className="absolute right-2 text-foreground hover:text-primary"
                    onClick={() => {
                      setIsSearchOpen(false);
                      setSearchTerm("");
                    }}
                  >
                    <X size={18} />
                  </button>
                </motion.div>
              ) : (
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="p-2 text-foreground hover:text-primary"
                >
                  <Search size={24} />
                </button>
              )}
            </AnimatePresence>

            {/* CART */}
            <div className="relative">
              <button
                className="p-2 text-foreground hover:text-primary"
                onClick={toggleCart}
              >
                <ShoppingCart size={24} />
              </button>
              {getItemCount() > 0 && (
                <motion.span
                  className="absolute -top-1 -right-1 w-5 h-5 bg-secondary text-secondary-foreground text-xs font-bold rounded-full flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                >
                  {getItemCount()}
                </motion.span>
              )}
            </div>

            {/* USER */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="p-2 text-foreground hover:text-primary"
              >
                <User size={24} />
              </button>
              <UserDropdown
                isOpen={isDropdownOpen}
                onClose={() => setIsDropdownOpen(false)}
                isAuthenticated={!!user}
                onSignInClick={() => setIsModalOpen(true)}
                onLogout={handleLogout}
                user={user}
              />
            </div>

            {/* MOBILE MENU TOGGLE */}
            <button
              className="md:hidden p-2 text-foreground hover:text-primary"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* ====== MOBILE MENU ====== */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              className="md:hidden py-4 border-t border-border"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              {filteredMenuItems.map((item) => (
                <div key={item.name}>
                  <button
                    className="w-full flex justify-between items-center py-2 px-3 text-foreground hover:text-primary font-semibold"
                    onClick={() =>
                      setMobileOpenMenu(
                        mobileOpenMenu === item.name ? null : item.name
                      )
                    }
                  >
                    {toLowerFirst(item.name)}
                    {item.subCategories && <ChevronDown size={16} />}
                  </button>

                  {item.subCategories && mobileOpenMenu === item.name && (
                    <div className="pl-4">
                      {item.subCategories.map((sub) => (
                        <div key={`${item.name}-${sub.name}`}>
                          <Link
                            to={sub.path}
                            className="block py-1 text-foreground hover:text-secondary"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            {toLowerFirst(sub.name)}
                          </Link>

                          {sub.children && (
                            <div className="pl-4">
                              {sub.children.map((child) => (
                                <Link
                                  key={`${sub.name}-${child.name}`}
                                  to={child.path}
                                  className="block py-1 text-foreground hover:text-secondary"
                                  onClick={() => setIsMenuOpen(false)}
                                >
                                  {toLowerFirst(child.name)}
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <SignInModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSignIn={() => {}}
      />
    </motion.nav>
  );
};

export default Navbar;
