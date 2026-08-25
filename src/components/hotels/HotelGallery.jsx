// src/components/hotels/HotelGallery.jsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs, FreeMode } from "swiper/modules";
import { FiX } from "react-icons/fi";
import { getOptimizedUrl } from "@/lib/cloudinary";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import "swiper/css/free-mode";

export default function HotelGallery({ images = [], hotelName }) {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") setLightboxOpen(false);
    };
    if (lightboxOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden"; // prevent background scroll
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [lightboxOpen]);



  const galleryImages = images.length > 0
    ? images
    : [{ url: "/placeholder-hotel.jpg" }];

  return (
    <>
      <div className="rounded-2xl overflow-hidden">
        <Swiper
          modules={[Navigation, Thumbs]}
          navigation
          thumbs={{ swiper: thumbsSwiper }}
          onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
          className="aspect-[16/9] rounded-2xl main-gallery-swiper"
        >
          {galleryImages.map((img, i) => (
            <SwiperSlide key={i}>
              <button
                onClick={() => setLightboxOpen(true)}
                className="relative w-full h-full block cursor-zoom-in"
                 aria-label={`View larger image ${i + 1} of ${galleryImages.length}`}
              >
                <Image
                  src={getOptimizedUrl(img.url, { width: 1200 })}
                  alt={`${hotelName} - photo ${i + 1}`}
                  fill
                  priority={i === 0}
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover"
                />
              </button>
            </SwiperSlide>
          ))}
        </Swiper>

        {galleryImages.length > 1 && (
          <Swiper
            modules={[FreeMode, Thumbs]}
            onSwiper={setThumbsSwiper}
            freeMode
            watchSlidesProgress
            slidesPerView={5}
            spaceBetween={8}
            className="mt-2 h-20"
          >
            {galleryImages.map((img, i) => (
              <SwiperSlide key={i} className="cursor-pointer rounded-lg overflow-hidden opacity-60 hover:opacity-100 transition-opacity [&.swiper-slide-thumb-active]:opacity-100">
                <div className="relative w-full h-full">
                  <Image
                    src={getOptimizedUrl(img.url, { width: 150 })}
                    alt={`Thumbnail ${i + 1}`}
                    fill
                    sizes="120px"
                    className="object-cover"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 pb-safe">
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-6 right-6 text-white text-3xl z-10"
            aria-label="Close gallery"
          >
            <FiX />
          </button>
          <div className="relative w-full max-w-5xl aspect-[16/9]">
            <Image
              src={galleryImages[activeIndex]?.url}
              alt={hotelName}
              fill
              sizes="100vw"
              className="object-contain"
            />
          </div>
        </div>
      )}

      <style jsx global>{`
        .main-gallery-swiper .swiper-button-next,
        .main-gallery-swiper .swiper-button-prev {
          color: white;
          background: rgba(30, 59, 108, 0.6);
          width: 40px;
          height: 40px;
          border-radius: 9999px;
        }

        .main-gallery-swiper .swiper-navigation-icon{
        width: 10px;
        }


        .main-gallery-swiper .swiper-button-next::after,
        .main-gallery-swiper .swiper-button-prev::after {
          font-size: 16px;
        }
      `}</style>
    </>
  );
}