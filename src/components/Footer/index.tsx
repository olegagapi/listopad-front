import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { ContactSettings, SocialLinks } from "@/types/site-settings";
import {
  LocationIcon,
  PhoneIcon,
  EmailIcon,
  FacebookIcon,
  TwitterIcon,
  InstagramIcon,
  YouTubeIcon,
  TikTokIcon,
} from "@/components/Icons";

interface FooterProps {
  contact?: ContactSettings;
  socialLinks?: SocialLinks;
}

const Footer = ({ contact, socialLinks }: FooterProps) => {
  const t = useTranslations("Footer");
  const year = new Date().getFullYear();

  const hasContactInfo = contact?.phone || contact?.email || contact?.address;
  const hasSocialLinks = socialLinks?.instagram || socialLinks?.facebook ||
    socialLinks?.twitter || socialLinks?.youtube || socialLinks?.tiktok;

  return (
    <footer className="overflow-hidden">
      <div className="max-w-[1170px] mx-auto px-4 sm:px-8 xl:px-0">
        {/* <!-- footer menu start --> */}
        <div className="flex flex-wrap xl:flex-nowrap gap-10 xl:gap-19 xl:justify-between pt-17.5 xl:pt-22.5 pb-10 xl:pb-15">
          {hasContactInfo && (
            <div className="max-w-[330px] w-full">
              <h2 className="mb-7.5 text-custom-1 font-medium text-onyx">
                {t("helpSupport")}
              </h2>

              <ul className="flex flex-col gap-3">
                {contact?.address && (
                  <li className="flex gap-4.5">
                    <span className="flex-shrink-0 text-malachite">
                      <LocationIcon />
                    </span>
                    {contact.address}
                  </li>
                )}

                {contact?.phone && (
                  <li>
                    <a href={`tel:${contact.phone}`} className="flex items-center gap-4.5">
                      <span className="text-malachite">
                        <PhoneIcon />
                      </span>
                      {contact.phone}
                    </a>
                  </li>
                )}

                {contact?.email && (
                  <li>
                    <a href={`mailto:${contact.email}`} className="flex items-center gap-4.5">
                      <span className="text-malachite">
                        <EmailIcon />
                      </span>
                      {contact.email}
                    </a>
                  </li>
                )}
              </ul>

              {/* <!-- Social Links start --> */}
              {hasSocialLinks && (
                <div className="flex items-center gap-4 mt-7.5">
                  {socialLinks?.facebook && (
                    <a
                      href={socialLinks.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Facebook Social Link"
                      className="flex ease-out duration-200 hover:text-malachite"
                    >
                      <FacebookIcon />
                    </a>
                  )}

                  {socialLinks?.twitter && (
                    <a
                      href={socialLinks.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Twitter Social Link"
                      className="flex ease-out duration-200 hover:text-malachite"
                    >
                      <TwitterIcon />
                    </a>
                  )}

                  {socialLinks?.instagram && (
                    <a
                      href={socialLinks.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Instagram Social Link"
                      className="flex ease-out duration-200 hover:text-malachite"
                    >
                      <InstagramIcon />
                    </a>
                  )}

                  {socialLinks?.youtube && (
                    <a
                      href={socialLinks.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="YouTube Social Link"
                      className="flex ease-out duration-200 hover:text-malachite"
                    >
                      <YouTubeIcon />
                    </a>
                  )}

                  {socialLinks?.tiktok && (
                    <a
                      href={socialLinks.tiktok}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="TikTok Social Link"
                      className="flex ease-out duration-200 hover:text-malachite"
                    >
                      <TikTokIcon />
                    </a>
                  )}
                </div>
              )}
              {/* <!-- Social Links end --> */}
            </div>
          )}

          <div className="w-full sm:w-auto">
            <h2 className="mb-7.5 text-custom-1 font-medium text-onyx">
              {t("account")}
            </h2>

            <ul className="flex flex-col gap-3.5">
              <li>
                <a className="ease-out duration-200 hover:text-malachite" href="#">
                  {t("myAccount")}
                </a>
              </li>
              <li>
                <a className="ease-out duration-200 hover:text-malachite" href="#">
                  {t("loginRegister")}
                </a>
              </li>
              <li>
                <a className="ease-out duration-200 hover:text-malachite" href="#">
                  {t("wishlist")}
                </a>
              </li>
              <li>
                <a className="ease-out duration-200 hover:text-malachite" href="#">
                  {t("shop")}
                </a>
              </li>
            </ul>
          </div>

          <div className="w-full sm:w-auto">
            <h2 className="mb-7.5 text-custom-1 font-medium text-onyx">
              {t("quickLink")}
            </h2>

            <ul className="flex flex-col gap-3">
              <li>
                <a className="ease-out duration-200 hover:text-malachite" href="#">
                  {t("privacyPolicy")}
                </a>
              </li>
              <li>
                <a className="ease-out duration-200 hover:text-malachite" href="#">
                  {t("refundPolicy")}
                </a>
              </li>
              <li>
                <a className="ease-out duration-200 hover:text-malachite" href="#">
                  {t("termsOfUse")}
                </a>
              </li>
              <li>
                <a className="ease-out duration-200 hover:text-malachite" href="#">
                  {t("faqs")}
                </a>
              </li>
              <li>
                <a className="ease-out duration-200 hover:text-malachite" href="#">
                  {t("contact")}
                </a>
              </li>
            </ul>
          </div>
        </div>
        {/* <!-- footer menu end --> */}
      </div>

      {/* <!-- footer bottom start --> */}
      <div className="py-5 xl:py-7.5 bg-champagne-200">
        <div className="max-w-[1170px] mx-auto px-4 sm:px-8 xl:px-0">
          <div className="flex gap-5 flex-wrap items-center justify-center">
            <p className="text-onyx font-medium">
              &copy; {year}. {t("rightsReserved")}
            </p>
          </div>
        </div>
      </div>
      {/* <!-- footer bottom end --> */}
    </footer>
  );
};

export default Footer;
