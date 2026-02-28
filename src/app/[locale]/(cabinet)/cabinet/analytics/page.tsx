"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/app/context/AuthContext";
import { CabinetTopBar } from "@/components/Cabinet/CabinetTopBar";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

type DailyCount = {
  date: string;
  brandPageViews: number;
  productViews: number;
  externalClicks: number;
  wishlistAdds: number;
};

type AnalyticsData = {
  daily: DailyCount[];
  totals: {
    brandPageViews: number;
    productViews: number;
    externalClicks: number;
    wishlistAdds: number;
  };
  days: number;
};

const PERIOD_OPTIONS = [7, 14, 30, 90] as const;

export default function AnalyticsPage() {
  const t = useTranslations("Cabinet.analytics");
  const { isLoading: authLoading } = useAuth();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [days, setDays] = useState<number>(30);

  const fetchAnalytics = useCallback(async (period: number) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/cabinet/analytics?days=${period}`);
      const result = await response.json();
      if (result.data) {
        setData(result.data as AnalyticsData);
      }
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics(days);
  }, [days, fetchAnalytics]);

  const handlePeriodChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    setDays(Number(e.target.value));
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-malachite" />
      </div>
    );
  }

  const totals = data?.totals ?? {
    brandPageViews: 0,
    productViews: 0,
    externalClicks: 0,
    wishlistAdds: 0,
  };

  const statCards = [
    {
      label: t("brandPageViews"),
      value: totals.brandPageViews,
      color: "bg-malachite/10",
      textColor: "text-malachite",
    },
    {
      label: t("productViews"),
      value: totals.productViews,
      color: "bg-blue-100",
      textColor: "text-blue-600",
    },
    {
      label: t("externalClicks"),
      value: totals.externalClicks,
      color: "bg-orange-100",
      textColor: "text-orange-600",
    },
    {
      label: t("wishlistAdds"),
      value: totals.wishlistAdds,
      color: "bg-pink-100",
      textColor: "text-pink-600",
    },
  ];

  const periodLabel = (period: number): string => {
    switch (period) {
      case 7:
        return t("last7Days");
      case 14:
        return t("last14Days");
      case 30:
        return t("last30Days");
      case 90:
        return t("last90Days");
      default:
        return "";
    }
  };

  // Format date for chart display
  const chartData = (data?.daily ?? []).map((d) => ({
    ...d,
    date: d.date.slice(5), // "MM-DD"
  }));

  return (
    <div>
      <CabinetTopBar
        title={t("title")}
        actions={
          <select
            value={days}
            onChange={handlePeriodChange}
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-malachite"
          >
            {PERIOD_OPTIONS.map((p) => (
              <option key={p} value={p}>
                {periodLabel(p)}
              </option>
            ))}
          </select>
        }
      />

      <div className="p-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {statCards.map((card) => (
            <div
              key={card.label}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-5"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 ${card.color} rounded-lg flex items-center justify-center`}
                >
                  <span className={`text-lg font-bold ${card.textColor}`}>
                    {isLoading ? "..." : card.value}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{card.label}</p>
              </div>
            </div>
          ))}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-malachite" />
          </div>
        ) : !data || chartData.length === 0 ? (
          <div className="text-center py-16 text-gray-500">{t("noData")}</div>
        ) : (
          <div className="space-y-8">
            {/* Views Chart */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-medium text-gray-900 mb-4">
                {t("viewsChart")}
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" fontSize={12} />
                  <YAxis allowDecimals={false} fontSize={12} />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="brandPageViews"
                    name={t("brandPageViews")}
                    stroke="#0BDA51"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="productViews"
                    name={t("productViews")}
                    stroke="#3B82F6"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Engagement Chart */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-medium text-gray-900 mb-4">
                {t("engagementChart")}
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" fontSize={12} />
                  <YAxis allowDecimals={false} fontSize={12} />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="externalClicks"
                    name={t("externalClicks")}
                    stroke="#F97316"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="wishlistAdds"
                    name={t("wishlistAdds")}
                    stroke="#EC4899"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
