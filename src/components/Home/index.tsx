import React from "react";
import Hero from "./Hero";
import Categories from "./Categories";
import NewArrival from "./NewArrivals";
import PromoBanner from "./PromoBanner";
import BestSeller from "./BestSeller";
import CounDown from "./Countdown";
import Testimonials from "./Testimonials";
import Newsletter from "../Common/Newsletter";
import { Category } from "@/types/category";
import { Product } from "@/types/product";

interface HomeProps {
  categories: Category[];
  newArrivals: Product[];
  bestSellers: Product[];
}

const Home = ({ categories, newArrivals, bestSellers }: HomeProps) => {
  return (
    <main>
      <Hero />
      <Categories categories={categories} />
      <NewArrival products={newArrivals} />
      <PromoBanner />
      <BestSeller products={bestSellers} />
      <CounDown />
      <Testimonials />
      <Newsletter />
    </main>
  );
};

export default Home;
