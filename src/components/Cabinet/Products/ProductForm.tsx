"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";
import { ImageUploader } from "./ImageUploader";
import type { Category } from "@/types/category";
import type { PrimeColor, Gender } from "@/types/product";

const COLORS: PrimeColor[] = [
  "white", "black", "grey", "red", "green", "blue",
  "yellow", "brown", "orange", "cyan", "magenta",
  "indigo", "silver", "gold",
];

const GENDERS: Gender[] = ["male", "female", "unisex"];

const productSchema = z.object({
  nameUk: z.string().min(2, "Name must be at least 2 characters"),
  nameEn: z.string().min(2, "Name must be at least 2 characters"),
  price: z.number().min(0, "Price must be positive"),
  discountedPrice: z.number().min(0).nullable().optional(),
  descriptionUk: z.string().optional(),
  descriptionEn: z.string().optional(),
  categoryId: z.number().nullable().optional(),
  colors: z.array(z.string()),
  tags: z.array(z.string()),
  gender: z.enum(["male", "female", "unisex"]).nullable().optional(),
  externalUrl: z.string().url().optional().or(z.literal("")),
  instagramUrl: z.string().url().optional().or(z.literal("")),
});

type ProductFormInput = z.infer<typeof productSchema>;

type ProductFormProps = {
  initialData?: Partial<ProductFormInput> & { images?: string[] };
  onSubmit: (data: ProductFormInput & { images: string[] }) => Promise<void>;
  isSubmitting: boolean;
  submitLabel: string;
};

export function ProductForm({
  initialData,
  onSubmit,
  isSubmitting,
  submitLabel,
}: ProductFormProps): React.ReactElement {
  const t = useTranslations("Cabinet.products.form");
  const tToast = useTranslations("Toast");
  const [categories, setCategories] = useState<Category[]>([]);
  const [images, setImages] = useState<string[]>(initialData?.images ?? []);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [tagInput, setTagInput] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProductFormInput>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      nameUk: initialData?.nameUk ?? "",
      nameEn: initialData?.nameEn ?? "",
      price: initialData?.price ?? 0,
      discountedPrice: initialData?.discountedPrice ?? null,
      descriptionUk: initialData?.descriptionUk ?? "",
      descriptionEn: initialData?.descriptionEn ?? "",
      categoryId: initialData?.categoryId ?? null,
      colors: initialData?.colors ?? [],
      tags: initialData?.tags ?? [],
      gender: initialData?.gender ?? null,
      externalUrl: initialData?.externalUrl ?? "",
      instagramUrl: initialData?.instagramUrl ?? "",
    },
  });

  const selectedColors = watch("colors");
  const selectedTags = watch("tags");
  const selectedGender = watch("gender");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories");
        const result = await response.json();
        if (result.categories) {
          setCategories(result.categories);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleColorToggle = (color: string) => {
    const current = selectedColors ?? [];
    if (current.includes(color)) {
      setValue("colors", current.filter((c) => c !== color));
    } else {
      setValue("colors", [...current, color]);
    }
  };

  const handleTagAdd = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const tag = tagInput.trim();
      if (tag && !(selectedTags ?? []).includes(tag)) {
        setValue("tags", [...(selectedTags ?? []), tag]);
        setTagInput("");
      }
    }
  };

  const handleTagRemove = (tag: string) => {
    setValue("tags", (selectedTags ?? []).filter((t) => t !== tag));
  };

  const handleImageUpload = async (file: File): Promise<string | null> => {
    setIsUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/cabinet/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (result.data?.url) {
        return result.data.url;
      }
      return null;
    } catch {
      toast.error(tToast("uploadFailed"));
      return null;
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleFormSubmit = (data: ProductFormInput) => {
    const previewImage = images[0] ?? null;
    const additionalImages = images.slice(1);
    onSubmit({
      ...data,
      images: [previewImage, ...additionalImages].filter(Boolean) as string[],
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
      {/* Basic Info */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">{t("basicInfo")}</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("nameUk")} *
            </label>
            <input
              {...register("nameUk")}
              type="text"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-malachite focus:border-transparent"
            />
            {errors.nameUk && (
              <p className="mt-1 text-sm text-red-600">{errors.nameUk.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("nameEn")} *
            </label>
            <input
              {...register("nameEn")}
              type="text"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-malachite focus:border-transparent"
            />
            {errors.nameEn && (
              <p className="mt-1 text-sm text-red-600">{errors.nameEn.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("price")} (UAH) *
            </label>
            <input
              {...register("price", { valueAsNumber: true })}
              type="number"
              min="0"
              step="0.01"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-malachite focus:border-transparent"
            />
            {errors.price && (
              <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("discountedPrice")} (UAH)
            </label>
            <input
              {...register("discountedPrice", { valueAsNumber: true })}
              type="number"
              min="0"
              step="0.01"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-malachite focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("category")}
            </label>
            <select
              {...register("categoryId", { valueAsNumber: true })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-malachite focus:border-transparent"
            >
              <option value="">{t("selectCategory")}</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("gender")}
            </label>
            <div className="flex gap-4">
              {GENDERS.map((gender) => (
                <label key={gender} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value={gender}
                    checked={selectedGender === gender}
                    onChange={() => setValue("gender", gender)}
                    className="w-4 h-4 text-malachite focus:ring-malachite"
                  />
                  <span className="text-sm text-gray-700 capitalize">{t(`genders.${gender}`)}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Descriptions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">{t("descriptions")}</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("descriptionUk")}
            </label>
            <textarea
              {...register("descriptionUk")}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-malachite focus:border-transparent resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("descriptionEn")}
            </label>
            <textarea
              {...register("descriptionEn")}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-malachite focus:border-transparent resize-none"
            />
          </div>
        </div>
      </div>

      {/* Colors */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">{t("colors")}</h3>

        <div className="flex flex-wrap gap-2">
          {COLORS.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => handleColorToggle(color)}
              className={`px-3 py-1.5 rounded-full text-sm border transition-colors capitalize ${
                (selectedColors ?? []).includes(color)
                  ? "bg-malachite text-white border-malachite"
                  : "bg-white text-gray-700 border-gray-300 hover:border-malachite"
              }`}
            >
              {color}
            </button>
          ))}
        </div>
      </div>

      {/* Tags */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">{t("tags")}</h3>

        <div className="flex flex-wrap gap-2 mb-4">
          {(selectedTags ?? []).map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm"
            >
              {tag}
              <button
                type="button"
                onClick={() => handleTagRemove(tag)}
                className="text-gray-500 hover:text-red-500"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          ))}
        </div>

        <input
          type="text"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={handleTagAdd}
          placeholder={t("tagPlaceholder")}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-malachite focus:border-transparent"
        />
        <p className="mt-1 text-xs text-gray-500">{t("tagHint")}</p>
      </div>

      {/* Images */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">{t("images")}</h3>

        <ImageUploader
          images={images}
          onImagesChange={setImages}
          maxImages={5}
          isUploading={isUploadingImage}
          onUpload={handleImageUpload}
        />
      </div>

      {/* External Links */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">{t("externalLinks")}</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("externalUrl")}
            </label>
            <input
              {...register("externalUrl")}
              type="url"
              placeholder="https://..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-malachite focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("instagramUrl")}
            </label>
            <input
              {...register("instagramUrl")}
              type="url"
              placeholder="https://instagram.com/..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-malachite focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Submit */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-3 bg-malachite text-white font-medium rounded-lg hover:bg-malachite/90 transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {isSubmitting && (
            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          )}
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
