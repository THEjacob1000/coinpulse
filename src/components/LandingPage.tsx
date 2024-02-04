"use client";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import axios from "axios";
import PricesChart from "./PricesChart";
import VolumeChart from "./VolumeChart";
import { cn } from "@/lib/utils";
import CoinCarousel from "./CoinCarousel";
import { LineChart, X } from "lucide-react";
import { useCryptoStore } from "@/lib/store";

const LandingPage = () => {
  const [pageType, setPageType] = useState("coins");
  const [marketCaps, setMarketCaps] = useState<number[][]>();
  const [prices, setPrices] = useState<number[][]>([]);
  const [totalVolumes, setTotalVolumes] = useState<number[][]>([]);
  const [compare, setCompare] = useState<boolean>(
    useCryptoStore.getState().compare
  );
  const sliderPosition =
    pageType === "coins" ? "left-0" : "left-full translate-x-[-100%]";

  useEffect(() => {
    const fetchBitcoinData = async () => {
      try {
        const response = await axios.get("/api/bitcoinData"); // Adjust the path if your API route's path is different
        const { market_caps, prices, total_volumes } = response.data;
        setMarketCaps(market_caps);
        setPrices(prices);
        setTotalVolumes(total_volumes);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchBitcoinData();
  }, []);
  const toggleCompare = () => {
    useCryptoStore.getState().changeCompare();
    setCompare(!compare);
  };
  return (
    <div className="mx-8 my-12">
      <div className="relative w-full md:w-1/4 h-16 p-1 bg-card/70 rounded-md gap-1 mb-8 mx-8">
        <div className="relative w-11/12 h-10 m-2 bg-card rounded-md flex items-center gap-1 overflow-hidden">
          <div
            className={`absolute top-0 ${sliderPosition} h-full w-1/2 bg-primary transition-all duration-300 ease-in-out rounded-md`}
            aria-hidden="true"
          ></div>
          <button
            className={cn(
              "relative w-full font-semibold z-10",
              pageType === "coins" && "text-primary-foreground"
            )}
            onClick={() => setPageType("coins")}
          >
            Coins
          </button>
          <button
            className={cn(
              "relative w-full font-semibold z-10 transition-colors duration-300 ease-in-out",
              pageType === "converter" && "text-primary-foreground"
            )}
            onClick={() => setPageType("converter")}
          >
            Converter
          </button>
        </div>
      </div>
      {pageType === "coins" ? (
        <div className="flex flex-col">
          <div className="w-full ml-8 pr-16 justify-between flex mb-0 items-end">
            <p>Select the currency to view statistics</p>
            <Button
              className="p-6 text-md"
              variant={"secondary"}
              onClick={toggleCompare}
            >
              {compare ? (
                <X className="mr-3 h-6 w-6" strokeWidth={2} />
              ) : (
                <LineChart className="mr-3 h-6 w-6" strokeWidth={2} />
              )}
              {compare ? "Stop Comparing" : "Compare"}
            </Button>
          </div>
          <CoinCarousel />
          <div className="flex md:flex-row flex-col justify-around gap-5 items-center md:mx-8 mx-4">
            <PricesChart prices={prices} />
            <VolumeChart totalVolumes={totalVolumes} />
          </div>
        </div>
      ) : (
        <div>Converter</div>
      )}
    </div>
  );
};

export default LandingPage;
