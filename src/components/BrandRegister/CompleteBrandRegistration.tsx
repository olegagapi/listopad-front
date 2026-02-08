"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";

const urlOrEmpty = z
  .string()
  .refine(
    (val) => val === "" || z.string().url().safeParse(val).success,
    "Must be a valid URL"
  );

const completionSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name must be at most 100 characters"),
  nameUk: z
    .string()
    .min(2, "Brand name must be at least 2 characters")
    .max(100, "Brand name must be at most 100 characters"),
  nameEn: z
    .string()
    .min(2, "Brand name must be at least 2 characters")
    .max(100, "Brand name must be at most 100 characters"),
  marketingDescUk: z.string().max(1000).optional(),
  marketingDescEn: z.string().max(1000).optional(),
  externalUrl: urlOrEmpty,
  instagramUrl: urlOrEmpty,
});

type CompletionFormInput = z.infer<typeof completionSchema>;

type CompleteBrandRegistrationProps = {
  userEmail: string;
  suggestedName: string;
};

export function CompleteBrandRegistration({
  userEmail,
  suggestedName,
}: CompleteBrandRegistrationProps): React.ReactElement {
  const t = useTranslations("Cabinet.register");
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CompletionFormInput>({
    resolver: zodResolver(completionSchema),
    defaultValues: {
      fullName: suggestedName,
      nameUk: "",
      nameEn: "",
      marketingDescUk: "",
      marketingDescEn: "",
      externalUrl: "",
      instagramUrl: "",
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const validTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!validTypes.includes(file.type)) {
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        return;
      }

      setLogoFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setLogoFile(null);
    setLogoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onSubmit = async (data: CompletionFormInput) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("fullName", data.fullName);
      formData.append("nameUk", data.nameUk);
      formData.append("nameEn", data.nameEn);
      formData.append("marketingDescUk", data.marketingDescUk ?? "");
      formData.append("marketingDescEn", data.marketingDescEn ?? "");
      formData.append("externalUrl", data.externalUrl);
      formData.append("instagramUrl", data.instagramUrl);

      if (logoFile) {
        formData.append("logo", logoFile);
      }

      const response = await fetch("/api/cabinet/auth/complete-registration", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || t("errors.registrationFailed"));
      }

      router.push("/cabinet");
    } catch (err) {
      setError(err instanceof Error ? err.message : t("errors.registrationFailed"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8">
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            {t("signedInAs")}: <span className="font-medium">{userEmail}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Full Name */}
          <div>
            <label
              htmlFor="fullName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {t("fields.fullName")} *
            </label>
            <input
              {...register("fullName")}
              type="text"
              id="fullName"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-malachite focus:border-transparent transition-colors"
              placeholder={t("placeholders.fullName")}
            />
            {errors.fullName && (
              <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
            )}
          </div>

          {/* Brand Names */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="nameUk"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {t("fields.brandNameUk")} *
              </label>
              <input
                {...register("nameUk")}
                type="text"
                id="nameUk"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-malachite focus:border-transparent transition-colors"
                placeholder={t("placeholders.brandNameUk")}
              />
              {errors.nameUk && (
                <p className="mt-1 text-sm text-red-600">{errors.nameUk.message}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="nameEn"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {t("fields.brandNameEn")} *
              </label>
              <input
                {...register("nameEn")}
                type="text"
                id="nameEn"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-malachite focus:border-transparent transition-colors"
                placeholder={t("placeholders.brandNameEn")}
              />
              {errors.nameEn && (
                <p className="mt-1 text-sm text-red-600">{errors.nameEn.message}</p>
              )}
            </div>
          </div>

          {/* Descriptions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="marketingDescUk"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {t("fields.descriptionUk")}
              </label>
              <textarea
                {...register("marketingDescUk")}
                id="marketingDescUk"
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-malachite focus:border-transparent transition-colors resize-none"
                placeholder={t("placeholders.descriptionUk")}
              />
            </div>

            <div>
              <label
                htmlFor="marketingDescEn"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {t("fields.descriptionEn")}
              </label>
              <textarea
                {...register("marketingDescEn")}
                id="marketingDescEn"
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-malachite focus:border-transparent transition-colors resize-none"
                placeholder={t("placeholders.descriptionEn")}
              />
            </div>
          </div>

          {/* External Links */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="externalUrl"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {t("fields.websiteUrl")}
              </label>
              <input
                {...register("externalUrl")}
                type="url"
                id="externalUrl"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-malachite focus:border-transparent transition-colors"
                placeholder={t("placeholders.websiteUrl")}
              />
              {errors.externalUrl && (
                <p className="mt-1 text-sm text-red-600">{errors.externalUrl.message}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="instagramUrl"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {t("fields.instagramUrl")}
              </label>
              <input
                {...register("instagramUrl")}
                type="url"
                id="instagramUrl"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-malachite focus:border-transparent transition-colors"
                placeholder={t("placeholders.instagramUrl")}
              />
              {errors.instagramUrl && (
                <p className="mt-1 text-sm text-red-600">{errors.instagramUrl.message}</p>
              )}
            </div>
          </div>

          {/* Logo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("fields.logo")}
            </label>
            <div className="mt-2">
              {logoPreview ? (
                <div className="relative inline-block">
                  <Image
                    src={logoPreview}
                    alt="Logo preview"
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
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-malachite transition-colors"
                >
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
                  <span className="mt-1 text-xs text-gray-500">
                    {t("uploadLogo")}
                  </span>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">{t("logoHint")}</p>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-6 py-3 bg-malachite text-white font-medium rounded-lg hover:bg-malachite/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin h-5 w-5"
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
                {t("buttons.submitting")}
              </>
            ) : (
              t("buttons.completeRegistration")
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
