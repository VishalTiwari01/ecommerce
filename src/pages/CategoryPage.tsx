import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

import ProductCard from '../components/ProductCard';
import { getAllProducts } from '../APi/api.js'; // ✅ Import your API function
import { Grid, List } from 'lucide-react';

const CategoryPage = () => {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState('grid');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch products from API on mount
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const data = await getAllProducts();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter by category param (route param)
  const getFilteredProducts = () => {
    if (!category) return products;

    switch (category) {
      case 'bestsellers':
        return products.filter((p) => p.isFeatured || p.isBestSeller);
      default:
        return products.filter((p) => p.categoryId?.toLowerCase() === category.toLowerCase());
    }
  };

  const filteredProducts = getFilteredProducts();

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'price') return a.price - b.price;
    return 0;
  });

  return (
    <motion.section
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <h1 className="text-3xl font-bold mb-6 capitalize">
        {category ? category.replace('-', ' ') : 'All Products'}
      </h1>

      {/* Loading and error states */}
      {loading ? (
        <p>Loading products...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <>
          {/* Controls */}
          <div className="flex justify-between items-center mb-8">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-border rounded-md p-2 bg-card"
            >
              <option value="name">Sort by Name</option>
              <option value="price">Sort by Price</option>
            </select>

            <div className="flex space-x-4 text-foreground cursor-pointer">
              <Grid
                size={24}
                className={viewMode === 'grid' ? 'text-primary' : ''}
                onClick={() => setViewMode('grid')}
              />
              <List
                size={24}
                className={viewMode === 'list' ? 'text-primary' : ''}
                onClick={() => setViewMode('list')}
              />
            </div>
          </div>

          {/* Products View */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {sortedProducts.length > 0 ? (
                sortedProducts.map((product) => (
                  <ProductCard key={product._id || product.id} product={product} />
                ))
              ) : (
                <p>No products found in this category.</p>
              )}
            </div>
          ) : (
            <div className="flex flex-col space-y-4">
              {sortedProducts.length > 0 ? (
                sortedProducts.map((product) => (
                  <ProductCard key={product._id || product.id} product={product} viewMode="list" />
                ))
              ) : (
                <p>No products found in this category.</p>
              )}
            </div>
          )}
        </>
      )}
    </motion.section>
  );
};

export default CategoryPage;
