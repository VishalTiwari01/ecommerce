import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Instagram, ExternalLink, Loader2, AlertCircle } from "lucide-react";

const InstagramReels = () => {
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Instagram username
  const username = "anujgunjeta193_";

  useEffect(() => {
    fetchReels();
  }, []);

  const fetchReels = async () => {
    try {
      setLoading(true);
      setError(null);

      const url = `https://instagram-scraper-stable-api.p.rapidapi.com/user-reels`;

      const options = {
        method: "POST",
        headers: {
          "x-rapidapi-key": process.env.REACT_APP_RAPIDAPI_KEY,
          "x-rapidapi-host": "instagram-scraper-stable-api.p.rapidapi.com",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          max_id: "",
        }),
      };

      const response = await fetch(url, options);

      if (!response.ok) {
        throw new Error("Failed to fetch reels. Please check your API key.");
      }

      const data = await response.json();

      if (data && data.items && data.items.length > 0) {
        const latestReels = data.items.slice(0, 3).map((item) => ({
          id: item.id,
          code: item.code,
          url: `https://www.instagram.com/reel/${item.code}/embed`,
          link: `https://www.instagram.com/reel/${item.code}/`,
          thumbnail: item.thumbnail_url || item.display_url,
          caption: item.caption?.text || "",
        }));
        setReels(latestReels);
      } else {
        throw new Error("No reels found");
      }
    } catch (err) {
      console.error("Error fetching reels:", err);
      setError(err.message);

      // Fallback demo reels
      setReels([
        {
          id: "1",
          code: "DPY83OJD_l0",
          url: "https://www.instagram.com/reel/DPY83OJD_l0/embed",
          link: "https://www.instagram.com/reel/DPY83OJD_l0/",
        },
        {
          id: "2",
          code: "DPUeGPPD7Zz",
          url: "https://www.instagram.com/reel/DPUeGPPD7Zz/embed",
          link: "https://www.instagram.com/reel/DPUeGPPD7Zz/",
        },
        {
          id: "3",
          code: "DPRwMBvj5bn",
          url: "https://www.instagram.com/reel/DPRwMBvj5bn/embed",
          link: "https://www.instagram.com/reel/DPRwMBvj5bn/",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

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

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="animate-spin text-purple-500 mb-4" size={48} />
            <p className="text-gray-600 text-lg">Fetching latest reels...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <motion.div
            className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-6 mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="flex flex-col gap-3">
              <div className="flex items-start gap-3">
                <AlertCircle
                  className="text-yellow-600 flex-shrink-0 mt-1"
                  size={24}
                />
                <div>
                  <h3 className="font-semibold text-yellow-900 mb-2">
                    API Setup Required
                  </h3>
                  <p className="text-yellow-800 text-sm mb-3">
                    {error}. Showing demo reels instead.
                  </p>
                  <p className="text-yellow-700 text-xs">
                    To enable automatic fetching, sign up at RapidAPI and
                    replace YOUR_RAPIDAPI_KEY_HERE in the code.
                  </p>
                </div>
              </div>
              <button
                onClick={fetchReels}
                className="self-start px-4 py-2 bg-yellow-400 text-yellow-900 rounded font-semibold hover:bg-yellow-500 transition"
                aria-label="Retry fetching Instagram reels"
              >
                Retry
              </button>
            </div>
          </motion.div>
        )}

        {/* Reels Grid */}
        {!loading && reels.length > 0 && (
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
                {/* Card Container */}
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

                  {/* Reel Iframe Responsive */}
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
        )}

        {/* Setup Instructions */}
        <motion.div
          className="mt-16 bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg max-w-3xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <h3 className="text-2xl font-bold mb-4 text-gray-800">
            🚀 Setup Instructions
          </h3>
          <div className="space-y-4 text-gray-700">
            <div className="flex gap-3">
              <span className="font-bold text-purple-600">1.</span>
              <div>
                <p className="font-semibold">Sign up for RapidAPI</p>
                <p className="text-sm text-gray-600">
                  Visit{" "}
                  <a
                    href="https://rapidapi.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-600 hover:underline"
                  >
                    rapidapi.com
                  </a>{" "}
                  and create a free account
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="font-bold text-purple-600">2.</span>
              <div>
                <p className="font-semibold">
                  Subscribe to Instagram Scraper API
                </p>
                <p className="text-sm text-gray-600">
                  Search for "Instagram Scraper Stable API" and subscribe to the
                  free plan
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="font-bold text-purple-600">3.</span>
              <div>
                <p className="font-semibold">Get Your API Key</p>
                <p className="text-sm text-gray-600">
                  Copy your RapidAPI key from the dashboard
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="font-bold text-purple-600">4.</span>
              <div>
                <p className="font-semibold">Replace API Key in Code</p>
                <p className="text-sm text-gray-600">
                  Find{" "}
                  <code className="bg-gray-100 px-2 py-1 rounded">
                    YOUR_RAPIDAPI_KEY_HERE
                  </code>{" "}
                  and replace with your actual key
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-purple-50 rounded-xl border-2 border-purple-200">
            <p className="text-sm text-purple-900">
              <strong>Free Tier:</strong> RapidAPI offers a free plan with
              limited requests per month. Perfect for personal projects!
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default InstagramReels;
