import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, Heart, ShoppingCart, Shield, Truck, RotateCcw } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { toast } from '../hooks/use-toast';
import Navbar from '../components/Navbar';

// Mock product data - in a real app, this would come from an API
const productData = {
  1: {
    id: 1,
    name: 'Magic Building Blocks',
    price: 29.99,
    originalPrice: 39.99,
    rating: 4.8,
    reviewCount: 142,
    category: 'Educational Toys',
    emoji: '🧱',
    colors: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'],
    colorNames: ['Coral Red', 'Turquoise', 'Sky Blue', 'Mint Green'],
    images: ['🧱', '🔨', '🏗️', '🎨'],
    description: 'Spark your child\'s creativity with these magical building blocks! Made from safe, eco-friendly materials, these colorful blocks help develop fine motor skills, spatial awareness, and imagination.',
    features: [
      'Safe, non-toxic materials',
      'Develops creativity and motor skills',
      'Compatible with other block sets',
      'Ages 3-12 years',
      'Easy to clean and store'
    ],
    specifications: {
      'Age Range': '3-12 years',
      'Material': 'BPA-free plastic',
      'Pieces': '50+ blocks',
      'Weight': '2.1 lbs',
      'Dimensions': '12" x 8" x 6"'
    }
  },
  2: {
    id: 2,
    name: 'Rainbow Water Bottle',
    price: 19.99,
    originalPrice: 24.99,
    rating: 4.9,
    reviewCount: 87,
    category: 'Drink Bottles',
    emoji: '🌈',
    colors: ['#FF6B6B', '#FFD93D', '#6BCF7F', '#4D96FF'],
    colorNames: ['Rainbow Red', 'Sunshine Yellow', 'Nature Green', 'Ocean Blue'],
    images: ['🌈', '💧', '🍃', '✨'],
    description: 'Keep your little one hydrated in style with this magical rainbow water bottle! Features temperature control and a fun design that makes drinking water exciting.',
    features: [
      'BPA-free and safe materials',
      'Keeps drinks cold for 12 hours',
      'Easy-grip design for small hands',
      'Leak-proof cap',
      'Fun rainbow design'
    ],
    specifications: {
      'Age Range': '2+ years',
      'Material': 'Stainless steel',
      'Capacity': '12 oz',
      'Weight': '0.8 lbs',
      'Dimensions': '7.5" x 2.8"'
    }
  }
};

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem, openCart } = useCart();
  
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const product = productData[id as '1' | '2'];

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😅</div>
          <h2 className="text-2xl font-bold mb-4">Product not found</h2>
          <button 
            onClick={() => navigate('/')}
            className="btn-hero"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      emoji: product.emoji,
      selectedColor: product.colors[selectedColorIndex],
      category: product.category
    });
    
    toast({
      title: "Added to cart! 🎉",
      description: `${product.name} has been added to your cart.`,
    });
    
    // Open cart after a short delay
    setTimeout(() => {
      openCart();
    }, 500);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back button */}
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
          {/* Product Images */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Main Image */}
            <div className="relative">
              <motion.div 
                className="w-full h-96 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-3xl flex items-center justify-center text-8xl shadow-card"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                {product.images[selectedImageIndex]}
              </motion.div>
              
              {/* Like button */}
              <motion.button
                className="absolute top-4 right-4 p-3 bg-card/80 backdrop-blur-sm rounded-full shadow-card"
                onClick={() => setIsLiked(!isLiked)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Heart 
                  size={24} 
                  className={`transition-colors ${
                    isLiked ? 'text-secondary fill-current' : 'text-muted-foreground'
                  }`} 
                />
              </motion.button>
            </div>

            {/* Thumbnail Images */}
            <div className="flex space-x-4">
              {product.images.map((image, index) => (
                <motion.button
                  key={index}
                  className={`w-20 h-20 rounded-2xl flex items-center justify-center text-3xl transition-all ${
                    selectedImageIndex === index 
                      ? 'bg-gradient-to-br from-primary/20 to-secondary/20 ring-2 ring-primary' 
                      : 'bg-muted/30 hover:bg-muted/50'
                  }`}
                  onClick={() => setSelectedImageIndex(index)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {image}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Category & Rating */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
                {product.category}
              </span>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={16} 
                      className={`${
                        i < Math.floor(product.rating) 
                          ? 'text-accent fill-current' 
                          : 'text-muted-foreground'
                      }`} 
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  ({product.reviewCount} reviews)
                </span>
              </div>
            </div>

            {/* Name & Price */}
            <div>
              <h1 className="text-4xl font-bold text-foreground font-kids mb-4">
                {product.name}
              </h1>
              <div className="flex items-center space-x-4">
                <span className="text-3xl font-bold text-primary">
                  ${product.price}
                </span>
                {product.originalPrice && (
                  <span className="text-xl text-muted-foreground line-through">
                    ${product.originalPrice}
                  </span>
                )}
                {product.originalPrice && (
                  <span className="bg-success text-success-foreground px-2 py-1 rounded-full text-sm font-semibold">
                    Save ${(product.originalPrice - product.price).toFixed(2)}
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <p className="text-muted-foreground leading-relaxed">
              {product.description}
            </p>

            {/* Color Selection */}
            <div>
              <h3 className="font-semibold text-foreground mb-3">
                Color: {product.colorNames[selectedColorIndex]}
              </h3>
              <div className="flex space-x-3">
                {product.colors.map((color, index) => (
                  <motion.button
                    key={index}
                    className={`w-12 h-12 rounded-full border-4 transition-all ${
                      selectedColorIndex === index 
                        ? 'border-primary scale-110' 
                        : 'border-border hover:border-primary/50'
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => setSelectedColorIndex(index)}
                    whileHover={{ scale: selectedColorIndex === index ? 1.1 : 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  />
                ))}
              </div>
            </div>

            {/* Quantity & Add to Cart */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <span className="font-semibold text-foreground">Quantity:</span>
                <div className="flex items-center border border-border rounded-lg">
                  <button
                    className="p-2 hover:bg-muted transition-colors"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    -
                  </button>
                  <span className="px-4 py-2 border-x border-border min-w-[60px] text-center">
                    {quantity}
                  </span>
                  <button
                    className="p-2 hover:bg-muted transition-colors"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </button>
                </div>
              </div>

              <motion.button
                className="flex-1 btn-cart flex items-center justify-center space-x-3 py-4"
                onClick={handleAddToCart}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <ShoppingCart size={20} />
                <span>Add to Cart</span>
              </motion.button>
            </div>

            {/* Features */}
            <div>
              <h3 className="font-semibold text-foreground mb-3 flex items-center space-x-2">
                <span>✨ Key Features</span>
              </h3>
              <ul className="space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-center space-x-2 text-muted-foreground">
                    <span className="text-success">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Trust badges */}
            <div className="flex items-center justify-between py-6 border-t border-border">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Shield size={16} className="text-success" />
                <span>Safe & Tested</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Truck size={16} className="text-primary" />
                <span>Free Shipping</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <RotateCcw size={16} className="text-secondary" />
                <span>30-Day Returns</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Specifications */}
        <motion.div
          className="mt-16 bg-card rounded-3xl p-8"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h3 className="text-2xl font-bold text-foreground font-kids mb-6">
            Product Specifications
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            {Object.entries(product.specifications).map(([key, value]) => (
              <div key={key} className="flex justify-between items-center py-3 border-b border-border last:border-b-0">
                <span className="font-medium text-foreground">{key}:</span>
                <span className="text-muted-foreground">{value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default ProductDetail;