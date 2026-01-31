import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";

export default async function ProductNotFound() {
  const t = await getTranslations("Product");
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
      <h1 className="text-2xl font-semibold text-onyx">{t("notFound")}</h1>
      <Link
        href="/shop-with-sidebar"
        className="text-malachite hover:underline"
      >
        {t("backToShop")}
      </Link>
    </div>
  );
}
