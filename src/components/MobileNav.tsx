"use client";

import { useCryptoStore } from "@/lib/store";
import Link from "next/link";
import { Button } from "./ui/button";
import { Layers, LineChart } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";

const MobileNav = () => {
  const pageType = useCryptoStore((state) => state.pageType);
  const setPageType = useCryptoStore((state) => state.changePageType);
  const pathname = usePathname();
  return (
    <div className="w-full flex justify-center items-center">
      <div className="w-full md:hidden h-24 p-1 bg-card/70 rounded-md gap-1 z-50 block fixed bottom-0">
        <div className="relative w-[97%] m-2 bg-card rounded-md flex items-center gap-1 overflow-hidden">
          <Link href="/" className="w-1/3">
            <Button
              className="flex flex-col w-full h-fit"
              onClick={() => setPageType("coins")}
              variant={
                pageType === "coins" && pathname === "/"
                  ? "default"
                  : "secondary"
              }
            >
              <LineChart className="h-8 w-8" />
              Overview
            </Button>
          </Link>
          <Link href="/" className="w-1/3">
            <Button
              className="flex flex-col w-full h-fit"
              onClick={() => setPageType("converter")}
              variant={
                pageType === "converter" && pathname === "/"
                  ? "default"
                  : "secondary"
              }
            >
              <Image
                src="convert.svg"
                width={50}
                height={50}
                alt="conversion"
                className="h-8 w-8"
              />
              Converter
            </Button>
          </Link>
          <Link href="/portfolio" className="w-1/3">
            <Button
              className="flex flex-col w-full h-fit"
              variant={
                pathname === "/portfolio" ? "default" : "secondary"
              }
            >
              <Layers className="h-8 w-8" />
              Portfolio
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MobileNav;
