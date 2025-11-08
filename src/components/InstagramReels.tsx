import React, { useState } from "react";
import { motion } from "framer-motion";
import { Instagram, ExternalLink } from "lucide-react";

const InstagramReels = () => {
  const [reels] = useState([
    {
      id: "1",
      code: "DPY83OJD_l0",
      url: "https://www.instagram.com/reel/DPY83OJD_l0/embed",
      link: "https://www.instagram.com/reel/DPY83OJD_l0/",
      caption: "Demo reel 1",
    },
    {
      id: "2",
      code: "DPUeGPPD7Zz",
      url: "https://www.instagram.com/reel/DPUeGPPD7Zz/embed",
      link: "https://www.instagram.com/reel/DPUeGPPD7Zz/",
      caption: "Demo reel 2",
    },
    {
      id: "3",
      code: "DPRwMBvj5bn",
      url: "https://www.instagram.com/reel/DPRwMBvj5bn/embed",
      link: "https://www.instagram.com/reel/DPRwMBvj5bn/",
      caption: "Demo reel 3",
    },
  ]);

  const username = "anujgunjeta193_";

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50, rotateX: -15 },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        duration: 0.6,
        type: "spring",
        stiffness: 100,
      },
    },
  };

  return (
    <section className="min-h-screen py-20 bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-flex items-center gap-3 mb-4"
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <div className="bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 p-3 rounded-2xl shadow-lg">
              <Instagram size={32} color="white" />
            </div>
          </motion.div>

          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
            Latest Instagram Reels
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-6">
            Check out the newest reels from @{username}
          </p>

          <motion.a
            href={`https://www.instagram.com/${username}/reels/`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label={`View all reels of ${username} on Instagram`}
          >
            View All Reels
            <ExternalLink size={18} />
          </motion.a>
        </motion.div>

        {/* Reels Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {reels.map((reel, index) => (
            <motion.div
              key={reel.id}
              variants={cardVariants}
              whileHover={{
                scale: 1.03,
                rotateY: 5,
                transition: { duration: 0.3 },
              }}
              className="relative group"
            >
              <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-transparent hover:border-pink-400 transition-all duration-300">
                {/* Gradient Border Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-400 via-pink-400 to-orange-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-3xl" />

                {/* Instagram Badge */}
                <motion.div
                  className="absolute top-4 right-4 z-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full p-2 shadow-lg"
                  animate={{
                    rotate: [0, 10, -10, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: index * 0.3,
                  }}
                >
                  <Instagram size={20} color="white" />
                </motion.div>

                {/* Reel Number Badge */}
                <div className="absolute top-4 left-4 z-10 bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-semibold">
                  Reel #{index + 1}
                </div>

                {/* Reel Iframe */}
                <div className="relative aspect-video">
                  <iframe
                    src={reel.url}
                    width="100%"
                    height="600"
                    frameBorder="0"
                    allowFullScreen
                    loading="lazy"
                    title={`Instagram Reel ${index + 1}`}
                    className="w-full"
                    allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                  />
                </div>

                {/* View Original Link Overlay */}
                <motion.a
                  href={reel.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute bottom-4 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg flex items-center gap-2 text-sm font-semibold text-gray-800 hover:bg-white"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label={`View Reel #${index + 1} on Instagram`}
                >
                  <ExternalLink size={16} />
                  View on Instagram
                </motion.a>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default InstagramReels;
