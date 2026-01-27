import React from "react";
import HeroCarousel from "./HeroCarousel";
import Image from "next/image";
import { Promotion } from "@/types/promotion";

interface HeroProps {
  promotions?: Promotion[];
  locale?: string;
}

const Hero = ({ promotions = [], locale = "uk" }: HeroProps) => {
  return (
    <section data-testid="hero" className="overflow-hidden pb-10 lg:pb-12.5 xl:pb-15 pt-57.5 sm:pt-45 lg:pt-30 xl:pt-51.5 bg-champagne-200">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        <div className="w-full">
          <div className="relative z-1 rounded-[10px] bg-white overflow-hidden">
            {/* <!-- bg shapes --> */}
            <Image
              src="/images/hero/hero-bg.png"
              alt="hero bg shapes"
              className="absolute right-0 bottom-0 -z-1"
              width={534}
              height={520}
            />

            <HeroCarousel promotions={promotions} locale={locale} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
