// Navbar.jsx
import React, { useState, useEffect, useMemo, useRef } from "react";
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
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signOut, signIn, selectUser } from "../redux/slices/authSlice";
import { useCart } from "../contexts/CartContext";
import Logo from "../assest/logoA.png";
import UserDropdown from "./UserDropdown";
import SignInModal from "./SignInModal";
import { getAllProducts } from "../APi/api"; // make sure this exists and returns product array

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
        {item.name}
        {item.children && <ChevronRight size={16} className="ml-2" />}
      </Link>

      {item.children && hovered && (
        <AnimatePresence>
          <motion.div
            className="absolute left-full top-0 ml-2 bg-card border border-border rounded-xl shadow-lg p-4 min-w-[180px] z-50"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.15 }}
          >
            {item.children.map((child) => (
              <DropdownItem key={`${item.name}-${child.name}`} item={child} />
            ))}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
};

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const { getItemCount, toggleCart } = useCart();

  // UI states
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hoveredMenu, setHoveredMenu] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mobileOpenMenu, setMobileOpenMenu] = useState(null);

  // Search states
  const [searchTerm, setSearchTerm] = useState("");
  const [allProducts, setAllProducts] = useState([]);
  const [results, setResults] = useState([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const searchRef = useRef(null);

  // Menu items (unchanged, WITHOUT lowercasing)
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

  // menu filtering (keeps original case)
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

  // fetch products once
  useEffect(() => {
    let mounted = true;
    const fetch = async () => {
      setIsLoadingProducts(true);
      try {
        const data = await getAllProducts();
        if (!mounted) return;
        // getAllProducts might return an object or array depending on API - normalize
        const arr = Array.isArray(data) ? data : data?.products ?? [];
        setAllProducts(arr);
      } catch (err) {
        console.error("Failed to load products in navbar:", err);
        setAllProducts([]);
      } finally {
        if (mounted) setIsLoadingProducts(false);
      }
    };
    fetch();
    return () => {
      mounted = false;
    };
  }, []);

  // debounce search to avoid heavy work on each keystroke
  useEffect(() => {
    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }

    const term = searchTerm.toLowerCase();
    const id = setTimeout(() => {
      const filtered = allProducts.filter((p) => {
        // normalize fields and check
        const name = (p.name || "").toString().toLowerCase();
        const cat = (p.categoryId || p.category || "").toString().toLowerCase();
        const short = (p.shortDescription || p.description || "").toString().toLowerCase();

        return (
          name.includes(term) ||
          cat.includes(term) ||
          short.includes(term)
        );
      });

      setResults(filtered);
    }, 200); // 200ms debounce

    return () => clearTimeout(id);
  }, [searchTerm, allProducts]);

  const handleLogout = () => {
    dispatch(signOut());
  };

  // restore auth from localStorage if present
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (storedUser && token) {
      try {
        const parsed = JSON.parse(storedUser);
        dispatch(signIn({ user: parsed, token }));
      } catch (e) {
        // ignore
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // click outside to close search dropdown
  useEffect(() => {
    const onDocClick = (e) => {
      if (!searchRef.current) return;
      if (!searchRef.current.contains(e.target)) {
        // keep input open if user toggled search manually? We'll close results only
        setResults([]);
      }
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

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

          {/* Desktop menu */}
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
                  {item.name}
                  {item.subCategories && <ChevronDown size={16} className="ml-1" />}
                </Link>

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
                            <DropdownItem key={`${item.name}-${sub.name}`} item={sub} />
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

          {/* Right icons */}
          <div className="flex items-center space-x-3">
            {/* Search */}
            <div className="relative" ref={searchRef}>
              <AnimatePresence mode="wait">
                {isSearchOpen ? (
                  <motion.div
                    key="search-open"
                    className="relative flex items-center"
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 260, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full h-10 px-4 pr-10 text-sm bg-card border border-border rounded-full outline-none focus:ring-2 focus:ring-primary"
                      onFocus={() => {
                        // open results area if term exists
                        if (searchTerm.trim() && results.length === 0) {
                          // trigger search quickly
                          setSearchTerm((s) => s);
                        }
                      }}
                    />
                    <button
                      className="absolute right-2 text-foreground hover:text-primary"
                      onClick={() => {
                        setIsSearchOpen(false);
                        setSearchTerm("");
                        setResults([]);
                      }}
                      type="button"
                    >
                      <X size={18} />
                    </button>

                    {/* Dropdown */}
                    {searchTerm.trim() && (
                      <div className="absolute top-12 right-0 w-80 bg-card border border-border shadow-xl rounded-xl p-2 z-50 max-h-80 overflow-y-auto">
                        {isLoadingProducts ? (
                          <div className="p-4 text-center text-sm text-muted-foreground">Loading products...</div>
                        ) : results.length > 0 ? (
                          results.map((p) => (
                            <div
                              key={p._id}
                              className="flex items-center gap-3 p-2 hover:bg-muted/50 rounded cursor-pointer"
                              onClick={() => {
                                navigate(`/product/${p._id}`);
                                setIsSearchOpen(false);
                                setSearchTerm("");
                                setResults([]);
                              }}
                            >
                              <img
                                src={
                                  p.imageUrl?.[0]?.imageUrl ||
                                  p.imageUrl?.[0] ||
                                  (p.images && p.images[0]) ||
                                  "https://via.placeholder.com/80?text=No+Image"
                                }
                                alt={p.name}
                                className="w-12 h-12 rounded object-cover border"
                              />
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm truncate">{p.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  ₹{(typeof p.salePrice === "number" && p.salePrice < p.price) ? p.salePrice : p.price}
                                </p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="p-3 text-center text-sm text-muted-foreground">No matching products</div>
                        )}
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <button
                    onClick={() => setIsSearchOpen(true)}
                    className="p-2 text-foreground hover:text-primary"
                    aria-label="Open search"
                  >
                    <Search size={24} />
                  </button>
                )}
              </AnimatePresence>
            </div>

            {/* Cart */}
            <div className="relative">
              <button className="p-2 text-foreground hover:text-primary" onClick={toggleCart}>
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

            {/* User */}
            <div className="relative">
              <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="p-2 text-foreground hover:text-primary">
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

            {/* Mobile toggle */}
            <button className="md:hidden p-2 text-foreground hover:text-primary" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div className="md:hidden py-4 border-t border-border" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
              {filteredMenuItems.map((item) => (
                <div key={item.name}>
                  <button
                    className="w-full flex justify-between items-center py-2 px-3 text-foreground hover:text-primary font-semibold"
                    onClick={() => setMobileOpenMenu(mobileOpenMenu === item.name ? null : item.name)}
                  >
                    {item.name}
                    {item.subCategories && <ChevronDown size={16} />}
                  </button>

                  {item.subCategories && mobileOpenMenu === item.name && (
                    <div className="pl-4">
                      {item.subCategories.map((sub) => (
                        <div key={`${item.name}-${sub.name}`}>
                          <Link to={sub.path} className="block py-1 text-foreground hover:text-secondary" onClick={() => setIsMenuOpen(false)}>
                            {sub.name}
                          </Link>

                          {sub.children && (
                            <div className="pl-4">
                              {sub.children.map((child) => (
                                <Link key={`${sub.name}-${child.name}`} to={child.path} className="block py-1 text-foreground hover:text-secondary" onClick={() => setIsMenuOpen(false)}>
                                  {child.name}
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

      <SignInModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </motion.nav>
  );
};

export default Navbar;
