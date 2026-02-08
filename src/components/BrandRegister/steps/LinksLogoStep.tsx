"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { z } from "zod";
import { useRegistration } from "../RegistrationContext";

const linksStepSchema = z.object({
  externalUrl: z
    .string()
    .refine(
      (val) => val === "" || z.string().url().safeParse(val).success,
      "Must be a valid URL"
    ),
  instagramUrl: z
    .string()
    .refine(
      (val) => val === "" || z.string().url().safeParse(val).success,
      "Must be a valid URL"
    ),
});

type LinksStepInput = z.infer<typeof linksStepSchema>;

type LinksLogoStepProps = {
  onSubmit: (logoFile: File | null) => void;
};

export function LinksLogoStep({
  onSubmit: handleFinalSubmit,
}: LinksLogoStepProps): React.ReactElement {
  const t = useTranslations("Cabinet.register");
  const { formData, updateFormData, prevStep, isSubmitting, error } =
    useRegistration();
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LinksStepInput>({
    resolver: zodResolver(linksStepSchema),
    defaultValues: {
      externalUrl: formData.externalUrl ?? "",
      instagramUrl: formData.instagramUrl ?? "",
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!validTypes.includes(file.type)) {
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        return;
      }

      setLogoFile(file);

      // Create preview
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

  const onSubmit = (data: LinksStepInput) => {
    updateFormData(data);
    handleFinalSubmit(logoFile);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
          <p className="mt-1 text-sm text-red-600">
            {errors.externalUrl.message}
          </p>
        )}
        <p className="mt-1 text-xs text-gray-500">{t("optional")}</p>
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
          <p className="mt-1 text-sm text-red-600">
            {errors.instagramUrl.message}
          </p>
        )}
        <p className="mt-1 text-xs text-gray-500">{t("optional")}</p>
      </div>

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
        <p className="mt-1 text-xs text-gray-500">
          {t("logoHint")}
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <div className="flex justify-between">
        <button
          type="button"
          onClick={prevStep}
          disabled={isSubmitting}
          className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          {t("buttons.back")}
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-3 bg-malachite text-white font-medium rounded-lg hover:bg-malachite/90 transition-colors disabled:opacity-50 flex items-center gap-2"
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
            t("buttons.register")
          )}
        </button>
      </div>
    </form>
  );
}
