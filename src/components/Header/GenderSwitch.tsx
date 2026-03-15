"use client";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { useRouter } from "@/i18n/routing";
import { useGenderPreference, type GenderPreference } from "@/app/context/GenderPreferenceContext";

const OPTIONS: { key: "women" | "men" | "all"; value: GenderPreference }[] = [
  { key: "women", value: "female" },
  { key: "men", value: "male" },
  { key: "all", value: null },
];

export default function GenderSwitch() {
  const t = useTranslations("Header.genderSwitch");
  const { gender, setGender } = useGenderPreference();
  const pathname = usePathname();
  const router = useRouter();

  const isShopPage = pathname.includes("shop-with-sidebar") || pathname.includes("shop-without-sidebar");

  const handleClick = (value: GenderPreference) => {
    setGender(value);

    if (isShopPage) {
      const url = new URL(window.location.href);
      if (value) {
        url.searchParams.set("gender", value);
      } else {
        url.searchParams.delete("gender");
      }
      router.replace(
        `${pathname.replace(/^\/(uk|en)/, "")}?${url.searchParams.toString()}`
      );
    }
  };

  return (
    <div className="flex items-center gap-1">
      {OPTIONS.map(({ key, value }) => (
        <button
          key={key}
          onClick={() => handleClick(value)}
          className={`relative px-2.5 py-3 text-custom-sm font-medium transition-colors duration-200 ${
            gender === value
              ? "text-malachite before:absolute before:left-0 before:top-0 before:h-[3px] before:w-full before:rounded-b-[3px] before:bg-malachite"
              : "text-onyx hover:text-malachite"
          }`}
        >
          {t(key)}
        </button>
      ))}
      <span className="mx-1 h-4 w-px bg-champagne-400" />
    </div>
  );
}
