// src/components/ui/CardCarousel.jsx
"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

import "swiper/css";
import "swiper/css/navigation";

export default function CardCarousel({ items, renderItem, navPrefix }) {
  const prevClass = `carousel-prev-${navPrefix}`;
  const nextClass = `carousel-next-${navPrefix}`;

  return (
    <div className="relative">
      <div className="relative [mask-image:linear-gradient(to_right,black_85%,transparent_100%)] sm:[mask-image:none]">
        <Swiper
          modules={[Navigation]}
          navigation={{ prevEl: `.${prevClass}`, nextEl: `.${nextClass}` }}
          spaceBetween={20}
          slidesPerView={1.15}
          breakpoints={{
            640: { slidesPerView: 2.15, spaceBetween: 20 },
            1024: { slidesPerView: 3.15, spaceBetween: 24 },
            1280: { slidesPerView: 4.15, spaceBetween: 24 },
          }}
        >
          {items.map((item, index) => (
            <SwiperSlide key={item.id || index}>
              {renderItem(item, index)}
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <button className={`${prevClass} hidden sm:flex absolute top-1/2 -left-4 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white dark:bg-gray-900 shadow-lg items-center justify-center text-primary dark:text-white hover:bg-primary hover:text-white transition-colors disabled:opacity-0 disabled:pointer-events-none`} aria-label="Previous">
        <FiChevronLeft className="text-lg" />
      </button>
      <button className={`${nextClass} hidden sm:flex absolute top-1/2 -right-4 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white dark:bg-gray-900 shadow-lg items-center justify-center text-primary dark:text-white hover:bg-primary hover:text-white transition-colors disabled:opacity-0 disabled:pointer-events-none`} aria-label="Next">
        <FiChevronRight className="text-lg" />
      </button>
    </div>
  );
}