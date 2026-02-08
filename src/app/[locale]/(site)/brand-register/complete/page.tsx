import React from "react";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import { CompleteBrandRegistration } from "@/components/BrandRegister/CompleteBrandRegistration";
import Breadcrumb from "@/components/Common/Breadcrumb";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Cabinet.register" });

  return {
    title: t("completePageTitle"),
    description: t("completePageDescription"),
  };
}

export default async function CompleteRegistrationPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Cabinet.register" });

  // Check if user is authenticated
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    // Not authenticated, redirect to registration
    redirect(`/${locale}/brand-register`);
  }

  // Check if user already has a brand
  const { data: existingManager } = await supabase
    .from("brand_managers")
    .select("id, brand_id")
    .eq("user_id", user.id)
    .single();

  if (existingManager?.brand_id) {
    // Already has a brand, redirect to cabinet
    redirect(`/${locale}/cabinet`);
  }

  // Get user info for display
  const userInfo = {
    email: user.email ?? "",
    fullName: user.user_metadata?.full_name ?? user.user_metadata?.name ?? "",
  };

  return (
    <main>
      <Breadcrumb title={t("completePageTitle")} pages={["/", t("completePageTitle")]} />

      <section className="py-12 lg:py-20">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="mb-8 text-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              {t("completeHeading")}
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t("completeSubheading", { email: userInfo.email })}
            </p>
          </div>

          <CompleteBrandRegistration
            userEmail={userInfo.email}
            suggestedName={userInfo.fullName}
          />
        </div>
      </section>
    </main>
  );
}
