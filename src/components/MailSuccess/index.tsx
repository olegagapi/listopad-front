import React from "react";
import Breadcrumb from "../Common/Breadcrumb";
import Link from "next/link";
import { ArrowLeftIcon } from "@/components/Icons";

const MailSuccess = () => {
  return (
    <>
      <Breadcrumb title={"MailSuccess"} pages={["MailSuccess"]} />
      <section className="overflow-hidden py-20 bg-champagne-200">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="bg-white rounded-xl shadow-1 px-4 py-10 sm:py-15 lg:py-20 xl:py-25">
            <div className="text-center">
              <h2 className="font-bold text-darkslate text-4xl lg:text-[45px] lg:leading-[57px] mb-5">
                Successful!
              </h2>

              <h3 className="font-medium text-onyx text-xl sm:text-2xl mb-3">
                Your message sent successfully
              </h3>

              <p className="max-w-[491px] w-full mx-auto mb-7.5">
                Thank you so much for your message. We check e-mail frequently
                and will try our best to respond to your inquiry.
              </p>

              <Link
                href="/"
                className="inline-flex items-center gap-2 font-medium text-onyx bg-malachite py-3 px-6 rounded-md ease-out duration-200 hover:bg-malachite-dark"
              >
                <ArrowLeftIcon />
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default MailSuccess;
