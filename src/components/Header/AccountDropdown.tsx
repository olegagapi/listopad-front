"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { createClient } from "@/lib/supabase-browser";
import { UserIcon, LogoutIcon } from "@/components/Icons";

type BrandInfo = {
  logoUrl: string | null;
  brandId: number | null;
};

export default function AccountDropdown(): React.JSX.Element {
  const t = useTranslations("Header");
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [brandInfo, setBrandInfo] = useState<BrandInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    let isMounted = true;

    const fetchBrandInfo = async (userId: string): Promise<void> => {
      const { data } = await supabase
        .from("brand_managers")
        .select("brand_id")
        .eq("user_id", userId)
        .single();

      if (!data?.brand_id) {
        setBrandInfo({ logoUrl: null, brandId: null });
        return;
      }

      const { data: brand } = await supabase
        .from("brands")
        .select("logo_url")
        .eq("id", data.brand_id)
        .single();

      setBrandInfo({
        logoUrl: (brand?.logo_url as string | null) ?? null,
        brandId: data.brand_id as number,
      });
    };

    const init = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!isMounted) return;

      if (user) {
        setIsAuthenticated(true);
        await fetchBrandInfo(user.id);
      }

      if (isMounted) setIsLoading(false);
    };

    init();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted) return;

      if (event === "SIGNED_IN" && session?.user) {
        setIsAuthenticated(true);
        await fetchBrandInfo(session.user.id);
      } else if (event === "SIGNED_OUT") {
        setIsAuthenticated(false);
        setBrandInfo(null);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

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
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setBrandInfo(null);
  };

  if (isLoading) {
    return (
      <div className="text-malachite">
        <UserIcon />
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 text-malachite hover:opacity-80 transition-opacity"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {isAuthenticated && brandInfo?.logoUrl ? (
          <Image
            src={brandInfo.logoUrl}
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
