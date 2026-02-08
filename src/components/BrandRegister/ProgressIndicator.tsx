"use client";

import React from "react";
import { useTranslations } from "next-intl";
import type { RegistrationStep } from "@/types/brand-registration";

type ProgressIndicatorProps = {
  currentStep: RegistrationStep;
};

export function ProgressIndicator({
  currentStep,
}: ProgressIndicatorProps): React.ReactElement {
  const t = useTranslations("Cabinet.register");

  const steps = [
    { number: 1, label: t("steps.account") },
    { number: 2, label: t("steps.brandBasics") },
    { number: 3, label: t("steps.brandDetails") },
    { number: 4, label: t("steps.linksLogo") },
  ] as const;

  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={step.number}>
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                  currentStep >= step.number
                    ? "bg-malachite text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {currentStep > step.number ? (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  step.number
                )}
              </div>
              <span
                className={`mt-2 text-xs sm:text-sm text-center ${
                  currentStep >= step.number ? "text-malachite" : "text-gray-500"
                }`}
              >
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-2 transition-colors ${
                  currentStep > step.number ? "bg-malachite" : "bg-gray-200"
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
