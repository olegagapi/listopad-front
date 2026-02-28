import React from "react";
import { WarningCircleIcon } from "@/components/Icons";

type ErrorAlertProps = {
  message: string;
  centered?: boolean;
  className?: string;
};

export function ErrorAlert({
  message,
  centered = false,
  className = "",
}: ErrorAlertProps): React.ReactElement {
  return (
    <div
      className={`p-4 bg-red-light-6 border border-red-light-3 rounded-lg flex ${centered ? "items-center justify-center" : "items-start"} gap-3 ${className}`}
      role="alert"
    >
      <WarningCircleIcon size={20} className="flex-shrink-0 mt-0.5" />
      <p className="text-sm text-red-dark font-medium">{message}</p>
    </div>
  );
}
