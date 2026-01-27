"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

// Import Swiper styles
import "swiper/css/pagination";
import "swiper/css";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Promotion } from "@/types/promotion";

interface HeroCarouselProps {
  promotions?: Promotion[];
  locale?: string;
}

const HeroCarousel = ({ promotions = [], locale = "uk" }: HeroCarouselProps) => {
  const t = useTranslations("Home.Hero");

  // If no promotions, show empty state
  if (promotions.length === 0) {
    return (
      <div className="flex items-center justify-center py-24 px-8">
        <div className="text-center">
          <h2 className="font-semibold text-onyx text-2xl mb-3">
            {locale === "uk" ? "Listopad" : "Listopad"}
          </h2>
          <p className="text-slate">
            {locale === "uk"
              ? "Відкрийте для себе моду"
              : "Discover fashion"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <Swiper
      spaceBetween={30}
      centeredSlides={true}
      autoplay={{
        delay: 4000,
        disableOnInteraction: false,
      }}
      pagination={{
        clickable: true,
      }}
      modules={[Autoplay, Pagination]}
      className="hero-carousel"
    >
      {promotions.map((promo) => (
        <SwiperSlide key={promo.id}>
          <div className="flex items-center pt-6 sm:pt-0 flex-col-reverse sm:flex-row">
            <div className="max-w-[394px] py-10 sm:py-15 lg:py-24.5 pl-4 sm:pl-7.5 lg:pl-12.5">
              {promo.discount_text && (
                <div className="flex items-center gap-4 mb-7.5 sm:mb-10">
                  <span className="block font-semibold text-heading-3 sm:text-heading-1 text-darkslate">
                    {promo.discount_text}
                  </span>
                </div>
              )}

              <h1 className="font-semibold text-onyx text-xl sm:text-3xl mb-3">
                {locale === "uk" ? promo.title_uk : promo.title_en}
              </h1>

              {(promo.subtitle_uk || promo.subtitle_en) && (
                <p className="text-slate">
                  {locale === "uk" ? promo.subtitle_uk : promo.subtitle_en}
                </p>
              )}

              {promo.link_url && (
                <a
                  href={promo.link_url}
                  className="inline-flex font-medium text-white text-custom-sm rounded-md bg-dark py-3 px-9 ease-out duration-200 hover:bg-malachite mt-10"
                >
                  {t("shopNow") || "Shop Now"}
                </a>
              )}
            </div>

            {promo.image_url && (
              <div>
                <Image
                  src={promo.image_url}
                  alt={locale === "uk" ? promo.title_uk : promo.title_en}
                  width={351}
                  height={358}
                />
              </div>
            )}
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default HeroCarousel;
