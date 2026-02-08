import React from "react";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import { AccountRegistration } from "@/components/BrandRegister/AccountRegistration";
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

  // Check if user is already authenticated
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    // Check if user already has a brand
    const { data: existingManager } = await supabase
      .from("brand_managers")
      .select("brand_id")
      .eq("user_id", user.id)
      .single();

    if (existingManager?.brand_id) {
      // Already has a brand, redirect to cabinet
      redirect(`/${locale}/cabinet`);
    } else {
      // Has account but no brand, redirect to complete
      redirect(`/${locale}/brand-register/complete`);
    }
  }

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

          <AccountRegistration />
        </div>
      </section>
    </main>
  );
}
