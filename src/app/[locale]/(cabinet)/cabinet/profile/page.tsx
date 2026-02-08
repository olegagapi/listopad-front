"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/app/context/AuthContext";
import { CabinetTopBar } from "@/components/Cabinet/CabinetTopBar";
import { ProfileForm } from "@/components/Cabinet/Profile/ProfileForm";

type BrandData = {
  id: number;
  nameUk: string;
  nameEn: string;
  marketingDescUk?: string;
  marketingDescEn?: string;
  externalUrl?: string;
  instagramUrl?: string;
  logoUrl?: string | null;
};

export default function ProfilePage() {
  const t = useTranslations("Cabinet.profile");
  const { isLoading: authLoading } = useAuth();
  const [brand, setBrand] = useState<BrandData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchBrand = async () => {
      try {
        const response = await fetch("/api/cabinet/brand");
        const result = await response.json();

        if (result.data) {
          setBrand(result.data);
        } else {
          setError(t("errors.fetchFailed"));
        }
      } catch {
        setError(t("errors.fetchFailed"));
      } finally {
        setIsLoading(false);
      }
    };

    fetchBrand();
  }, [t]);

  const handleSubmit = async (data: Record<string, unknown> & { logoUrl: string | null }) => {
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch("/api/cabinet/brand", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || t("errors.updateFailed"));
      }

      setSuccess(true);

      // Update local state
      setBrand((prev) => (prev ? { ...prev, ...data } : null));

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("errors.updateFailed"));
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

  if (!brand) {
    return (
      <div>
        <CabinetTopBar title={t("title")} />
        <div className="p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600">{error || t("errors.noBrand")}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <CabinetTopBar title={t("title")} />

      <div className="p-6">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-600">{t("success")}</p>
          </div>
        )}

        <ProfileForm
          initialData={brand}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
}
