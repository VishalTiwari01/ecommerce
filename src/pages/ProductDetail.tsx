// pages/ProductDetail.jsx
import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ShoppingCart,
  Shield,
  Truck,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useCart } from "../contexts/CartContext";
import { toast } from "../hooks/use-toast";
import { getProductsId } from "../APi/api";

/**
 * mapProductResponse
 * - Flattens/wraps backend product to a consistent front-end shape
 * - Extracts images (base + variant), color names and hex values
 * - Leaves variants array intact for further logic
 */
const DEFAULT_COLOR_MAP = {
  blue: "#3b82f6",
  red: "#ef4444",
  green: "#10b981",
  yellow: "#facc15",
  black: "#000000",
  white: "#ffffff",
  pink: "#ec4899",
  purple: "#a855f7",
};

const mapProductResponse = (p = {}) => {
  // base images
  const baseImages = Array.isArray(p.imageUrl)
    ? p.imageUrl.map((i) => ({ imageUrl: i.imageUrl }))
    : [];

  // variant images
  const variantImages = (p.variants || []).flatMap((v) =>
    Array.isArray(v.imageUrl) ? v.imageUrl.map((i) => ({ imageUrl: i.imageUrl, variantId: v._id })) : []
  );

  // merge and dedupe images (keep base first)
  const allImages = [
    ...baseImages,
    ...variantImages.filter((vi) => !baseImages.some((bi) => bi.imageUrl === vi.imageUrl)),
  ];

  // extract 'Color' variant values
  const colorVariants = (p.variants || [])
    .filter((v) => v.variantType?.toLowerCase() === "color")
    .map((v) => ({ name: v.variantValue, variant: v }));

  const colors = colorVariants.map((c) => DEFAULT_COLOR_MAP[c.name?.toLowerCase()] ?? c.name);

  const colorNames = colorVariants.map((c) => c.name);

  return {
    _id: p._id,
    name: p.name,
    description: p.description || "",
    shortDescription: p.shortDescription || "",
    category: p.category || p.categoryId || "Uncategorized",
    price: typeof p.price === "number" ? p.price : null,
    salePrice: typeof p.salePrice === "number" ? p.salePrice : null,
    stockQuantity: p.stockQuantity ?? 0,
    isFeatured: !!p.isFeatured,
    imageUrl: allImages, // [{imageUrl, variantId?}]
    isActive: !!p.isActive,
    status: p.status || null,
    createdAt: p.createdAt || null,
    updatedAt: p.updatedAt || null,
    variants: p.variants || [],
    colors,     // hex or raw string for swatch background
    colorNames, // human-readable color names
    // optional product metadata
    material: p.material || null,
    dimensions: p.dimensions || null,
    weight: p.weight || null,
    warrantyPeriod: p.warrantyPeriod || null,
    careInstructions: p.careInstructions || null,
    features: p.features || [],
  };
};

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem, openCart } = useCart();

  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedColorIndex, setSelectedColorIndex] = useState(-1);
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(-1);

  // modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(-1);

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        const fetchedRaw = await getProductsId(id);
        const fetched = fetchedRaw; // getProductsId already unwraps
        const mapped = mapProductResponse(fetched);
        setProduct(mapped);

        // set defaults
        setSelectedImageIndex(mapped.imageUrl && mapped.imageUrl.length ? 0 : -1);
        setSelectedColorIndex(mapped.colors && mapped.colors.length ? 0 : -1);

        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching product details:", err);
        setError(err.message || "Failed to load product");
        toast({
          title: "Error fetching product",
          description: err.message || "Something went wrong",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Keep modal index in sync with selectedImageIndex when modal opens
  useEffect(() => {
    if (isModalOpen) {
      setModalImageIndex(selectedImageIndex >= 0 ? selectedImageIndex : 0);
    }
  }, [isModalOpen, selectedImageIndex]);

  // Keyboard handlers for modal navigation & close
  const handleKeyDown = useCallback(
    (e) => {
      if (!isModalOpen || !product?.imageUrl?.length) return;
      if (e.key === "Escape") {
        setIsModalOpen(false);
      } else if (e.key === "ArrowLeft") {
        setModalImageIndex((prev) => {
          if (!product) return prev;
          return (prev - 1 + product.imageUrl.length) % product.imageUrl.length;
        });
      } else if (e.key === "ArrowRight") {
        setModalImageIndex((prev) => {
          if (!product) return prev;
          return (prev + 1) % product.imageUrl.length;
        });
      }
    },
    [isModalOpen, product]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading product details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        <p>Error: {error}</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😅</div>
          <h2 className="text-2xl font-bold mb-4">Product not found</h2>
          <button onClick={() => navigate("/")} className="btn-hero">
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  // find the currently selected variant (if colors were created from variants)
  const selectedVariant =
    product.variants?.find((v) =>
      product.colorNames?.[selectedColorIndex]
        ? v.variantValue === product.colorNames[selectedColorIndex] && /color/i.test(v.variantType)
        : false
    ) || null;

  // choose displayed price: variant.priceAdjustment (if present & numeric) else salePrice else price
  const displayedPrice =
    (selectedVariant && typeof selectedVariant.priceAdjustment === "number"
      ? selectedVariant.priceAdjustment
      : product.salePrice ?? product.price) ?? 0;

  const hasSale = product.salePrice != null && product.price && product.price > product.salePrice;

  // When user clicks a color, if that variant has its own image, switch main image to it
  const onSelectColor = (index) => {
    setSelectedColorIndex(index);

    const colorName = product.colorNames?.[index];
    if (!colorName) return;

    // try to find variant with that color and get its first image
    const variant = product.variants?.find(
      (v) => /color/i.test(v.variantType) && v.variantValue === colorName
    );

    if (variant && Array.isArray(variant.imageUrl) && variant.imageUrl.length > 0) {
      const variantImageUrl = variant.imageUrl[0].imageUrl;
      // find index of that image in product.imageUrl
      const imgIndex = product.imageUrl.findIndex((i) => i.imageUrl === variantImageUrl);
      if (imgIndex >= 0) setSelectedImageIndex(imgIndex);
      else {
        // if not present in merged images, push it (and set new index)
        const newImages = [...product.imageUrl, { imageUrl: variantImageUrl }];
        setProduct((prev) => ({ ...prev, imageUrl: newImages }));
        setSelectedImageIndex(newImages.length - 1);
      }
    }
  };

  const handleAddToCart = () => {
    addItem({
      id: product._id,
      name: product.name,
      price: displayedPrice,
      selectedColor: product.colorNames?.[selectedColorIndex] ?? null,
      category: product.category,
      quantity: quantity,
      variantId: selectedVariant?._id ?? null,
      image: product.imageUrl?.[selectedImageIndex]?.imageUrl ?? null,
    });

    toast({
      title: "Added to cart! 🎉",
      description: `${quantity} x ${product.name} added to cart.`,
    });

    // small delay before opening cart (keeps UX smooth)
    setTimeout(() => openCart(), 500);
  };

  // Open modal for a given index
  const openImageModal = (index) => {
    setModalImageIndex(index);
    setIsModalOpen(true);
  };

  // Modal navigation functions
  const showPrevModalImage = (e) => {
    e?.stopPropagation?.();
    if (!product?.imageUrl?.length) return;
    setModalImageIndex((prev) => (prev - 1 + product.imageUrl.length) % product.imageUrl.length);
  };

  const showNextModalImage = (e) => {
    e?.stopPropagation?.();
    if (!product?.imageUrl?.length) return;
    setModalImageIndex((prev) => (prev + 1) % product.imageUrl.length);
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.button
          className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors mb-8"
          onClick={() => navigate(-1)}
          whileHover={{ x: -5 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowLeft size={20} />
          <span>Back to products</span>
        </motion.button>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* LEFT: IMAGE GALLERY */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative">
              {product.imageUrl?.length > 0 && selectedImageIndex >= 0 ? (
                <motion.img
                  key={product.imageUrl[selectedImageIndex]?.imageUrl}
                  src={product.imageUrl[selectedImageIndex]?.imageUrl}
                  alt={product.name}
                  className="w-full h-96 object-contain bg-gradient-to-br from-primary/10 to-secondary/10 rounded-3xl shadow-card cursor-pointer"
                  onClick={() => openImageModal(selectedImageIndex)}
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.3 }}
                />
              ) : (
                <div className="w-full h-96 bg-muted rounded-3xl flex items-center justify-center text-xl text-muted-foreground">
                  No Image Available
                </div>
              )}
            </div>

            {/* Thumbnail Row */}
            {product.imageUrl?.length > 1 && (
              <div className="flex space-x-3 overflow-x-auto pb-1">
                {product.imageUrl.map((img, index) => (
                  <img
                    key={index}
                    src={img.imageUrl}
                    alt={`Thumb ${index + 1}`}
                    onClick={() => {
                      setSelectedImageIndex(index);
                      openImageModal(index); // open modal immediately on thumbnail click
                    }}
                    className={`w-20 h-20 object-cover rounded-lg border-2 cursor-pointer ${
                      selectedImageIndex === index ? "border-primary" : "border-muted"
                    }`}
                  />
                ))}
              </div>
            )}
          </motion.div>

          {/* RIGHT: PRODUCT INFO */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
                {product.category}
              </span>
            </div>

            <div>
              <h1 className="text-4xl font-bold text-foreground font-kids mb-2">{product.name}</h1>

              {product.shortDescription && <p className="text-muted-foreground mb-4">{product.shortDescription}</p>}

              <div className="flex items-center space-x-4">
                <span className="text-3xl font-bold text-primary">₹{displayedPrice}</span>
                {hasSale && (
                  <>
                    <span className="text-xl text-muted-foreground line-through">₹{product.price}</span>
                    <span className="bg-success text-success-foreground px-2 py-1 rounded-full text-sm font-semibold">
                      Save ₹{(product.price - product.salePrice).toFixed(2)}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Description accordion */}
            <div className="border border-border rounded-lg">
              <button
                className="w-full flex justify-between items-center px-4 py-3 text-left font-semibold text-foreground bg-muted hover:bg-muted/70 transition"
                onClick={() => {
                  const el = document.getElementById("product-desc");
                  if (el) el.classList.toggle("hidden");
                }}
              >
                <span>📄 Product Description</span>
                <span className="text-xl">+</span>
              </button>
              <div id="product-desc" className="px-4 py-3 text-muted-foreground leading-relaxed border-t border-border hidden">
                {product.description}
              </div>
            </div>

            {/* Color Swatches */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <h3 className="font-semibold text-foreground mb-3">
                  Color: {product.colorNames?.[selectedColorIndex] ?? product.colors[selectedColorIndex]}
                </h3>
                <div className="flex space-x-3">
                  {product.colors.map((color, index) => (
                    <motion.button
                      key={index}
                      className={`w-12 h-12 rounded-full border-4 transition-all ${
                        selectedColorIndex === index ? "border-primary scale-110" : "border-border hover:border-primary/50"
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => onSelectColor(index)}
                      whileHover={{ scale: selectedColorIndex === index ? 1.1 : 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <span className="font-semibold text-foreground">Quantity:</span>
                <div className="flex items-center border border-border rounded-lg">
                  <button className="p-2 hover:bg-muted transition-colors" onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                  <span className="px-4 py-2 border-x border-border min-w-[60px] text-center">{quantity}</span>
                  <button className="p-2 hover:bg-muted transition-colors" onClick={() => setQuantity(quantity + 1)}>+</button>
                </div>
              </div>

              <motion.button
                className="flex-1 btn-cart flex items-center justify-center space-x-3 py-4"
                style={{ backgroundColor: "#F7D2CF" }}
                onClick={handleAddToCart}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <ShoppingCart size={20} />
                <span>Add to Cart</span>
              </motion.button>
            </div>

            {/* Extra Info */}
            <div className="space-y-2 text-muted-foreground">
              {product.material && <div><strong>Material:</strong> {product.material}</div>}
              {product.dimensions && <div><strong>Dimensions:</strong> {product.dimensions}</div>}
              {/* {product.weight && <div><strong>Weight:</strong> {product.weight} kg</div>} */}
              {/* {product.warrantyPeriod && <div><strong>Warranty:</strong> {product.warrantyPeriod} months</div>} */}
              {/* {product.careInstructions && <div><strong>Care:</strong> {product.careInstructions}</div>} */}
            </div>

            {/* Features */}
            {product.features && product.features.length > 0 && (
              <div>
                <h3 className="font-semibold text-foreground mb-3 flex items-center space-x-2"><span>✨ Key Features</span></h3>
                <ul className="space-y-2">
                  {product.features.map((f, i) => (
                    <li key={i} className="flex items-center space-x-2 text-muted-foreground">
                      <span className="text-success">✓</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex items-center justify-between py-6 border-t border-border">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Shield size={16} className="text-success" />
                <span>Safe & Tested</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Truck size={16} className="text-primary" />
                <span>Free Shipping</span>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* =========================
          FULLSCREEN IMAGE MODAL
         ========================= */}
      {isModalOpen && product?.imageUrl && modalImageIndex >= 0 && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsModalOpen(false)} // click outside to close
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black bg-opacity-85" />

          {/* Modal content */}
          <div
            className="relative max-w-[200vw] max-h-[200vh] flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()} 
          >
            {/* Close button */}
            <button
              className="absolute top-4 right-4 z-50 p-2 rounded-full bg-black/50 hover:bg-black/40 text-white"
              onClick={() => setIsModalOpen(false)}
              aria-label="Close"
            >
              <X size={20} />
            </button>

            {/* Prev button */}
            <button
              className="absolute left-4 z-40 p-2 rounded-full bg-black/30 hover:bg-black/20 text-white hidden md:flex items-center justify-center"
              onClick={showPrevModalImage}
              aria-label="Previous image"
            >
              <ChevronLeft size={28} />
            </button>

            {/* Next button */}
            <button
              className="absolute right-4 z-40 p-2 rounded-full bg-black/30 hover:bg-black/20 text-white hidden md:flex items-center justify-center"
              onClick={showNextModalImage}
              aria-label="Next image"
            >
              <ChevronRight size={28} />
            </button>

            {/* Image */}
            <motion.img
              key={product.imageUrl[modalImageIndex].imageUrl}
              src={product.imageUrl[modalImageIndex].imageUrl}
              alt={`${product.name} — view ${modalImageIndex + 1}`}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="max-w-full max-h-[200vw] object-contain rounded-lg shadow-2xl"
            />

            {/* Thumbnail strip inside modal (optional, shown on small screens) */}
            {product.imageUrl.length > 1 && (
              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 overflow-x-auto px-2">
                {product.imageUrl.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setModalImageIndex(idx);
                      setSelectedImageIndex(idx);
                    }}
                    className={`w-28 h-28 rounded-md overflow-hidden border-2 ${modalImageIndex === idx ? "border-primary" : "border-transparent"} bg-white/5`}
                  >
                    <img src={img.imageUrl} alt={`modal-thumb-${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ProductDetail;
