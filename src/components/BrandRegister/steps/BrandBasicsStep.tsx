"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import {
  brandBasicsStepSchema,
  type BrandBasicsStepInput,
} from "@/lib/brand-registration";
import { useRegistration } from "../RegistrationContext";

export function BrandBasicsStep(): React.ReactElement {
  const t = useTranslations("Cabinet.register");
  const { formData, updateFormData, nextStep, prevStep } = useRegistration();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BrandBasicsStepInput>({
    resolver: zodResolver(brandBasicsStepSchema),
    defaultValues: {
      nameUk: formData.nameUk ?? "",
      nameEn: formData.nameEn ?? "",
    },
  });

  const onSubmit = (data: BrandBasicsStepInput) => {
    updateFormData(data);
    nextStep();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label
          htmlFor="nameUk"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {t("fields.brandNameUk")}
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
          {t("fields.brandNameEn")}
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
