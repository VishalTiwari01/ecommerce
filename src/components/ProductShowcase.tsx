import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
<<<<<<< HEAD
import { getAllProducts } from '../APi/api';
=======
import { getAllProducts } from '../APi/api.js';
>>>>>>> a46b4ab371898fedd3bb5341b057dde24d61c421
import { toast } from '../hooks/use-toast';

const ProductShowcase = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const fetchedProducts = await getAllProducts();
        setProducts(fetchedProducts);
        console.log('Fetched products:', fetchedProducts);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError(err.message);
        toast({
          title: "Error fetching products",
          description: err.message,
          variant: "destructive",
        });
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <p>Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-40 text-red-500">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-b from-muted/30 to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.h2 
            className="text-4xl md:text-5xl font-bold font-kids gradient-text mb-4"
            animate={{ backgroundPosition: ["0%", "100%", "0%"] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          >
            Featured Products ⭐
          </motion.h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Hand-picked favorites that kids love and parents trust!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <ProductCard 
              key={product._id} 
              product={product} 
              index={index}
            />
          ))}
        </div>

        {/* <motion.div 
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
            
          </motion.button>
        </motion.div> */}
      </div>
    </section>
  );
};

export default ProductShowcase;