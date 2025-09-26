import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState } from 'react';

import ProductCard from '../components/ProductCard';
import { products, getProductsByCategory, getProductsByAgeRange } from '../data/products';
import { Filter, Grid, List } from 'lucide-react';

const CategoryPage = () => {
  const { category } = useParams();
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Get products based on category
  const getFilteredProducts = () => {
    if (!category) return products;
    
    switch (category) {
      case '0-3':
      case '4-7':
      case '8-12':
        return getProductsByAgeRange(category);
      case 'bestsellers':
        return products.filter(p => p.isBestSeller);
      case 'toys':
        return getProductsByCategory('toys');
      case 'bottles':
        return getProductsByCategory('water bottles');
      case 'backpacks':
        return getProductsByCategory('backpacks');
      case 'arts':
        return getProductsByCategory('arts');
      default:
        return products;
    }
  };

  const filteredProducts = getFilteredProducts();

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'name':
      default:
        return a.name.localeCompare(b.name);
    }
  });

  const getCategoryTitle = () => {
    switch (category) {
      case '0-3':
        return 'Ages 0-3 Years';
      case '4-7':
        return 'Ages 4-7 Years';
      case '8-12':
        return 'Ages 8-12 Years';
      case 'bestsellers':
        return 'Best Sellers';
      case 'toys':
        return 'Educational Toys';
      case 'bottles':
        return 'Water Bottles';
      case 'backpacks':
        return 'Adventure Backpacks';
      case 'arts':
        return 'Arts & Crafts';
      default:
        return 'All Products';
    }
  };

  const getCategoryEmoji = () => {
    switch (category) {
      case '0-3':
        return '👶';
      case '4-7':
        return '🧒';
      case '8-12':
        return '👦';
      case 'bestsellers':
        return '🏆';
      case 'toys':
        return '🧸';
      case 'bottles':
        return '🍼';
      case 'backpacks':
        return '🎒';
      case 'arts':
        return '🎨';
      default:
        return '🛍️';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          
          <h1 className="text-5xl font-bold font-kids text-primary mb-4">
            {getCategoryTitle()}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover amazing products perfect for every adventure and learning moment!
          </p>
        </motion.div>

        {/* Filters and Sort */}
        <motion.div
          className="flex flex-col sm:flex-row justify-between items-center mb-8 space-y-4 sm:space-y-0"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex items-center space-x-4">
            <span className="text-foreground font-medium">
              {sortedProducts.length} products found
            </span>
            <div className="flex items-center space-x-2">
              <Filter size={18} className="text-muted-foreground" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-card border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="name">Sort by Name</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              <Grid size={18} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              <List size={18} />
            </button>
          </div>
        </motion.div>

        {/* Products Grid */}
        {sortedProducts.length > 0 ? (
          <motion.div
            className={`grid gap-8 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {sortedProducts.map((product, index) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                index={index}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="text-6xl mb-4">😅</div>
            <h3 className="text-2xl font-bold text-foreground mb-2 font-kids">
              No products found
            </h3>
            <p className="text-muted-foreground">
              Try adjusting your filters or explore other categories.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;