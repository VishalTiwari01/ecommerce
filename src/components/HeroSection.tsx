import { motion } from 'framer-motion';
import { ArrowRight, Star, Heart } from 'lucide-react';

const HeroSection = () => {
  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        delay: 0.8,
        duration: 0.5,
        type: "spring" as const,
        stiffness: 300,
        damping: 20
      }
    },
    hover: {
      scale: 1.05,
      transition: { duration: 0.2 }
    }
  };

  const floatingElements = [
    { emoji: "🎈", delay: 0, x: 20, y: 20 },
    { emoji: "⭐", delay: 1, x: -30, y: 40 },
    { emoji: "🌈", delay: 2, x: 40, y: -20 },
    { emoji: "🎨", delay: 1.5, x: -20, y: -30 },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-primary/5 to-secondary/10 overflow-hidden">
      {/* Floating Emojis */}
      {floatingElements.map((element, index) => (
        <motion.div
          key={index}
          className="absolute text-4xl opacity-20"
          style={{ left: `${20 + element.x}%`, top: `${30 + element.y}%` }}
          animate={{
            y: [0, -20, 0],
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 4,
            delay: element.delay,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {element.emoji}
        </motion.div>
      ))}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Text Content */}
          <div className="text-center lg:text-left">
            <motion.div
              className="flex items-center justify-center lg:justify-start space-x-2 mb-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Star className="text-accent fill-current" size={24} />
              <span className="text-accent font-semibold">Premium Kids Products</span>
              <Heart className="text-secondary fill-current" size={24} />
            </motion.div>

            <motion.h1
              className="text-5xl md:text-7xl font-bold font-kids mb-6 leading-tight"
              initial="hidden"
              animate="visible"
            >
              <motion.span
                className="block bg-gradient-to-r from-[#7A6A9C] to-[#BBA0D4] bg-clip-text text-transparent"
                initial="hidden"
                animate="visible"
                variants={textVariants}
              >
                Explore Fun &
              </motion.span>
              <motion.span
                className="block bg-gradient-to-r from-[#7A6A9C] to-[#BBA0D4] bg-clip-text text-transparent"
                initial="hidden"
                animate="visible"
                variants={textVariants}
              >
                Functional Kids
              </motion.span>
              <motion.span
                className="text-primary block"
                initial="hidden"
                animate="visible"
                variants={textVariants}
              >
                Products! 🎉
              </motion.span>
            </motion.h1>

            <motion.p
              className="text-xl text-muted-foreground mb-8 max-w-lg mx-auto lg:mx-0"
              initial="hidden"
              animate="visible"
              variants={textVariants}
              transition={{ delay: 0.3 }}
            >
              Discover magical toys, colorful water bottles, and amazing products that spark imagination and make learning fun!
            </motion.p>

            {/* Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              initial="hidden"
              animate="visible"
              variants={buttonVariants}
            >
              {/* Updated Button with #F7D2CF */}
              <motion.button
                className="px-6 py-3 rounded-full font-semibold text-black bg-[#F7D2CF] shadow-md hover:brightness-110 transition group"
                variants={buttonVariants}
                whileHover="hover"
                whileTap={{ scale: 0.95 }}
              >
                Shop Now
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-200" size={20} />
              </motion.button>

              {/* Secondary Button */}
              <motion.button
                className="btn-fun border border-primary text-primary px-6 py-3 rounded-full font-semibold hover:bg-primary/10 transition"
                variants={buttonVariants}
                whileHover="hover"
                whileTap={{ scale: 0.95 }}
              >
                Discover More ✨
              </motion.button>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              className="mt-12 flex items-center justify-center lg:justify-start space-x-8 text-sm text-muted-foreground"
              initial="hidden"
              animate="visible"
              variants={textVariants}
              transition={{ delay: 1.2 }}
            >
              <div className="flex items-center space-x-1">
                <span className="text-accent">★★★★★</span>
                <span>1000+ Happy Kids</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-success">✓</span>
                <span>Safe & Tested</span>
              </div>
            </motion.div>
          </div>

          {/* Right Image Area */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.8, x: 100 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.4,
              type: "spring",
              stiffness: 100,
              damping: 20
            }}
          >
            <motion.div
              className="relative w-full max-w-lg mx-auto"
              animate={{
                y: [0, -20, 0],
                rotate: [0, 2, -2, 0]
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <div className="w-full h-96 bg-gradient-to-br from-primary/20 via-secondary/20 to-fun/20 rounded-3xl flex items-center justify-center relative overflow-hidden shadow-playful">
                <motion.div
                  className="text-9xl"
                  animate={{
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  🧸
                </motion.div>

                {/* Floating Stars/Bubbles */}
                <motion.div
                  className="absolute top-4 right-4 text-3xl"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                >
                  ⭐
                </motion.div>
                <motion.div
                  className="absolute bottom-4 left-4 text-3xl"
                  animate={{
                    y: [0, -10, 0],
                    x: [0, 5, 0]
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  🎈
                </motion.div>
              </div>

              {/* Floating bubbles */}
              <motion.div
                className="absolute -top-6 -left-6 w-20 h-20 bg-gradient-to-r from-accent to-success rounded-full flex items-center justify-center shadow-glow"
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 180, 360]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <span className="text-2xl">🎨</span>
              </motion.div>

              <motion.div
                className="absolute -bottom-6 -right-6 w-16 h-16 bg-gradient-to-r from-secondary to-primary rounded-full flex items-center justify-center shadow-glow"
                animate={{
                  y: [0, -15, 0],
                  rotate: [0, -180, -360]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <span className="text-xl">🌈</span>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
