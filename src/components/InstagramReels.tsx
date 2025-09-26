// // src/components/InstagramReels.js
// import React from "react";
// import { Swiper, SwiperSlide } from "swiper/react";
// import "swiper/css";

// const dummyReels = [
//   "https://www.instagram.com/reel/CvQeBrsj6BQ/embed",
//   "https://www.instagram.com/reel/CvLezChjVFn/embed",
//   "https://www.instagram.com/reel/CvE-5dYj1ZD/embed",
//   "https://www.instagram.com/reel/Cu5yZtMjiGQ/embed",
//   "https://www.instagram.com/reel/CuoxNm1jSRu/embed",
//   "https://www.instagram.com/reel/CujrrVhjUtV/embed",
//   "https://www.instagram.com/reel/CudmcHlJeFH/embed",
//   "https://www.instagram.com/reel/CuXFJG5jkSl/embed",
//   "https://www.instagram.com/reel/CuU0KOVj4Ps/embed",
//   "https://www.instagram.com/reel/CuL6v51DVw6/embed",
// ];

// const InstagramReels = () => {
//   return (
//     <div className="max-w-5xl mx-auto p-4">
//       <h2 className="text-xl font-semibold mb-4 text-center">Instagram Reels</h2>
//       <Swiper
//         spaceBetween={16}
//         slidesPerView={3}
//         grabCursor={true}
//         breakpoints={{
//           640: {
//             slidesPerView: 1,
//           },
//           768: {
//             slidesPerView: 2,
//           },
//           1024: {
//             slidesPerView: 3,
//           },
//         }}
//       >
//         {dummyReels.map((url, index) => (
//           <SwiperSlide key={index}>
//             <iframe
//               src={url}
//               width="320"
//               height="560"
//               frameBorder="0"
//               allowFullScreen
//               title={`Instagram Reel ${index + 1}`}
//               loading="lazy"
//               style={{ borderRadius: "12px" }}
//             ></iframe>
//           </SwiperSlide>
//         ))}
//       </Swiper>
//     </div>
//   );
// };

// export default InstagramReels;
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { motion } from "framer-motion";
import { Instagram } from "lucide-react"; // Using an Instagram icon from lucide-react for flair

const dummyReels = [
  "https://www.instagram.com/reel/CvQeBrsj6BQ/embed",
  "https://www.instagram.com/reel/CvLezChjVFn/embed",
  "https://www.instagram.com/reel/CvE-5dYj1ZD/embed",
  "https://www.instagram.com/reel/Cu5yZtMjiGQ/embed",
  "https://www.instagram.com/reel/CuoxNm1jSRu/embed",
  "https://www.instagram.com/reel/CujrrVhjUtV/embed",
  "https://www.instagram.com/reel/CudmcHlJeFH/embed",
  "https://www.instagram.com/reel/CuXFJG5jkSl/embed",
  "https://www.instagram.com/reel/CuU0KOVj4Ps/embed",
  "https://www.instagram.com/reel/CuL6v51DVw6/embed",
];

const containerVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      staggerChildren: 0.15, 
      delayChildren: 0.2,
      when: "beforeChildren"
    }
  }
};

const slideVariants = {
  hidden: { opacity: 0, scale: 0.8, rotateY: -15 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    rotateY: 0,
    transition: {
      duration: 0.5,
      type: "spring",
      stiffness: 90,
      damping: 20
    }
  }
};

const InstagramReels = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-6 sm:px-12">
        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.h2 
            className="text-4xl md:text-5xl font-bold mb-4 text-gradient bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 bg-clip-text text-transparent"
            animate={{ backgroundPosition: ["0%", "100%", "0%"] }}
            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
          >
            Scroll Through Instagram Reels
          </motion.h2>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">
            Enjoy a curated selection of fun, inspiring Instagram Reels — scroll horizontally!
          </p>
        </motion.div>

        {/* Swiper container with animation */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <Swiper
            spaceBetween={20}
            slidesPerView={3}
            grabCursor={true}
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
          >
            {dummyReels.map((url, index) => (
              <SwiperSlide key={index}>
                <motion.div
                  variants={slideVariants}
                  whileHover={{ scale: 1.05, rotateY: 5, zIndex: 10 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative rounded-2xl shadow-lg overflow-hidden cursor-pointer bg-white"
                >
                  {/* Instagram Icon overlay */}
                  <motion.div 
                    className="absolute top-3 right-3 bg-pink-500 rounded-full p-1.5 shadow-md"
                    animate={{
                      rotate: [0, 15, -15, 0],
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: index * 0.3,
                    }}
                  >
                    <Instagram size={24} color="white" />
                  </motion.div>

                  {/* Reel iframe */}
                  <iframe
                    src={url}
                    width="320"
                    height="560"
                    frameBorder="0"
                    allowFullScreen
                    loading="lazy"
                    title={`Instagram Reel ${index + 1}`}
                    className="rounded-2xl"
                  />
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>
      </div>
    </section>
  );
};

export default InstagramReels;
