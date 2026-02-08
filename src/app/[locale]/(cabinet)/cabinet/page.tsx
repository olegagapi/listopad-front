"use client";

import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { useAuth } from "@/app/context/AuthContext";
import { CabinetTopBar } from "@/components/Cabinet/CabinetTopBar";

type DashboardStats = {
  totalProducts: number;
  recentProducts: Array<{
    id: number;
    name: string;
    price: number;
  }>;
};

export default function CabinetDashboard() {
  const t = useTranslations("Cabinet.dashboard");
  const { brandManager, isLoading } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!brandManager?.brandId) {
        setIsLoadingStats(false);
        return;
      }

      try {
        const response = await fetch(`/api/cabinet/products?limit=5`);
        const result = await response.json();

        if (result.data) {
          setStats({
            totalProducts: result.data.total ?? 0,
            recentProducts: result.data.products ?? [],
          });
        }
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setIsLoadingStats(false);
      }
    };

    fetchStats();
  }, [brandManager?.brandId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-malachite" />
      </div>
    );
  }

  return (
    <div>
      <CabinetTopBar title={t("title")} />

      <div className="p-6">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {t("welcome", { name: brandManager?.fullName ?? "" })}
          </h2>
          <p className="text-gray-600">{t("subtitle")}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-malachite/10 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-malachite"
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
              </div>
              <div>
                <p className="text-sm text-gray-500">{t("totalProducts")}</p>
                <p className="text-2xl font-bold text-gray-900">
                  {isLoadingStats ? "..." : (stats?.totalProducts ?? 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">{t("accountStatus")}</p>
                <p className="text-lg font-medium text-gray-900 capitalize">
                  {brandManager?.status ?? "-"}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">{t("memberSince")}</p>
                <p className="text-lg font-medium text-gray-900">
                  {brandManager?.createdAt
                    ? new Date(brandManager.createdAt).toLocaleDateString()
                    : "-"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Link
            href="/cabinet/products/new"
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:border-malachite transition-colors group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-malachite/10 rounded-lg flex items-center justify-center group-hover:bg-malachite/20 transition-colors">
                <svg
                  className="w-6 h-6 text-malachite"
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
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{t("addProduct")}</h3>
                <p className="text-sm text-gray-500">{t("addProductDesc")}</p>
              </div>
            </div>
          </Link>

          <Link
            href="/cabinet/profile"
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:border-malachite transition-colors group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-malachite/10 rounded-lg flex items-center justify-center group-hover:bg-malachite/20 transition-colors">
                <svg
                  className="w-6 h-6 text-malachite"
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
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{t("editProfile")}</h3>
                <p className="text-sm text-gray-500">{t("editProfileDesc")}</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Recent Products */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-gray-900">{t("recentProducts")}</h3>
              <Link
                href="/cabinet/products"
                className="text-sm text-malachite hover:underline"
              >
                {t("viewAll")}
              </Link>
            </div>
          </div>
          <div className="p-6">
            {isLoadingStats ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-malachite" />
              </div>
            ) : stats?.recentProducts && stats.recentProducts.length > 0 ? (
              <ul className="divide-y divide-gray-100">
                {stats.recentProducts.map((product) => (
                  <li key={product.id} className="py-3 flex items-center justify-between">
                    <span className="text-gray-900">{product.name}</span>
                    <span className="text-gray-500">{product.price} UAH</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">{t("noProducts")}</p>
                <Link
                  href="/cabinet/products/new"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-malachite text-white rounded-lg hover:bg-malachite/90 transition-colors"
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
                  {t("addFirstProduct")}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
