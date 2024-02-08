"use client";
import { useEffect, useState, lazy } from "react";
import { Button } from "./ui/button";
import axios from "axios";
import PricesChart from "./PricesChart";
import VolumeChart from "./VolumeChart";
import { cn } from "@/lib/utils";
import CoinCarousel from "./CoinCarousel";
import { ChevronUp, LineChart, X } from "lucide-react";
import { Currency, useCryptoStore } from "@/lib/store";
import { Coin } from "./CoinCard";
import PricesCompare from "./PricesCompare";

const CoinsTable = lazy(() => import("./CoinsTable"));

import Converter from "./Converter";

const LandingPage = () => {
  const [timeframe, setTimeframe] = useState(3);
  const [prices, setPrices] = useState<number[][]>([]);
  const [totalVolumes, setTotalVolumes] = useState<number[][]>([]);
  const [compare, setCompare] = useState<boolean>(
    useCryptoStore.getState().compare
  );
  const cryptoData = useCryptoStore((state) => state.cryptoData);
  const pageType = useCryptoStore((state) => state.pageType);
  const setPageType = useCryptoStore((state) => state.changePageType);
  const sliderPosition =
    pageType === "coins" ? "left-0" : "left-full translate-x-[-100%]";

  const timeframes = ["1D", "7D", "14D", "1M"];
  const selectedCoins = useCryptoStore((state) => state.selectedCoin);
  const selectedCurrency = useCryptoStore(
    (state) => state.currency
  ) as Currency;
  const currencies = {
    USD: 1,
    INR: 83.12,
    EUR: 0.93,
    GBP: 0.8,
    JPY: 148.66,
    AUD: 1.54,
  };
  const currency = currencies[selectedCurrency.currency];
  const prices1 =
    cryptoData.filter((coin) => coin.id === selectedCoins[0])[0] ||
    (cryptoData.filter((coin) => coin.id === "bitcoin")[0] as Coin);
  const prices2 = cryptoData.filter(
    (coin) => coin.id === selectedCoins[1]
  )[0] as Coin;
  useEffect(() => {
    const fetchBitcoinData = async () => {
      try {
        const response = await axios.get("/api/bitcoinData");
        const { prices, total_volumes } = response.data;
        setPrices(prices);
        setTotalVolumes(total_volumes);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchBitcoinData();
  }, [currency, prices1]);

  const toggleCompare = () => {
    useCryptoStore.getState().changeCompare();
    setCompare(!compare);
  };
  return (
    <div className="mx-8 my-4">
      <div className="relative w-full md:w-1/4 h-16 p-1 bg-card/70 rounded-md gap-1 mb-8 mx-8 hidden md:block">
        <div className="relative w-11/12 h-10 m-2 bg-card rounded-md flex items-center gap-1 overflow-hidden">
          <div
            className={`absolute top-0 ${sliderPosition} h-full w-1/2 bg-primary transition-all duration-300 ease-in-out rounded-md`}
            aria-hidden="true"
          ></div>
          <button
            className={cn(
              "relative w-full font-semibold",
              pageType === "coins" && "text-primary-foreground"
            )}
            onClick={() => setPageType("coins")}
          >
            Coins
          </button>
          <button
            className={cn(
              "relative w-full font-semibold transition-colors duration-300 ease-in-out",
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
          <div className="w-full ml-8 pr-16 justify-between flex mb-0 items-center md:items-end">
            <p className="md:text-base text-xs">
              Select the currency to view statistics
            </p>
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
          <CoinCarousel cryptoData={cryptoData} />
          <div className="flex md:flex-row flex-col justify-around gap-5 items-center lg:mx-8">
            {compare ? (
              <>
                <PricesCompare prices={prices1} type={1} />
                {prices2 && (
                  <PricesCompare prices={prices2} type={2} />
                )}
              </>
            ) : (
              <div className="flex flex-col items-center w-full">
                {selectedCoins[0] === "bitcoin" ? (
                  <div className="flex flex-wrap justify-center gap-4 w-full mb-8">
                    <PricesChart
                      prices={prices}
                      timeframe={timeframe}
                      currency={[selectedCurrency, currency]}
                    />
                    <VolumeChart
                      totalVolumes={totalVolumes}
                      timeframe={timeframe}
                      currency={[selectedCurrency, currency]}
                    />
                  </div>
                ) : (
                  <PricesCompare prices={prices1} type={1} />
                )}

                <div className="relative w-full lg:w-1/4 h-16 p-1 bg-card/70 rounded-md gap-1 mb-8 mx-8">
                  <div className="relative w-11/12 h-10 m-2 bg-card rounded-md flex items-center gap-1 overflow-hidden">
                    <div
                      className={cn(
                        "absolute top-0 left-0 h-full w-1/4 bg-primary transition-all duration-300 ease-in-out rounded-md",
                        timeframe === 1 &&
                          "left-full -translate-x-[300%]",
                        timeframe === 2 &&
                          "left-full -translate-x-[200%]",
                        timeframe === 3 &&
                          "left-full -translate-x-[100%]"
                      )}
                      aria-hidden="true"
                    ></div>
                    {timeframes.map((tf, index) => (
                      <button
                        key={index}
                        className={`relative w-full font-semibold z-10 ${
                          index === timeframe
                            ? "text-primary-foreground"
                            : ""
                        }`}
                        onClick={() => {
                          setTimeframe(index);
                          console.log(timeframe);
                        }}
                      >
                        {tf}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <Converter />
      )}
      <CoinsTable coins={cryptoData} />
      <div className="w-full flex justify-center items-center">
        <Button
          onClick={() =>
            window.scrollTo({ top: 0, behavior: "smooth" })
          }
          className="flex flex-col h-12"
          variant={"outline"}
        >
          <ChevronUp />
          Back to top
        </Button>
      </div>
    </div>
  );
};

export default LandingPage;
