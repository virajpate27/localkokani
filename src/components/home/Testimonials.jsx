// src/components/home/Testimonials.jsx
"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { FiStar } from "react-icons/fi";
import Image from "next/image";
import { placeholderTestimonials } from "@/utils/placeholderData";

import "swiper/css";
import "swiper/css/pagination";

export default function Testimonials() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container-custom">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-secondary font-semibold text-sm uppercase tracking-wider">
            Testimonials
          </span>
          <h2 className="section-title mt-2">What Our Guests Say</h2>
        </div>

        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={24}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          autoplay={{ delay: 4500, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          className="pb-16 !px-1"
        >
          {placeholderTestimonials.map((t) => (
            <SwiperSlide key={t.id}>
              <div className="card p-7 h-full flex flex-col">
                <div className="flex gap-1 text-accent mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <FiStar key={i} className="fill-accent" />
                  ))}
                </div>
                <p className="text-gray-600 leading-relaxed flex-1">
                  "{t.text}"
                </p>
                <div className="flex items-center gap-3 mt-6 pt-5 border-t border-gray-100">
                  <div className="relative w-11 h-11 rounded-full overflow-hidden shrink-0">
                    <Image src={t.avatar} alt={t.name} fill className="object-cover" />
                  </div>
                  <div>
                    <p className="font-semibold text-primary text-sm">
                      {t.name}
                    </p>
                    <p className="text-gray-400 text-xs">{t.location}</p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <style jsx global>{`
        .swiper-pagination-bullet-active {
          background: #3193a6 !important;
        }
      `}</style>
    </section>
  );
}