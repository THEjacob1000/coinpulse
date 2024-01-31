"use client";
import { ChevronDown, Home, Layers } from "lucide-react";
import Image from "next/image";
import { Button } from "./ui/button";
import Searchbar from "./searchbar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useState } from "react";
import { ModeToggle } from "./mode-toggle";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

const Navbar = () => {
  const [currency, setCurrency] = useState({
    symbol: "$",
    currency: "USD",
  });
  const currencies = [
    { symbol: "$", currency: "USD" },
    { symbol: "₹", currency: "INR" },
    { symbol: "€", currency: "EUR" },
    { symbol: "£", currency: "GBP" },
    { symbol: "¥", currency: "JPY" },
    { symbol: "$", currency: "AUD" },
  ];
  const pathname = usePathname();
  const { theme } = useTheme();
  return (
    <nav
      className={cn(
        "flex justify-between md:justify-around items-center py-6 bg-secondary min-w-full",
        theme === "light" ? "bg-white" : "bg-background"
      )}
    >
      <div className="flex items-center justify-between">
        <Image src="/logo.svg" alt="Logo" width={64} height={38} />
        <div className="text-foreground text-xl font-bold ml-8 md:block hidden">
          CoinPulse
        </div>
      </div>
      <div className="w-[265px] h-12 justify-start items-start gap-6 hidden md:inline-flex">
        <Button
          className="px-4 py-3 rounded-md justify-center items-center gap-2 flex hover:bg-background/40"
          variant={"ghost"}
        >
          <Home className="w-6 h-6" />
          <div
            className={cn(
              "text-base font-medium font-['Space Grotesk']",
              pathname === "/" &&
                "font-bold underline-offset-4 underline"
            )}
          >
            Home
          </div>
        </Button>
        <Button
          className={cn(
            "px-4 py-3 rounded-md justify-center items-center gap-2 flex hover:bg-background/40",
            pathname === "/portfolio" &&
              "font-bold underline-offset-4 underline"
          )}
          variant={"ghost"}
        >
          <Layers className="w-6 h-6" />
          <div className="text-opacity-50 text-base font-normal font-['Space Grotesk']">
            Portfolio
          </div>
        </Button>
      </div>
      <div className="flex justify-between w-1/4 items-center gap-2">
        <Searchbar />
        <DropdownMenu>
          <DropdownMenuTrigger className="focus:outline-none">
            <div className="flex bg-card/40 px-3 py-2 rounded-lg h-10">
              <div className="text-background bg-foreground rounded-full h-6 w-6 mr-2 lg:block hidden">
                {currency.symbol}
              </div>
              {currency.currency}
              <ChevronDown className="w-4 h-4 ml-2 mt-1" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-card/50 border-input/5">
            {currencies
              .filter((c) => c.currency !== currency.currency)
              .map((c, index) => (
                <DropdownMenuItem
                  key={index}
                  onClick={() => setCurrency(c)}
                  className="flex items-center justify-between hover:cursor-pointer"
                >
                  ( {c.symbol} ){" "}
                  <span className="ml-2">{c.currency}</span>
                  <div aria-hidden="true" className="w-8" />
                </DropdownMenuItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <ModeToggle />
      </div>
    </nav>
  );
};

export default Navbar;
