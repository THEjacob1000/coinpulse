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
  return (
    <nav className="flex justify-around items-center py-6">
      <div className="flex items-center justify-between">
        <Image src="/logo.svg" alt="Logo" width={64} height={38} />
        <div className="text-foreground text-xl font-bold ml-8">
          CoinPulse
        </div>
      </div>
      <div className="w-[265px] h-12 justify-start items-start gap-6 inline-flex">
        <Button
          className="px-4 py-3 rounded-md shadow border justify-center items-center gap-2.5 flex"
          variant={"ghost"}
        >
          <div className="w-6 h-6 relative">
            <Home className="w-6 h-6 left-0 top-0 absolute" />
          </div>
          <div className=" text-base font-medium font-['Space Grotesk']">
            Home
          </div>
        </Button>
        <Button
          className="px-4 py-3 rounded-md justify-center items-center gap-2 flex"
          variant={"ghost"}
        >
          <Layers className="w-6 h-6 relative" />
          <div className="text-opacity-50 text-base font-normal font-['Space Grotesk']">
            Portfolio
          </div>
        </Button>
      </div>
      <Searchbar />
      <DropdownMenu>
        <DropdownMenuTrigger className="flex w-24 focus:outline-none">
          <div className="text-background bg-foreground rounded-full h-6 w-6 mr-2">
            {currency.symbol}
          </div>
          {currency.currency}
          <ChevronDown className="w-4 h-4 ml-2 mt-1" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
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
    </nav>
  );
};

export default Navbar;
