"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { RegistrationProvider, useRegistration } from "./RegistrationContext";
import { ProgressIndicator } from "./ProgressIndicator";
import {
  AccountStep,
  BrandBasicsStep,
  BrandDetailsStep,
  LinksLogoStep,
} from "./steps";

function RegistrationForm(): React.ReactElement {
  const t = useTranslations("Cabinet.register");
  const router = useRouter();
  const {
    currentStep,
    formData,
    setSubmitting,
    setError,
  } = useRegistration();

  const handleFinalSubmit = async (logoFile: File | null) => {
    setSubmitting(true);
    setError(null);

    try {
      // Prepare form data for submission
      const submitData = new FormData();
      submitData.append("email", formData.email ?? "");
      submitData.append("password", formData.password ?? "");
      submitData.append("fullName", formData.fullName ?? "");
      submitData.append("nameUk", formData.nameUk ?? "");
      submitData.append("nameEn", formData.nameEn ?? "");
      submitData.append("marketingDescUk", formData.marketingDescUk ?? "");
      submitData.append("marketingDescEn", formData.marketingDescEn ?? "");
      submitData.append("externalUrl", formData.externalUrl ?? "");
      submitData.append("instagramUrl", formData.instagramUrl ?? "");

      if (logoFile) {
        submitData.append("logo", logoFile);
      }

      const response = await fetch("/api/cabinet/auth/register", {
        method: "POST",
        body: submitData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || t("errors.registrationFailed"));
      }

      // Redirect to login with success message
      router.push("/brand-login?registered=true");
    } catch (err) {
      setError(err instanceof Error ? err.message : t("errors.registrationFailed"));
    } finally {
      setSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <AccountStep />;
      case 2:
        return <BrandBasicsStep />;
      case 3:
        return <BrandDetailsStep />;
      case 4:
        return <LinksLogoStep onSubmit={handleFinalSubmit} />;
      default:
        return <AccountStep />;
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <ProgressIndicator currentStep={currentStep} />

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          {currentStep === 1 && t("titles.account")}
          {currentStep === 2 && t("titles.brandBasics")}
          {currentStep === 3 && t("titles.brandDetails")}
          {currentStep === 4 && t("titles.linksLogo")}
        </h2>

        {renderStep()}
      </div>
    </div>
  );
}

export function BrandRegistration(): React.ReactElement {
  return (
    <RegistrationProvider>
      <RegistrationForm />
    </RegistrationProvider>
  );
}

export { CompleteBrandRegistration } from "./CompleteBrandRegistration";
