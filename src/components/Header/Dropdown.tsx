import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { ChevronDownSmallIcon } from "@/components/Icons";

const Dropdown = ({ menuItem, stickyMenu }) => {
  const [dropdownToggler, setDropdownToggler] = useState(false);
  const pathUrl = usePathname();
  const t = useTranslations("Header");

  return (
    <li
      onClick={() => setDropdownToggler(!dropdownToggler)}
      className={`group relative before:w-0 before:h-[3px] before:bg-malachite before:absolute before:left-0 before:top-0 before:rounded-b-[3px] before:ease-out before:duration-200 hover:before:w-full ${pathUrl.includes(menuItem.path) && "before:!w-full"
        }`}
    >
      <a
        href="#"
        className={`hover:text-malachite text-custom-sm font-medium text-onyx flex items-center gap-1.5 capitalize ${stickyMenu ? "xl:py-4" : "xl:py-6"
          } ${pathUrl.includes(menuItem.path) && "!text-malachite"}`}
      >
        {t(menuItem.title)}
        <ChevronDownSmallIcon className="cursor-pointer" />
      </a>

      {/* <!-- Dropdown Start --> */}
      <ul
        className={`dropdown ${dropdownToggler && "flex"} ${stickyMenu
            ? "xl:group-hover:translate-y-0"
            : "xl:group-hover:translate-y-0"
          }`}
      >
        {menuItem.submenu.map((item, i) => (
          <li key={i}>
            <Link
              href={item.path}
              className={`flex text-custom-sm hover:text-malachite hover:bg-champagne py-[7px] px-4.5 ${pathUrl === item.path && "text-malachite bg-champagne"
                } `}
            >
              {t(item.title)}
            </Link>
          </li>
        ))}
      </ul>
    </li>
  );
};

export default Dropdown;
