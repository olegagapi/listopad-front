"use client";

import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

type Product = {
  id: number;
  name: string;
  price: number;
  discountedPrice?: number | null;
  categoryName?: string;
  previewImage?: string | null;
  isActive: boolean;
};

type ProductsTableProps = {
  products: Product[];
  onDelete: (id: number) => void;
  isDeleting: number | null;
  onToggleActive: (id: number) => void;
  isTogglingActive: number | null;
};

export function ProductsTable({
  products,
  onDelete,
  isDeleting,
  onToggleActive,
  isTogglingActive,
}: ProductsTableProps): React.ReactElement {
  const t = useTranslations("Cabinet.products");

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
          />
        </svg>
        <h3 className="mt-4 text-lg font-medium text-gray-900">
          {t("noProducts")}
        </h3>
        <p className="mt-2 text-gray-500">{t("noProductsDesc")}</p>
        <Link
          href="/cabinet/products/new"
          className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-malachite text-white rounded-lg hover:bg-malachite/90 transition-colors"
        >
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
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          {t("addFirst")}
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
              {t("table.product")}
            </th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
              {t("table.category")}
            </th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
              {t("table.price")}
            </th>
            <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">
              {t("table.status")}
            </th>
            <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">
              {t("table.actions")}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {products.map((product) => (
            <tr key={product.id} className={`hover:bg-gray-50 ${!product.isActive ? "opacity-60" : ""}`}>
              <td className="py-4 px-4">
                <div className="flex items-center gap-3">
                  {product.previewImage ? (
                    <Image
                      src={product.previewImage}
                      alt={product.name}
                      width={48}
                      height={48}
                      className="w-12 h-12 object-cover rounded-lg"
                      unoptimized
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  )}
                  <span className="font-medium text-gray-900">{product.name}</span>
                </div>
              </td>
              <td className="py-4 px-4 text-gray-600">
                {product.categoryName || "-"}
              </td>
              <td className="py-4 px-4">
                <div>
                  <span className="font-medium text-gray-900">
                    {product.price} UAH
                  </span>
                  {product.discountedPrice && (
                    <span className="ml-2 text-sm text-gray-500 line-through">
                      {product.discountedPrice} UAH
                    </span>
                  )}
                </div>
              </td>
              <td className="py-4 px-4 text-center">
                <button
                  onClick={() => onToggleActive(product.id)}
                  disabled={isTogglingActive === product.id}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none disabled:opacity-50 ${
                    product.isActive ? "bg-malachite" : "bg-gray-300"
                  }`}
                  title={product.isActive ? t("actions.deactivate") : t("actions.activate")}
                >
                  <span
                    className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${
                      product.isActive ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </td>
              <td className="py-4 px-4 text-right">
                <div className="flex items-center justify-end gap-2">
                  <Link
                    href={`/cabinet/products/${product.id}/edit`}
                    className="p-2 text-gray-600 hover:text-malachite hover:bg-gray-100 rounded-lg transition-colors"
                    title={t("actions.edit")}
                  >
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
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </Link>
                  <button
                    onClick={() => onDelete(product.id)}
                    disabled={isDeleting === product.id}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                    title={t("actions.delete")}
                  >
                    {isDeleting === product.id ? (
                      <svg
                        className="w-5 h-5 animate-spin"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                    ) : (
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
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
