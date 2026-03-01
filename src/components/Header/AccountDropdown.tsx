"use client";

import React, { useState, useEffect, useRef } from "react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import Image from "next/image";
import toast from "react-hot-toast";
import { useAuth } from "@/app/context/AuthContext";
import { UserIcon, LogoutIcon } from "@/components/Icons";

export default function AccountDropdown(): React.JSX.Element {
  const t = useTranslations("Header");
  const tToast = useTranslations("Toast");
  const { isAuthenticated, brandManager, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    setIsOpen(false);
    await signOut();
    toast.success(tToast("loggedOut"));
  };

  const logoUrl = brandManager?.brandLogoUrl;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 text-malachite hover:opacity-80 transition-opacity"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {isAuthenticated && logoUrl ? (
          <Image
            src={logoUrl}
            alt="Brand"
            width={28}
            height={28}
            className="rounded-full object-cover w-7 h-7"
          />
        ) : (
          <UserIcon />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-champagne-50 border border-champagne-400 rounded-md shadow-lg py-1 z-50">
          {isAuthenticated ? (
            <>
              <Link
                href="/cabinet"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-custom-sm text-onyx hover:text-malachite hover:bg-champagne transition-colors"
              >
                <UserIcon size={16} />
                {t("brandCabinet")}
              </Link>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2.5 w-full text-left px-4 py-2.5 text-custom-sm text-onyx hover:text-malachite hover:bg-champagne transition-colors"
              >
                <LogoutIcon size={16} />
                {t("signOut")}
              </button>
            </>
          ) : (
            <>
              <Link
                href="/brand-login"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-custom-sm text-onyx hover:text-malachite hover:bg-champagne transition-colors"
              >
                {t("brandLogin")}
              </Link>
              <Link
                href="/brand-register"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-custom-sm text-onyx hover:text-malachite hover:bg-champagne transition-colors"
              >
                {t("brandRegister")}
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}
