"use client";

import React, { useState, useEffect, use } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import toast from "react-hot-toast";
import { useAuth } from "@/app/context/AuthContext";
import { CabinetTopBar } from "@/components/Cabinet/CabinetTopBar";
import { ProductForm } from "@/components/Cabinet/Products/ProductForm";
import { ErrorAlert } from "@/components/Common/ErrorAlert";

type ProductData = {
  id: number;
  nameUk: string;
  nameEn: string;
  price: number;
  discountedPrice?: number | null;
  descriptionUk?: string;
  descriptionEn?: string;
  categoryId?: number | null;
  colors: string[];
  tags: string[];
  gender?: "male" | "female" | "unisex" | null;
  previewImage?: string | null;
  images: string[];
  externalUrl?: string;
  instagramUrl?: string;
};

export default function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const t = useTranslations("Cabinet.products");
  const tToast = useTranslations("Toast");
  const router = useRouter();
  const { isLoading: authLoading } = useAuth();
  const [product, setProduct] = useState<ProductData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/cabinet/products/${id}`);
        const result = await response.json();

        if (result.data) {
          setProduct(result.data);
        } else {
          setError(t("errors.notFound"));
        }
      } catch {
        setError(t("errors.fetchFailed"));
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id, t]);

  const handleSubmit = async (data: Record<string, unknown> & { images: string[] }) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/cabinet/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          previewImage: data.images[0] ?? null,
          images: data.images.slice(1),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || t("errors.updateFailed"));
      }

      toast.success(tToast("productUpdated"));
      router.push("/cabinet/products");
    } catch (err) {
      setError(err instanceof Error ? err.message : t("errors.updateFailed"));
      toast.error(tToast("error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-malachite" />
      </div>
    );
  }

  if (!product) {
    return (
      <div>
        <CabinetTopBar title={t("editProduct")} />
        <div className="p-6">
          <ErrorAlert message={error || t("errors.notFound")} centered />
        </div>
      </div>
    );
  }

  // Combine preview image with additional images
  const allImages = [
    ...(product.previewImage ? [product.previewImage] : []),
    ...(product.images ?? []),
  ];

  return (
    <div>
      <CabinetTopBar title={t("editProduct")} />

      <div className="p-6">
        {error && <ErrorAlert message={error} className="mb-6" />}

        <ProductForm
          initialData={{
            ...product,
            images: allImages,
          }}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          submitLabel={t("form.update")}
        />
      </div>
    </div>
  );
}
