"use client";

import React from "react";
import "@/app/css/euclid-circular-a-font.css";
import "@/app/css/style.css";
import { AuthProvider } from "@/app/context/AuthContext";
import { CabinetSidebar } from "@/components/Cabinet/CabinetSidebar";
import { CabinetAuthGuard } from "@/components/Cabinet/CabinetAuthGuard";

export default function CabinetLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <CabinetAuthGuard>
        <div className="flex min-h-screen bg-gray-50">
          <CabinetSidebar />
          <main className="flex-1">{children}</main>
        </div>
      </CabinetAuthGuard>
    </AuthProvider>
  );
}
