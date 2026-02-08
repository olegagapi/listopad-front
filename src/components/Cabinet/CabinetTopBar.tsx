"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

type CabinetTopBarProps = {
  title: string;
  actions?: React.ReactNode;
};

export function CabinetTopBar({
  title,
  actions,
}: CabinetTopBarProps): React.ReactElement {
  const t = useTranslations("Cabinet.nav");

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
        </div>
        <div className="flex items-center gap-4">
          {actions}
          <Link
            href="/"
            className="text-sm text-gray-600 hover:text-malachite transition-colors flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
            {t("viewStore")}
          </Link>
        </div>
      </div>
    </header>
  );
}
