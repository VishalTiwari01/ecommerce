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
  ZoomIn,
  ZoomOut,
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

// Local placeholder if image fails / not present
const FALLBACK_IMAGE = "/images/product-placeholder.png";

// Normalize any kind of imageUrl into [{ imageUrl }]
const normalizeImageArray = (raw) => {
  if (!raw) return [];

  if (Array.isArray(raw)) {
    return raw
      .map((item) => {
        if (!item) return null;

        if (typeof item === "string") {
          return { imageUrl: item };
        }

        if (typeof item === "object") {
          return {
            imageUrl: item.imageUrl || item.url || item.path || null,
          };
        }

        return null;
      })
      .filter((i) => i?.imageUrl);
  }

  if (typeof raw === "string") {
    return [{ imageUrl: raw }];
  }

  if (typeof raw === "object" && raw.imageUrl) {
    return [{ imageUrl: raw.imageUrl }];
  }

  return [];
};

const mapProductResponse = (p = {}) => {
  // base images
  const baseImages = normalizeImageArray(p.imageUrl);

  // variant images
  const variantImages = (p.variants || []).flatMap((v) => {
    const arr = normalizeImageArray(v.imageUrl);
    return arr.map((i) => ({ ...i, variantId: v._id }));
  });

  // merge and dedupe images (keep base first)
  const allImages = [
    ...baseImages,
    ...variantImages.filter(
      (vi) => !baseImages.some((bi) => bi.imageUrl === vi.imageUrl)
    ),
  ];

  // ensure at least one fallback
  const finalImages =
    allImages.length > 0 ? allImages : [{ imageUrl: FALLBACK_IMAGE }];

  // extract 'Color' variant values
  const colorVariants = (p.variants || [])
    .filter((v) => v.variantType?.toLowerCase() === "color")
    .map((v) => ({ name: v.variantValue, variant: v }));

  const colors = colorVariants.map(
    (c) => DEFAULT_COLOR_MAP[c.name?.toLowerCase()] ?? c.name
  );

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
    imageUrl: finalImages, // [{imageUrl, variantId?}]
    isActive: !!p.isActive,
    status: p.status || null,
    createdAt: p.createdAt || null,
    updatedAt: p.updatedAt || null,
    variants: p.variants || [],
    colors, // hex or raw string for swatch background
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

  // zoom state (for modal)
  const [zoomLevel, setZoomLevel] = useState(1); // 1x default

  // fallback handler for any <img>
  const handleImageError = (e) => {
    if (e.target.dataset.fallbackApplied === "true") return;
    e.target.dataset.fallbackApplied = "true";
    e.target.src = FALLBACK_IMAGE;
  };

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        const fetchedRaw = await getProductsId(id);
        const fetched = fetchedRaw;
        const mapped = mapProductResponse(fetched);
        setProduct(mapped);

        const hasImages = mapped.imageUrl && mapped.imageUrl.length > 0;
        setSelectedImageIndex(hasImages ? 0 : -1);

        const hasColors = mapped.colors && mapped.colors.length > 0;
        setSelectedColorIndex(hasColors ? 0 : -1);

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
    if (isModalOpen && product?.imageUrl?.length) {
      setModalImageIndex(
        selectedImageIndex >= 0 ? selectedImageIndex : 0
      );
      setZoomLevel(1); // reset zoom when opening
    }
  }, [isModalOpen, selectedImageIndex, product]);

  // Keyboard handlers for modal navigation & close
  const handleKeyDown = useCallback(
    (e) => {
      if (!isModalOpen || !product?.imageUrl?.length) return;
      if (e.key === "Escape") {
        setIsModalOpen(false);
      } else if (e.key === "ArrowLeft") {
        setModalImageIndex((prev) => {
          return (prev - 1 + product.imageUrl.length) % product.imageUrl.length;
        });
      } else if (e.key === "ArrowRight") {
        setModalImageIndex((prev) => {
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
        ? v.variantValue === product.colorNames[selectedColorIndex] &&
          /color/i.test(v.variantType)
        : false
    ) || null;

  // choose displayed price: variant.priceAdjustment (if present & numeric) else salePrice else price
  const displayedPrice =
    (selectedVariant && typeof selectedVariant.priceAdjustment === "number"
      ? selectedVariant.priceAdjustment
      : product.salePrice ?? product.price) ?? 0;

  const hasSale =
    product.salePrice != null &&
    product.price &&
    product.price > product.salePrice;

  // When user clicks a color, if that variant has its own image, switch main image to it
  const onSelectColor = (index) => {
    setSelectedColorIndex(index);

    const colorName = product.colorNames?.[index];
    if (!colorName) return;

    // try to find variant with that color and get its first image
    const variant = product.variants?.find(
      (v) => /color/i.test(v.variantType) && v.variantValue === colorName
    );

    if (variant) {
      const variantImages = normalizeImageArray(variant.imageUrl);
      if (variantImages.length > 0) {
        const variantImageUrl = variantImages[0].imageUrl;
        const imgIndex = product.imageUrl.findIndex(
          (i) => i.imageUrl === variantImageUrl
        );
        if (imgIndex >= 0) setSelectedImageIndex(imgIndex);
        else {
          const newImages = [
            ...product.imageUrl,
            { imageUrl: variantImageUrl },
          ];
          setProduct((prev) => ({ ...prev, imageUrl: newImages }));
          setSelectedImageIndex(newImages.length - 1);
        }
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
      image:
        product.imageUrl?.[selectedImageIndex]?.imageUrl ??
        product.imageUrl?.[0]?.imageUrl ??
        FALLBACK_IMAGE,
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
    if (!product?.imageUrl?.length) return;
    setModalImageIndex(index);
    setIsModalOpen(true);
    setZoomLevel(1);
  };

  // Modal navigation functions
  const showPrevModalImage = (e) => {
    e?.stopPropagation?.();
    if (!product?.imageUrl?.length) return;
    setModalImageIndex(
      (prev) => (prev - 1 + product.imageUrl.length) % product.imageUrl.length
    );
    setZoomLevel(1);
  };

  const showNextModalImage = (e) => {
    e?.stopPropagation?.();
    if (!product?.imageUrl?.length) return;
    setModalImageIndex(
      (prev) => (prev + 1) % product.imageUrl.length
    );
    setZoomLevel(1);
  };

  // Zoom handlers
  const zoomIn = (e) => {
    e?.stopPropagation?.();
    setZoomLevel((z) => Math.min(z + 0.25, 3)); // max 3x
  };

  const zoomOut = (e) => {
    e?.stopPropagation?.();
    setZoomLevel((z) => Math.max(z - 0.25, 1)); // min 1x
  };

  const resetZoom = (e) => {
    e?.stopPropagation?.();
    setZoomLevel(1);
  };

  // Scroll / wheel zoom inside modal
  const handleWheelZoom = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.deltaY < 0) {
      // scroll up -> zoom in
      setZoomLevel((z) => Math.min(z + 0.1, 3));
    } else {
      // scroll down -> zoom out
      setZoomLevel((z) => Math.max(z - 0.1, 1));
    }
  };

  // Main image for product view
  const mainImage =
    product.imageUrl?.[selectedImageIndex]?.imageUrl ??
    product.imageUrl?.[0]?.imageUrl ??
    FALLBACK_IMAGE;

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
            className="space-y-2"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative">
              <motion.img
                key={mainImage}
                src={mainImage}
                alt={product.name}
                className="w-3/4 h-3/4 ml-16 object-contain bg-gradient-to-br from-primary/10 to-secondary/10 rounded-3xl shadow-card cursor-pointer"
                onClick={() =>
                  selectedImageIndex >= 0
                    ? openImageModal(selectedImageIndex)
                    : openImageModal(0)
                }
                onError={handleImageError}
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.3 }}
              />
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
                    onError={handleImageError}
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
              <h1 className="text-4xl font-bold text-foreground font-kids mb-2">
                {product.name}
              </h1>

              {product.shortDescription && (
                <p className="text-muted-foreground mb-4">
                  {product.shortDescription}
                </p>
              )}

              <div className="flex items-center space-x-4">
                <span className="text-3xl font-bold text-pink-400 text-primary">
                  ₹{displayedPrice}
                </span>
                {hasSale && (
                  <>
                    <span className="text-xl text-muted-foreground line-through">
                      ₹{product.price}
                    </span>
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
              <div
                id="product-desc"
                className="px-4 py-3 text-muted-foreground leading-relaxed border-t border-border hidden"
              >
                {product.description}
              </div>
            </div>

            {/* Color Swatches */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <h3 className="font-semibold text-foreground mb-3">
                  Color:{" "}
                  {product.colorNames?.[selectedColorIndex] ??
                    product.colors[selectedColorIndex]}
                </h3>
                <div className="flex space-x-3">
                  {product.colors.map((color, index) => (
                    <motion.button
                      key={index}
                      className={`w-12 h-12 rounded-full border-4 transition-all ${
                        selectedColorIndex === index
                          ? "border-primary scale-110"
                          : "border-border hover:border-primary/50"
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => onSelectColor(index)}
                      whileHover={{
                        scale: selectedColorIndex === index ? 1.1 : 1.05,
                      }}
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
                  <button
                    className="p-2 hover:bg-muted transition-colors"
                    onClick={() =>
                      setQuantity((q) => Math.max(1, q - 1))
                    }
                  >
                    -
                  </button>
                  <span className="px-4 py-2 border-x border-border min-w-[60px] text-center">
                    {quantity}
                  </span>
                  <button
                    className="p-2 hover:bg-muted transition-colors"
                    onClick={() => setQuantity((q) => q + 1)}
                  >
                    +
                  </button>
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
              {product.material && (
                <div>
                  <strong>Material:</strong> {product.material}
                </div>
              )}
              {product.dimensions && (
                <div>
                  <strong>Dimensions:</strong> {product.dimensions}
                </div>
              )}
            </div>

            {/* Features */}
            {product.features && product.features.length > 0 && (
              <div>
                <h3 className="font-semibold text-foreground mb-3 flex items-center space-x-2">
                  <span>✨ Key Features</span>
                </h3>
                <ul className="space-y-2">
                  {product.features.map((f, i) => (
                    <li
                      key={i}
                      className="flex items-center space-x-2 text-muted-foreground"
                    >
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
      {isModalOpen &&
        product?.imageUrl &&
        modalImageIndex >= 0 &&
        modalImageIndex < product.imageUrl.length && (
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
              className="relative max-w-[200vw] max-h-[200vh] flex flex-col items-center justify-center p-4"
              onClick={(e) => e.stopPropagation()}
              onWheel={handleWheelZoom}
            >
              {/* Close button */}
              <button
                className="absolute top-4 right-4 z-50 p-2 rounded-full bg-black/50 hover:bg-black/40 text-white"
                onClick={() => setIsModalOpen(false)}
                aria-label="Close"
              >
                <X size={20} />
              </button>

              {/* Zoom controls */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 flex items-center space-x-2 bg-black/40 px-3 py-1 rounded-full text-white text-sm">
                <button
                  className="p-1 hover:bg-white/10 rounded-full flex items-center"
                  onClick={zoomOut}
                  aria-label="Zoom out"
                >
                  <ZoomOut size={18} />
                </button>
                <span className="px-2 text-xs">
                  {(zoomLevel * 100).toFixed(0)}%
                </span>
                <button
                  className="p-1 hover:bg-white/10 rounded-full flex items-center"
                  onClick={zoomIn}
                  aria-label="Zoom in"
                >
                  <ZoomIn size={18} />
                </button>
                <button
                  className="ml-2 px-2 py-0.5 text-xs rounded-full bg-white/10 hover:bg-white/20"
                  onClick={resetZoom}
                >
                  Reset
                </button>
              </div>

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

              {/* Image container with zoom */}
              {/* Image Zoom Container */}
<div
  className="relative flex items-center justify-center overflow-hidden rounded-lg shadow-2xl"
  style={{
    width: "85vw",          // Fixed modal width
    height: "85vh",         // Fixed modal height
    border: "1px solid rgba(255,255,255,0.1)",
    background: "rgba(0,0,0,0.2)",
  }}
>
  <motion.img
    key={product.imageUrl[modalImageIndex]?.imageUrl ?? FALLBACK_IMAGE}
    src={product.imageUrl[modalImageIndex]?.imageUrl ?? FALLBACK_IMAGE}
    alt={`${product.name} — zoomed ${modalImageIndex + 1}`}
    onError={handleImageError}
    initial={{ scale: 0.9, opacity: 0 }}
    animate={{ scale: zoomLevel, opacity: 1 }}
    transition={{ type: "spring", stiffness: 260, damping: 20 }}
    drag={zoomLevel > 1 ? true : false}        // allow drag only when zoomed
    dragConstraints={{ left: -200, right: 200, top: -200, bottom: 200 }}
    className="object-contain cursor-grab active:cursor-grabbing"
    style={{
      maxWidth: "100%",
      maxHeight: "100%",
      userSelect: "none",
    }}
  />
</div>


              {/* Thumbnail strip inside modal */}
              {product.imageUrl.length > 1 && (
                <div className="mt-4 flex space-x-2 overflow-x-auto px-2">
                  {product.imageUrl.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setModalImageIndex(idx);
                        setSelectedImageIndex(idx);
                        setZoomLevel(1);
                      }}
                      className={`w-20 h-20 md:w-24 md:h-24 rounded-md overflow-hidden border-2 ${
                        modalImageIndex === idx
                          ? "border-primary"
                          : "border-transparent"
                      } bg-white/5`}
                    >
                      <img
                        src={img.imageUrl}
                        alt={`modal-thumb-${idx}`}
                        onError={handleImageError}
                        className="w-full h-full object-cover"
                      />
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
