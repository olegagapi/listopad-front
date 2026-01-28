import React from "react";
import Breadcrumb from "../Common/Breadcrumb";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeftIcon } from "@/components/Icons";

const Error = () => {
  return (
    <>
      <Breadcrumb title={"Error"} pages={["error"]} />
      <section className="overflow-hidden py-20 bg-champagne-200">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="bg-white rounded-xl shadow-1 px-4 py-10 sm:py-15 lg:py-20 xl:py-25">
            <div className="text-center">
              <Image
                src="/images/404.svg"
                alt="404"
                className="mx-auto mb-8 w-1/2 sm:w-auto"
                width={288}
                height={190}
              />

              <h2 className="font-medium text-onyx text-xl sm:text-2xl mb-3">
                Sorry, the page can&apos;t be found
              </h2>

              <p className="max-w-[410px] w-full mx-auto mb-7.5">
                The page you were looking for appears to have been moved,
                deleted or does not exist.
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

export default Error;
