import { motion } from 'framer-motion';
import ProductCard from './ProductCard';

const ProductShowcase = () => {
  const featuredProducts = [
    {
      id: 1,
      name: 'Magic Building Blocks',
      price: 29.99,
      originalPrice: 39.99,
      rating: 4.8,
      category: 'Educational Toys',
      emoji: '🧱',
      colors: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'],
      isNew: true,
      isBestSeller: false
    },
    {
      id: 2,
      name: 'Rainbow Water Bottle',
      price: 19.99,
      rating: 4.9,
      category: 'Drink Bottles',
      emoji: '🌈',
      colors: ['#FF6B6B', '#FFD93D', '#6BCF7F', '#4D96FF'],
      isNew: false,
      isBestSeller: true
    },
    {
      id: 3,
      name: 'Adventure Backpack',
      price: 34.99,
      originalPrice: 44.99,
      rating: 4.7,
      category: 'School Bags',
      emoji: '🎒',
      colors: ['#FF6B6B', '#4ECDC4', '#FFD93D'],
      isNew: false,
      isBestSeller: false
    },
    {
      id: 4,
      name: 'Dinosaur Lunch Box',
      price: 24.99,
      rating: 4.6,
      category: 'Lunch Boxes',
      emoji: '🦕',
      colors: ['#96CEB4', '#FECA57', '#FF9FF3'],
      isNew: true,
      isBestSeller: true
    },
    {
      id: 5,
      name: 'Musical Piano Toy',
      price: 39.99,
      originalPrice: 49.99,
      rating: 4.9,
      category: 'Musical Toys',
      emoji: '🎹',
      colors: ['#FF6B6B', '#4D96FF', '#FFD93D'],
      isNew: false,
      isBestSeller: true
    },
    {
      id: 6,
      name: 'Art Supply Kit',
      price: 27.99,
      rating: 4.8,
      category: 'Creative Toys',
      emoji: '🎨',
      colors: ['#FF6B6B', '#96CEB4', '#FFD93D', '#4ECDC4'],
      isNew: true,
      isBestSeller: false
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-muted/30 to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.h2 
            className="text-4xl md:text-5xl font-bold font-kids gradient-text mb-4"
            animate={{ 
              backgroundPosition: ["0%", "100%", "0%"]
            }}
            transition={{ 
              duration: 4,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            Featured Products ⭐
          </motion.h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Hand-picked favorites that kids love and parents trust!
          </p>
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProducts.map((product, index) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              index={index}
            />
          ))}
        </div>

        {/* Bottom Action */}
        <motion.div 
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <motion.button
            className="btn-fun"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            See All Products 🎉
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default ProductShowcase;