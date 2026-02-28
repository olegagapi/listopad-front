"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/routing";
import { createClient } from "@/lib/supabase-browser";
import { GoogleIcon } from "@/components/Icons";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginInput = z.infer<typeof loginSchema>;

type BrandLoginProps = {
  showRegisteredMessage?: boolean;
  oauthError?: string;
};

const OAUTH_ERROR_KEYS: Record<string, string> = {
  no_code: "oauthNoCode",
  config: "oauthConfig",
  exchange_failed: "oauthExchangeFailed",
  no_user: "oauthNoUser",
  not_brand_manager: "notBrandManager",
  suspended: "accountSuspended",
  pending: "accountPending",
};

export function BrandLogin({
  showRegisteredMessage = false,
  oauthError,
}: BrandLoginProps): React.ReactElement {
  const t = useTranslations("Cabinet.login");
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // Map OAuth error codes to translated messages
  const getInitialError = (): string | null => {
    if (!oauthError) return null;
    const errorKey = OAUTH_ERROR_KEYS[oauthError];
    if (errorKey) {
      return t(`errors.${errorKey}`);
    }
    return t("errors.loginFailed");
  };

  const [error, setError] = useState<string | null>(getInitialError);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true);
    setError(null);

    try {
      const supabase = createClient();

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (signInError) {
        if (signInError.message.includes("Email not confirmed")) {
          setError(t("errors.emailNotVerified"));
        } else if (signInError.message.includes("Invalid login credentials")) {
          setError(t("errors.invalidCredentials"));
        } else {
          setError(t("errors.loginFailed"));
        }
        return;
      }

      // Check if user has brand manager status
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data: managerData } = await supabase
          .from("brand_managers")
          .select("status")
          .eq("user_id", user.id)
          .single();

        if (!managerData) {
          setError(t("errors.notBrandManager"));
          await supabase.auth.signOut();
          return;
        }

        if (managerData.status === "suspended") {
          setError(t("errors.accountSuspended"));
          await supabase.auth.signOut();
          return;
        }

        if (managerData.status === "pending") {
          setError(t("errors.accountPending"));
          await supabase.auth.signOut();
          return;
        }
      }

      router.push("/cabinet");
    } catch {
      setError(t("errors.loginFailed"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { error: signInError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (signInError) {
        setError(t("errors.loginFailed"));
      }
    } catch {
      setError(t("errors.loginFailed"));
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8">
        <p className="text-sm text-gray-500 text-center mb-6">
          {t("forBrandsOnly")}
        </p>

        {showRegisteredMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-700">{t("registrationSuccess")}</p>
          </div>
        )}

        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isGoogleLoading}
          className="w-full px-6 py-3 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 flex items-center justify-center gap-3 mb-6"
        >
          {isGoogleLoading ? (
            <svg
              className="animate-spin h-5 w-5"
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
            <GoogleIcon size={20} />
          )}
          {t("signInWithGoogle")}
        </button>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500">{t("or")}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {t("fields.email")}
            </label>
            <input
              {...register("email")}
              type="email"
              id="email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-malachite focus:border-transparent transition-colors"
              placeholder={t("placeholders.email")}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {t("fields.password")}
            </label>
            <input
              {...register("password")}
              type="password"
              id="password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-malachite focus:border-transparent transition-colors"
              placeholder={t("placeholders.password")}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>

          {error && (
            <div className="p-3 bg-red-100 rounded-md" role="alert">
              <p className="text-sm text-red-700 font-medium">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-6 py-3 bg-malachite text-white font-medium rounded-lg hover:bg-malachite/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5"
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
                {t("buttons.loggingIn")}
              </>
            ) : (
              t("buttons.login")
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            {t("noAccount")}{" "}
            <Link
              href="/brand-register"
              className="text-malachite hover:underline font-medium"
            >
              {t("registerLink")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
