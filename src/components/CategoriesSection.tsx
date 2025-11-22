import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const CategoriesSection = () => {
  const categories = [
    {
      name: 'Toys',
      emoji: '🧸',
      description: 'Educational & Fun Toys',
      color: 'from-primary to-primary-glow',
      path: '/category/toy'
    },
    {
      name: 'Water Bottles',
      emoji: '💧',
      description: 'Colorful & Safe Bottles',
      color: 'from-secondary to-fun',
      path: '/category/bottle'
    },
    {
      name: 'Lunch Boxes',
      emoji: '🍱',
      description: 'Healthy Meal Containers',
      color: 'from-accent to-success',
      path: '/category/lunch-box'
    },
    {
      name: 'Backpacks',
      emoji: '🎒',
      description: 'Adventure Ready Bags',
      color: 'from-fun to-secondary',
      path: '/category/bag'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 60, scale: 0.8, rotateY: -15 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      rotateY: 0,
      transition: {
        duration: 0.6,
        type: "spring",
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
            animate={{ backgroundPosition: ["0%", "100%", "0%"] }}
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

        {/* Circular Categories Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 place-items-center"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {categories.map((category, index) => (
            <motion.div
              key={category.name}
              variants={itemVariants}
            >
              <Link to={category.path}>
                <motion.div
                  className={`
                    relative w-56 h-56 rounded-full p-6 
                    bg-gradient-to-br ${category.color}
                    shadow-[0_10px_30px_rgba(0,0,0,0.25)]
                    hover:shadow-[0_15px_40px_rgba(0,0,0,0.35)]
                    transition-all duration-500 
                    flex flex-col items-center justify-center 
                    overflow-hidden cursor-pointer group
                  `}
                  whileHover={{
                    scale: 1.12,
                    rotateX: 6,
                    rotateY: 6,
                    transition: { duration: 0.4 }
                  }}
                  whileTap={{ scale: 0.96 }}
                >
                  {/* Glow Ring */}
                  <div className="absolute inset-0 rounded-full bg-white/10 blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-500" />

                  {/* Inner Glass Border */}
                  <div className="absolute inset-4 rounded-full border border-white/20 backdrop-blur-sm"></div>

                  {/* Floating Emoji */}
                  <motion.div
                    className="text-6xl relative z-20"
                    animate={{
                      y: [0, -8, 0],
                      rotate: [0, 8, -8, 0]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: index * 0.3
                    }}
                  >
                    {category.emoji}
                  </motion.div>

                  {/* Text */}
                  <div className="text-center relative z-20 mt-3">
                    <h3 className="text-xl font-bold font-kids text-white drop-shadow-lg">
                      {category.name}
                    </h3>
                    <p className="text-white/80 text-sm mt-1">
                      {category.description}
                    </p>
                  </div>

                  {/* Hover Tint */}
                  <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-30 transition-opacity duration-500 rounded-full"></div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
};

export default CategoriesSection;
