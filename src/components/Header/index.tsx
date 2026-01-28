"use client";
import React, { useState, useEffect, useRef } from "react";
import { Link, useRouter } from "@/i18n/routing";
import CustomSelect from "./CustomSelect";
import SearchDropdown from "./SearchDropdown";
import { menuData } from "./menuData";
import Dropdown from "./Dropdown";
import Image from "next/image";
import { Category } from "@/types/category";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "./LanguageSwitcher";
import { SearchIcon, PhoneIcon, UserIcon, RefreshIcon, HeartIcon } from "@/components/Icons";
import { useInstantSearch } from "@/hooks/useSearch";

interface HeaderProps {
  categories: Category[];
  phone?: string;
}

const Header = ({ categories, phone }: HeaderProps) => {
  const t = useTranslations("Header");
  const router = useRouter();
  const [navigationOpen, setNavigationOpen] = useState(false);
  const [stickyMenu, setStickyMenu] = useState(false);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const {
    results: searchResults,
    isLoading: isSearchLoading,
    search: performSearch,
    clear: clearSearch,
    query: searchQuery,
  } = useInstantSearch(300);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsDropdownVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    performSearch(value);
    setIsDropdownVisible(true);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsDropdownVisible(false);
      router.push(`/shop-with-sidebar?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleCloseDropdown = () => {
    setIsDropdownVisible(false);
    clearSearch();
  };

  // Sticky menu
  const handleStickyMenu = () => {
    if (window.scrollY >= 80) {
      setStickyMenu(true);
    } else {
      setStickyMenu(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleStickyMenu);
  });

  const options = [
    { label: t("allCategories"), value: "0" },
    ...(categories || []).map((category) => ({
      label: category.name || category.title || t("unknown"),
      value: category.id.toString(),
    })),
  ];

  return (
    <header
      className={`fixed left-0 top-0 w-full z-9999 bg-champagne-50 transition-all ease-in-out duration-300 ${stickyMenu && "shadow"
        }`}
    >
      <div className="max-w-[1170px] mx-auto px-4 sm:px-7.5 xl:px-0">
        {/* <!-- header top start --> */}
        <div
          className={`flex flex-col lg:flex-row gap-5 items-end lg:items-center xl:justify-between ease-out duration-200 ${stickyMenu ? "py-4" : "py-6"
            }`}
        >
          {/* <!-- header top left --> */}
          <div className="xl:w-auto flex-col sm:flex-row w-full flex sm:justify-between sm:items-center gap-5 sm:gap-10">
            <Link className="flex-shrink-0" href="/">
              <Image src="/images/logo/logo.svg" alt="Logo" width={219} height={36} />
            </Link>

            <div className="max-w-[475px] w-full" ref={searchContainerRef}>
              <form onSubmit={handleSearchSubmit}>
                <div className="flex items-center">
                  <CustomSelect options={options} />

                  <div className="relative max-w-[333px] sm:min-w-[333px] w-full">
                    {/* <!-- divider --> */}
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 inline-block w-px h-5.5 bg-champagne-400"></span>
                    <input
                      onChange={handleSearchChange}
                      onFocus={() => searchQuery && setIsDropdownVisible(true)}
                      value={searchQuery}
                      type="search"
                      name="search"
                      id="search"
                      placeholder={t("searchPlaceholder")}
                      autoComplete="off"
                      data-testid="search-input"
                      className="custom-search w-full rounded-r-[5px] bg-champagne !border-l-0 border border-champagne-400 py-2.5 pl-4 pr-10 outline-none ease-in duration-200"
                    />

                    <button
                      type="submit"
                      id="search-btn"
                      aria-label="Search"
                      className="flex items-center justify-center absolute right-3 top-1/2 -translate-y-1/2 ease-in duration-200 hover:text-malachite"
                    >
                      <SearchIcon />
                    </button>

                    <SearchDropdown
                      results={searchResults}
                      totalHits={searchResults.length}
                      query={searchQuery}
                      isLoading={isSearchLoading}
                      isVisible={isDropdownVisible}
                      onClose={handleCloseDropdown}
                    />
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* <!-- header top right --> */}
          <div className="flex w-full lg:w-auto items-center gap-7.5">
            <LanguageSwitcher />
            {phone && (
              <>
                <div className="hidden xl:flex items-center gap-3.5">
                  <span className="text-malachite">
                    <PhoneIcon />
                  </span>
                  <div>
                    <span className="block text-2xs text-slate uppercase">{t("support")}</span>
                    <a href={`tel:${phone}`} className="font-medium text-custom-sm text-onyx hover:text-malachite">
                      {phone}
                    </a>
                  </div>
                </div>

                {/* <!-- divider --> */}
                <span className="hidden xl:block w-px h-7.5 bg-champagne-400"></span>
              </>
            )}

            <div className="flex w-full lg:w-auto justify-between items-center gap-5">
              <div className="flex items-center gap-5">
                <Link href="/signin" className="flex items-center gap-2.5 text-malachite">
                  <UserIcon />
                </Link>
              </div>

              {/* <!-- Hamburger Toggle BTN --> */}
              <button
                id="Toggle"
                aria-label="Toggler"
                className="xl:hidden block"
                onClick={() => setNavigationOpen(!navigationOpen)}
              >
                <span className="block relative cursor-pointer w-5.5 h-5.5">
                  <span className="du-block absolute right-0 w-full h-full">
                    <span
                      className={`block relative top-0 left-0 bg-onyx rounded-sm w-0 h-0.5 my-1 ease-in-out duration-200 delay-[0] ${!navigationOpen && "!w-full delay-300"
                        }`}
                    ></span>
                    <span
                      className={`block relative top-0 left-0 bg-onyx rounded-sm w-0 h-0.5 my-1 ease-in-out duration-200 delay-150 ${!navigationOpen && "!w-full delay-400"
                        }`}
                    ></span>
                    <span
                      className={`block relative top-0 left-0 bg-onyx rounded-sm w-0 h-0.5 my-1 ease-in-out duration-200 delay-200 ${!navigationOpen && "!w-full delay-500"
                        }`}
                    ></span>
                  </span>

                  <span className="block absolute right-0 w-full h-full rotate-45">
                    <span
                      className={`block bg-onyx rounded-sm ease-in-out duration-200 delay-300 absolute left-2.5 top-0 w-0.5 h-full ${!navigationOpen && "!h-0 delay-[0] "
                        }`}
                    ></span>
                    <span
                      className={`block bg-onyx rounded-sm ease-in-out duration-200 delay-400 absolute left-0 top-2.5 w-full h-0.5 ${!navigationOpen && "!h-0 dealy-200"
                        }`}
                    ></span>
                  </span>
                </span>
              </button>
              {/* //   <!-- Hamburger Toggle BTN --> */}
            </div>
          </div>
        </div>
        {/* <!-- header top end --> */}
      </div>

      <div className="border-t border-champagne-400">
        <div className="max-w-[1170px] mx-auto px-4 sm:px-7.5 xl:px-0">
          <div className="flex items-center justify-between">
            {/* <!--=== Main Nav Start ===--> */}
            <div
              className={`w-[288px] absolute right-4 top-full xl:static xl:w-auto h-0 xl:h-auto invisible xl:visible xl:flex items-center justify-between ${navigationOpen &&
                `!visible bg-champagne-50 shadow-lg border border-champagne-400 !h-auto max-h-[400px] overflow-y-scroll rounded-md p-5`
                }`}
            >
              {/* <!-- Main Nav Start --> */}
              <nav>
                <ul className="flex xl:items-center flex-col xl:flex-row gap-5 xl:gap-6">
                  {menuData.map((menuItem, i) =>
                    menuItem.submenu ? (
                      <Dropdown key={i} menuItem={menuItem} stickyMenu={stickyMenu} />
                    ) : (
                      <li
                        key={i}
                        className="group relative before:w-0 before:h-[3px] before:bg-malachite before:absolute before:left-0 before:top-0 before:rounded-b-[3px] before:ease-out before:duration-200 hover:before:w-full "
                      >
                        <Link
                          href={menuItem.path}
                          className={`hover:text-malachite text-custom-sm font-medium text-onyx flex ${stickyMenu ? "xl:py-4" : "xl:py-6"
                            }`}
                        >
                          {t(menuItem.title)}
                        </Link>
                      </li>
                    ),
                  )}
                </ul>
              </nav>
              {/* //   <!-- Main Nav End --> */}
            </div>
            {/* // <!--=== Main Nav End ===--> */}

            {/* // <!--=== Nav Right Start ===--> */}
            <div className="hidden xl:block">
              <ul className="flex items-center gap-5.5">
                <li className="py-4">
                  <a
                    href="#"
                    className="flex items-center gap-1.5 font-medium text-custom-sm text-onyx hover:text-malachite"
                  >
                    <RefreshIcon />
                    {t("recentlyViewed")}
                  </a>
                </li>

                <li className="py-4">
                  <Link
                    href="/wishlist"
                    data-testid="wishlist-link"
                    className="flex items-center gap-1.5 font-medium text-custom-sm text-onyx hover:text-malachite"
                  >
                    <HeartIcon />
                    {t("wishlist")}
                  </Link>
                </li>
              </ul>
            </div>
            {/* <!--=== Nav Right End ===--> */}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
