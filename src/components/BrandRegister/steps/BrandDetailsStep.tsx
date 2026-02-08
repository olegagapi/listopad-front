"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import {
  brandDetailsStepSchema,
  type BrandDetailsStepInput,
} from "@/lib/brand-registration";
import { useRegistration } from "../RegistrationContext";

export function BrandDetailsStep(): React.ReactElement {
  const t = useTranslations("Cabinet.register");
  const { formData, updateFormData, nextStep, prevStep } = useRegistration();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BrandDetailsStepInput>({
    resolver: zodResolver(brandDetailsStepSchema),
    defaultValues: {
      marketingDescUk: formData.marketingDescUk ?? "",
      marketingDescEn: formData.marketingDescEn ?? "",
    },
  });

  const onSubmit = (data: BrandDetailsStepInput) => {
    updateFormData(data);
    nextStep();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-malachite focus:border-transparent transition-colors resize-none"
          placeholder={t("placeholders.description")}
        />
        {errors.marketingDescUk && (
          <p className="mt-1 text-sm text-red-600">
            {errors.marketingDescUk.message}
          </p>
        )}
        <p className="mt-1 text-xs text-gray-500">{t("optional")}</p>
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
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-malachite focus:border-transparent transition-colors resize-none"
          placeholder={t("placeholders.description")}
        />
        {errors.marketingDescEn && (
          <p className="mt-1 text-sm text-red-600">
            {errors.marketingDescEn.message}
          </p>
        )}
        <p className="mt-1 text-xs text-gray-500">{t("optional")}</p>
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={prevStep}
          className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
        >
          {t("buttons.back")}
        </button>
        <button
          type="submit"
          className="px-6 py-3 bg-malachite text-white font-medium rounded-lg hover:bg-malachite/90 transition-colors"
        >
          {t("buttons.next")}
        </button>
      </div>
    </form>
  );
}
