import { motion } from "framer-motion";
import { ShoppingCart, Eye, Star } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { toast } from "../hooks/use-toast";

const ProductCard = ({ product, index }) => {
  const [selectedColor, setSelectedColor] = useState(0);
  const navigate = useNavigate();
  const { addItem, openCart } = useCart();

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 60,
      scale: 0.8,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        delay: index * 0.1,
        duration: 0.6,
        type: "spring",
        stiffness: 100,
        damping: 20,
      },
    },
  };

  const handleAddToCart = () => {
    addItem({
      id: product._id,
      name: product.name,
      price: product.price,
      emoji: product.emoji,
      selectedColor: product.colors?.[selectedColor],
      category: product.category,
    });

    toast({
      title: "Added to cart! 🎉",
      description: `${product.name} has been added to your cart.`,
    });

    setTimeout(() => {
      openCart();
    }, 500);
  };

  const handleQuickView = () => {
    navigate(`/product/${product._id}`);
  };

  return (
    <motion.div
      className="card-product group relative"
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      whileHover={{
        y: -8,
        transition: { duration: 0.3 },
      }}
    >
      {(product.isNew || product.isBestSeller) && (
        <motion.div
          className={`absolute top-3 left-3 z-10 px-3 py-1 rounded-full text-xs font-bold ${
            product.isNew
              ? "bg-gradient-to-r from-success to-accent text-success-foreground"
              : "bg-gradient-to-r from-secondary to-fun text-secondary-foreground"
          }`}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            delay: index * 0.1 + 0.3,
            type: "spring",
            stiffness: 500,
          }}
        >
          {product.isNew ? "✨ NEW" : "🔥 BEST SELLER"}
        </motion.div>
      )}

      {/* ✅ Updated Product Image */}
      <div
        className="relative h-48 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl flex items-center justify-center mb-4 overflow-hidden cursor-pointer"
        onClick={() => navigate(`/product/${product._id}`)}
      >
        {product.imageUrl?.[0]?.imageUrl ? (
          <motion.img
            src={product.imageUrl[0].imageUrl}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            initial={{ scale: 1 }}
            animate={{ rotate: [0, 2, -2, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-3xl bg-gray-100 rounded-2xl">
            No Image
          </div>
        )}

        <motion.div
          className="absolute inset-0 bg-black/40 backdrop-blur-sm rounded-2xl flex items-center justify-center space-x-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
        >
          <motion.button
            className="p-3 bg-primary text-primary-foreground rounded-full shadow-glow"
            onClick={handleQuickView}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Eye size={18} />
          </motion.button>
          <motion.button
            className="btn-cart p-3"
            onClick={handleAddToCart}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ShoppingCart size={18} />
          </motion.button>
        </motion.div>
      </div>

      {/* Product Details */}
      <div className="space-y-3">
        <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
          {product.category}
        </span>

        <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors duration-200 font-kids">
          {product.name}
        </h3>

        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={14}
                className={`${
                  i < Math.floor(product.rating || 0)
                    ? "text-accent fill-current"
                    : "text-muted-foreground"
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-muted-foreground">
            ({product.rating || 0})
          </span>
        </div>

        {product.colors && product.colors.length > 0 && (
          <div className="flex items-center space-x-2">
            <span className="text-xs text-muted-foreground">Colors:</span>
            <div className="flex space-x-1">
              {product.colors.map((color, i) => (
                <motion.button
                  key={i}
                  className={`w-5 h-5 rounded-full border-2 ${
                    selectedColor === i ? "border-primary" : "border-border"
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => setSelectedColor(i)}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                />
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold text-primary">
              ₹{product.salePrice}
            </span>
            {product.price && (
              <span className="text-sm text-muted-foreground line-through">
                ₹{product.price}
              </span>
            )}
          </div>

          <motion.button
            className="text-sm px-4 py-2 rounded-md text-black"
            style={{ backgroundColor: "#F7D2CF" }}
            onClick={handleAddToCart}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Add to Cart
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
