import React from "react";
import { getTranslations } from "next-intl/server";
import { BrandRegistration } from "@/components/BrandRegister";
import Breadcrumb from "@/components/Common/Breadcrumb";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Cabinet.register" });

  return {
    title: t("pageTitle"),
    description: t("pageDescription"),
  };
}

export default async function BrandRegisterPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Cabinet.register" });

  return (
    <main>
      <Breadcrumb title={t("pageTitle")} pages={["/", t("pageTitle")]} />

      <section className="py-12 lg:py-20">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="mb-8 text-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              {t("heading")}
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">{t("subheading")}</p>
          </div>

          <BrandRegistration />
        </div>
      </section>
    </main>
  );
}
