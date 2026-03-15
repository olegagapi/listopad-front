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

type MetricKey = "brandPageViews" | "productViews" | "externalClicks" | "wishlistAdds";

const METRIC_CONFIG: {
  key: MetricKey;
  translationKey: string;
  color: string;
  bgClass: string;
  textClass: string;
  borderClass: string;
}[] = [
  {
    key: "brandPageViews",
    translationKey: "brandPageViews",
    color: "#0BDA51",
    bgClass: "bg-malachite/10",
    textClass: "text-malachite",
    borderClass: "border-malachite",
  },
  {
    key: "productViews",
    translationKey: "productViews",
    color: "#3B82F6",
    bgClass: "bg-blue-100",
    textClass: "text-blue-600",
    borderClass: "border-blue-600",
  },
  {
    key: "externalClicks",
    translationKey: "externalClicks",
    color: "#F97316",
    bgClass: "bg-orange-100",
    textClass: "text-orange-600",
    borderClass: "border-orange-600",
  },
  {
    key: "wishlistAdds",
    translationKey: "wishlistAdds",
    color: "#EC4899",
    bgClass: "bg-pink-100",
    textClass: "text-pink-600",
    borderClass: "border-pink-600",
  },
];

const ALL_METRICS = new Set<MetricKey>(METRIC_CONFIG.map((m) => m.key));

const PERIOD_OPTIONS = [7, 14, 30, 90] as const;

export default function AnalyticsPage() {
  const t = useTranslations("Cabinet.analytics");
  const { isLoading: authLoading } = useAuth();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [days, setDays] = useState<number>(30);
  const [selectedMetrics, setSelectedMetrics] = useState<Set<MetricKey>>(
    () => new Set(ALL_METRICS)
  );

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

  const handleMetricToggle = (key: MetricKey): void => {
    setSelectedMetrics((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
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

  const chartData = (data?.daily ?? []).map((d) => ({
    ...d,
    date: d.date.slice(5),
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
        {/* Toggleable Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {METRIC_CONFIG.map((metric) => {
            const isSelected = selectedMetrics.has(metric.key);
            return (
              <button
                key={metric.key}
                type="button"
                onClick={() => handleMetricToggle(metric.key)}
                aria-pressed={isSelected}
                className={`bg-white rounded-xl shadow-sm border-2 p-5 text-left transition-all cursor-pointer ${
                  isSelected
                    ? `${metric.borderClass} shadow-md`
                    : "border-gray-200 opacity-60"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 ${metric.bgClass} rounded-lg flex items-center justify-center`}
                  >
                    <span className={`text-lg font-bold ${metric.textClass}`}>
                      {isLoading ? "..." : totals[metric.key]}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {t(metric.translationKey)}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-malachite" />
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-medium text-gray-900 mb-4">
              {t("chartTitle")}
            </h3>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" fontSize={12} />
                <YAxis
                  allowDecimals={false}
                  fontSize={12}
                  domain={[0, "auto"]}
                />
                <Tooltip />
                <Legend />
                {METRIC_CONFIG.filter((m) => selectedMetrics.has(m.key)).map(
                  (metric) => (
                    <Line
                      key={metric.key}
                      type="monotone"
                      dataKey={metric.key}
                      name={t(metric.translationKey)}
                      stroke={metric.color}
                      strokeWidth={2}
                      dot={false}
                    />
                  )
                )}
              </LineChart>
            </ResponsiveContainer>
            {selectedMetrics.size === 0 && (
              <p className="text-center text-gray-500 mt-4">
                {t("selectMetricHint")}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
