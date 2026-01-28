import Breadcrumb from "@/components/Common/Breadcrumb";
import { Link } from "@/i18n/routing";
import React from "react";
import { useTranslations } from "next-intl";
import { GoogleIcon, GithubIcon } from "@/components/Icons";

const Signin = () => {
  const t = useTranslations("Auth");

  return (
    <>
      <Breadcrumb title={t("signinTitle")} pages={["Signin"]} />
      <section className="overflow-hidden py-20 bg-champagne-200">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="max-w-[570px] w-full mx-auto rounded-xl bg-white shadow-1 p-4 sm:p-7.5 xl:p-11">
            <div className="text-center mb-11">
              <h2 className="font-semibold text-xl sm:text-2xl xl:text-heading-5 text-onyx mb-1.5">
                {t("signinTitle")}
              </h2>
              <p>{t("signinDetail")}</p>
            </div>

            <div>
              <form>
                <div className="mb-5">
                  <label htmlFor="email" className="block mb-2.5">
                    {t("email")}
                  </label>

                  <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder={t("emailPlaceholder")}
                    className="rounded-lg border border-champagne-400 bg-champagne placeholder:text-dark-5 w-full py-3 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-lavender/20"
                  />
                </div>

                <div className="mb-5">
                  <label htmlFor="password" className="block mb-2.5">
                    {t("password")}
                  </label>

                  <input
                    type="password"
                    name="password"
                    id="password"
                    placeholder={t("passwordPlaceholder")}
                    autoComplete="on"
                    className="rounded-lg border border-champagne-400 bg-champagne placeholder:text-dark-5 w-full py-3 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-lavender/20"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex justify-center font-medium text-white bg-dark py-3 px-6 rounded-lg ease-out duration-200 hover:bg-malachite mt-7.5"
                >
                  {t("signinButton")}
                </button>

                <a
                  href="#"
                  className="block text-center text-slate mt-4.5 ease-out duration-200 hover:text-onyx"
                >
                  {t("forgotPassword")}
                </a>

                <span className="relative z-1 block font-medium text-center mt-4.5">
                  <span className="block absolute -z-1 left-0 top-1/2 h-px w-full bg-champagne-400"></span>
                  <span className="inline-block px-3 bg-white">{t("or")}</span>
                </span>

                <div className="flex flex-col gap-4.5 mt-4.5">
                  <button className="flex justify-center items-center gap-3.5 rounded-lg border border-champagne-400 bg-champagne p-3 ease-out duration-200 hover:bg-champagne-200">
                    <GoogleIcon />
                    {t("signinGoogle")}
                  </button>

                  <button className="flex justify-center items-center gap-3.5 rounded-lg border border-champagne-400 bg-champagne p-3 ease-out duration-200 hover:bg-champagne-200">
                    <GithubIcon />
                    {t("signupGithub")}
                  </button>
                </div>

                <p className="text-center mt-6">
                  {t("noAccount")}
                  <Link
                    href="/signup"
                    className="text-onyx ease-out duration-200 hover:text-malachite pl-2"
                  >
                    {t("signupNow")}
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Signin;
