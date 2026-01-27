import React from "react";
import Hero from "./Hero";
import Categories from "./Categories";
import NewArrival from "./NewArrivals";
import BestSeller from "./BestSeller";
import Newsletter from "../Common/Newsletter";
import { Category } from "@/types/category";
import { Product } from "@/types/product";
import { Promotion } from "@/types/promotion";

interface HomeProps {
  categories: Category[];
  newArrivals: Product[];
  bestSellers: Product[];
  promotions?: Promotion[];
  locale?: string;
}

const Home = ({ categories, newArrivals, bestSellers, promotions = [], locale = "uk" }: HomeProps) => {
  return (
    <main>
      <Hero promotions={promotions} locale={locale} />
      <Categories categories={categories} />
      <NewArrival products={newArrivals} />
      <BestSeller products={bestSellers} />
      <Newsletter />
    </main>
  );
};

export default Home;
