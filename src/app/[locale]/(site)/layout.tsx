"use client";
import { useState, useEffect } from "react";
import "@/app/css/euclid-circular-a-font.css";
import "@/app/css/style.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

import { ModalProvider } from "@/app/context/QuickViewModalContext";
import { ReduxProvider } from "@/redux/provider";
import QuickViewModal from "@/components/Common/QuickViewModal";
import { PreviewSliderProvider } from "@/app/context/PreviewSliderContext";
import PreviewSliderModal from "@/components/Common/PreviewSlider";

import ScrollToTop from "@/components/Common/ScrollToTop";
import PreLoader from "@/components/Common/PreLoader";
import { Category } from "@/types/category";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState<boolean>(true);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const init = async () => {
      try {
        const res = await fetch("/api/categories");
        const data = await res.json();
        if (data.categories) {
          const topLevel = data.categories.filter((c: Category) => !c.parentId);
          setCategories(topLevel);
        }
      } catch (error) {
        console.error("Failed to fetch categories", error);
      } finally {
        setTimeout(() => setLoading(false), 1000);
      }
    };
    init();
  }, []);

  return (
    <>
      {loading ? (
        <PreLoader />
      ) : (
        <>
          <ReduxProvider>
            <ModalProvider>
              <PreviewSliderProvider>
                <Header categories={categories} />
                {children}

                <QuickViewModal />
                <PreviewSliderModal />
              </PreviewSliderProvider>
            </ModalProvider>
          </ReduxProvider>
          <ScrollToTop />
          <Footer />
        </>
      )}
    </>
  );
}
