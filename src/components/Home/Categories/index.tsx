"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { useCallback, useRef, useEffect } from "react";
import { Category } from "@/types/category";
import { useTranslations } from "next-intl";
import { TagIcon, ChevronLeftIcon, ChevronRightIcon } from "@/components/Icons";

// Import Swiper styles
import "swiper/css/navigation";
import "swiper/css";
import SingleItem from "./SingleItem";

interface CategoriesProps {
  categories: Category[];
}

const Categories = ({ categories }: CategoriesProps) => {
  const t = useTranslations("Home.Categories");
  const sliderRef = useRef(null);

  const handlePrev = useCallback(() => {
    if (!sliderRef.current) return;
    sliderRef.current.swiper.slidePrev();
  }, []);

  const handleNext = useCallback(() => {
    if (!sliderRef.current) return;
    sliderRef.current.swiper.slideNext();
  }, []);

  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.swiper.init();
    }
  }, []);

  return (
    <section className="overflow-hidden pt-17.5">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0 pb-15 border-b border-champagne-400">
        <div className="swiper categories-carousel common-carousel">
          {/* <!-- section title --> */}
          <div className="mb-10 flex items-center justify-between">
            <div>
              <span className="flex items-center gap-2.5 font-medium text-onyx mb-1.5">
                <span className="text-malachite">
                  <TagIcon />
                </span>
                {t("subtitle")}
              </span>
              <h2 className="font-semibold text-xl xl:text-heading-5 text-onyx">
                {t("title")}
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <button onClick={handlePrev} className="swiper-button-prev">
                <ChevronLeftIcon />
              </button>

              <button onClick={handleNext} className="swiper-button-next">
                <ChevronRightIcon />
              </button>
            </div>
          </div>

          <Swiper
            ref={sliderRef}
            slidesPerView={6}
            breakpoints={{
              // when window width is >= 640px
              0: {
                slidesPerView: 2,
              },
              1000: {
                slidesPerView: 4,
                // spaceBetween: 4,
              },
              // when window width is >= 768px
              1200: {
                slidesPerView: 6,
              },
            }}
          >
            {categories.map((item, key) => (
              <SwiperSlide key={key}>
                <SingleItem item={item} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default Categories;
