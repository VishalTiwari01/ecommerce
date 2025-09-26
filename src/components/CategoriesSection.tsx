import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const CategoriesSection = () => {
  const categories = [
    {
      name: 'Toys',
      emoji: '🧸',
      description: 'Educational & Fun Toys',
      color: 'from-primary to-primary-glow',
      path: '/toys'
    },
    {
      name: 'Water Bottles',
      emoji: '💧',
      description: 'Colorful & Safe Bottles',
      color: 'from-secondary to-fun',
      path: '/bottles'
    },
    {
      name: 'Lunch Boxes',
      emoji: '🍱',
      description: 'Healthy Meal Containers',
      color: 'from-accent to-success',
      path: '/lunch-boxes'
    },
    {
      name: 'Backpacks',
      emoji: '🎒',
      description: 'Adventure Ready Bags',
      color: 'from-fun to-secondary',
      path: '/backpacks'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 60,
      scale: 0.8,
      rotateY: -15
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      rotateY: 0,
      transition: {
        duration: 0.6,
        type: "spring" as const,
        stiffness: 100,
        damping: 20
      }
    }
  };

  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/30">
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
            Shop by Category 🌟
          </motion.h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover amazing products designed to spark creativity, learning, and endless fun!
          </p>
        </motion.div>

        {/* Categories Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {categories.map((category, index) => (
            <motion.div
              key={category.name}
              className="group cursor-pointer"
              variants={itemVariants}
              whileHover={{ 
                scale: 1.05,
                rotateY: 5,
                z: 20
              }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div 
                className={`relative h-64 bg-gradient-to-br ${category.color} rounded-3xl p-6 flex flex-col justify-between text-white shadow-card hover:shadow-playful transition-all duration-300 overflow-hidden`}
                whileHover={{
                  rotateX: 5,
                  transition: { duration: 0.3 }
                }}
              >
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-4 right-4 text-6xl opacity-30">
                    {category.emoji}
                  </div>
                  <div className="absolute bottom-4 left-4 text-4xl opacity-20">
                    ✨
                  </div>
                </div>

                {/* Content */}
                <div className="relative z-10">
                  <motion.div 
                    className="text-5xl mb-4"
                    animate={{ 
                      rotate: [0, 10, -10, 0],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ 
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: index * 0.2
                    }}
                  >
                    {category.emoji}
                  </motion.div>
                  
                  <h3 className="text-2xl font-bold font-kids mb-2">
                    {category.name}
                  </h3>
                  <p className="text-white/80 text-sm">
                    {category.description}
                  </p>
                </div>

                {/* Arrow */}
                <motion.div 
                  className="relative z-10 flex justify-end"
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors duration-300">
                    <ArrowRight size={20} />
                  </div>
                </motion.div>

                {/* Hover Effects */}
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                />
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div 
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          {/* <motion.button
            className="btn-hero"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View All Products
            <ArrowRight className="ml-2" size={20} />
          </motion.button> */}
        </motion.div>
      </div>
    </section>
  );
};

export default CategoriesSection;