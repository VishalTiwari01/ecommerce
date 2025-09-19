import { motion } from 'framer-motion';
import { ShoppingCart, Eye, Star } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { toast } from '../hooks/use-toast';

const ProductCard = ({ product, index }) => {
  const [selectedColor, setSelectedColor] = useState(0);
  const navigate = useNavigate();
  const { addItem, openCart } = useCart();

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 60,
      scale: 0.8
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
        damping: 20
      }
    }
  };

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      emoji: product.emoji,
      selectedColor: product.colors[selectedColor],
      category: product.category
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
    navigate(`/product/${product.id}`);
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
        transition: { duration: 0.3 }
      }}
    >
      {/* Badge */}
      {(product.isNew || product.isBestSeller) && (
        <motion.div 
          className={`absolute top-3 left-3 z-10 px-3 py-1 rounded-full text-xs font-bold ${
            product.isNew 
              ? 'bg-gradient-to-r from-success to-accent text-success-foreground' 
              : 'bg-gradient-to-r from-secondary to-fun text-secondary-foreground'
          }`}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: index * 0.1 + 0.3, type: "spring", stiffness: 500 }}
        >
          {product.isNew ? '✨ NEW' : '🔥 BEST SELLER'}
        </motion.div>
      )}

      {/* Product Image Area */}
      <div 
        className="relative h-48 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl flex items-center justify-center mb-4 overflow-hidden cursor-pointer"
        onClick={() => navigate(`/product/${product.id}`)}
      >
        <motion.div 
          className="text-6xl group-hover:scale-110 transition-transform duration-300"
          animate={{ 
            rotate: [0, 5, -5, 0],
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {product.emoji}
        </motion.div>

        {/* Hover Overlay */}
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

      {/* Product Info */}
      <div className="space-y-3">
        {/* Category */}
        <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
          {product.category}
        </span>

        {/* Name */}
        <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors duration-200 font-kids">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                size={14} 
                className={`${
                  i < Math.floor(product.rating) 
                    ? 'text-accent fill-current' 
                    : 'text-muted-foreground'
                }`} 
              />
            ))}
          </div>
          <span className="text-sm text-muted-foreground">({product.rating})</span>
        </div>

        {/* Colors */}
        <div className="flex items-center space-x-2">
          <span className="text-xs text-muted-foreground">Colors:</span>
          <div className="flex space-x-1">
            {product.colors.map((color, i) => (
              <motion.button
                key={i}
                className={`w-5 h-5 rounded-full border-2 ${
                  selectedColor === i ? 'border-primary' : 'border-border'
                }`}
                style={{ backgroundColor: color }}
                onClick={() => setSelectedColor(i)}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              />
            ))}
          </div>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold text-primary">${product.price}</span>
            {product.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                ${product.originalPrice}
              </span>
            )}
          </div>
          
          <motion.button
  className="text-sm px-4 py-2 rounded-md text-black"
  style={{ backgroundColor: '#F7D2CF' }}
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