import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

const banners = [
  {
    id: 1,
    img: "https://images.pexels.com/photos/5705586/pexels-photo-5705586.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
    title: "Little Explorer",
    subtitle: "Adventure starts with imagination 🌈",
  },
  {
    id: 2,
    img: "https://images.pexels.com/photos/8470014/pexels-photo-8470014.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
    title: "Splash Time",
    subtitle: "Water play and summer fun 💦",
  },
  {
    id: 3,
    img: "https://images.pexels.com/photos/8612964/pexels-photo-8612964.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
    title: "Creative Minds",
    subtitle: "Art, colors, and big ideas 🎨",
  },
];


const BannerCarousel = () => {
  return (
    <div className="w-full h-80 md:h-[400px] relative overflow-hidden">
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        spaceBetween={0}
        slidesPerView={1}
        loop={true}
        autoplay={{ delay: 3000 }}
        pagination={{ clickable: true }}
        effect="fade"
        className="w-full h-full"
      >
        {banners.map((banner) => (
          <SwiperSlide key={banner.id}>
            <div className="w-full h-full relative">
              {/* Background Image */}
              <img
                src={banner.img}
                alt={banner.title}
                className="w-full h-full object-cover"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/30" />

              {/* Text */}
              
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default BannerCarousel;
