"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";

const profileSchema = z.object({
  nameUk: z.string().min(2, "Name must be at least 2 characters"),
  nameEn: z.string().min(2, "Name must be at least 2 characters"),
  marketingDescUk: z.string().optional(),
  marketingDescEn: z.string().optional(),
  externalUrl: z.string().url().optional().or(z.literal("")),
  instagramUrl: z.string().url().optional().or(z.literal("")),
});

type ProfileFormInput = z.infer<typeof profileSchema>;

type ProfileFormProps = {
  initialData: ProfileFormInput & { logoUrl?: string | null };
  onSubmit: (data: ProfileFormInput & { logoUrl: string | null }) => Promise<void>;
  isSubmitting: boolean;
};

export function ProfileForm({
  initialData,
  onSubmit,
  isSubmitting,
}: ProfileFormProps): React.ReactElement {
  const t = useTranslations("Cabinet.profile.form");
  const tToast = useTranslations("Toast");
  const [logoUrl, setLogoUrl] = useState<string | null>(initialData.logoUrl ?? null);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      nameUk: initialData.nameUk ?? "",
      nameEn: initialData.nameEn ?? "",
      marketingDescUk: initialData.marketingDescUk ?? "",
      marketingDescEn: initialData.marketingDescEn ?? "",
      externalUrl: initialData.externalUrl ?? "",
      instagramUrl: initialData.instagramUrl ?? "",
    },
  });

  const handleLogoChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploadingLogo(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/cabinet/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (result.data?.url) {
        setLogoUrl(result.data.url);
      }
    } catch {
      toast.error(tToast("uploadFailed"));
    } finally {
      setIsUploadingLogo(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemoveLogo = () => {
    setLogoUrl(null);
  };

  const handleFormSubmit = (data: ProfileFormInput) => {
    onSubmit({ ...data, logoUrl });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
      {/* Logo */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">{t("logo")}</h3>

        <div className="flex items-center gap-6">
          {logoUrl ? (
            <div className="relative">
              <Image
                src={logoUrl}
                alt="Brand logo"
                width={128}
                height={128}
                className="w-32 h-32 object-contain border border-gray-200 rounded-lg"
                unoptimized
              />
              <button
                type="button"
                onClick={handleRemoveLogo}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploadingLogo}
              className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-malachite transition-colors disabled:opacity-50"
            >
              {isUploadingLogo ? (
                <svg
                  className="w-8 h-8 text-gray-400 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
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
              ) : (
                <>
                  <svg
                    className="w-8 h-8 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  <span className="mt-1 text-xs text-gray-500">{t("uploadLogo")}</span>
                </>
              )}
            </button>
          )}

          <div className="text-sm text-gray-500">
            <p>{t("logoHint")}</p>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleLogoChange}
          className="hidden"
        />
      </div>

      {/* Brand Names */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">{t("brandName")}</h3>

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
              {...register("marketingDescUk")}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-malachite focus:border-transparent resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("descriptionEn")}
            </label>
            <textarea
              {...register("marketingDescEn")}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-malachite focus:border-transparent resize-none"
            />
          </div>
        </div>
      </div>

      {/* External Links */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">{t("externalLinks")}</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("websiteUrl")}
            </label>
            <input
              {...register("externalUrl")}
              type="url"
              placeholder="https://..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-malachite focus:border-transparent"
            />
            {errors.externalUrl && (
              <p className="mt-1 text-sm text-red-600">{errors.externalUrl.message}</p>
            )}
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
            {errors.instagramUrl && (
              <p className="mt-1 text-sm text-red-600">{errors.instagramUrl.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Submit */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting || isUploadingLogo}
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
          {t("save")}
        </button>
      </div>
    </form>
  );
}
