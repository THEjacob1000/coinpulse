"use client";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import axios from "axios";
import PricesChart from "./PricesChart";
import VolumeChart from "./VolumeChart";

const LandingPage = () => {
  const [pageType, setPageType] = useState("coins");
  const [marketCaps, setMarketCaps] = useState<number[][]>();
  const [prices, setPrices] = useState<number[][]>([]);
  const [totalVolumes, setTotalVolumes] = useState<number[][]>([]);
  const sliderPosition =
    pageType === "coins" ? "left-0" : "left-full translate-x-[-100%]";

  useEffect(() => {
    const fetchBitcoinData = async () => {
      const options = {
        method: "GET",
        url: "https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=180&interval=daily",
      };

      try {
        const response = await axios.request(options);
        console.log("Response data:", response.data);
        setMarketCaps(response.data.market_caps);
        setPrices(response.data.prices);
        setTotalVolumes(response.data.total_volumes);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchBitcoinData();
  }, []);
  return (
    <div className="mx-8 my-24">
      <div className="relative w-full md:w-1/4 h-12 p-1 bg-card rounded-md flex items-center gap-1 mb-20 overflow-hidden mx-8">
        <div
          className={`absolute top-0 ${sliderPosition} h-full w-1/2 bg-primary transition-all duration-300 ease-in-out rounded-md`}
          aria-hidden="true"
        ></div>
        <button
          className="relative w-full font-semibold z-10"
          onClick={() => setPageType("coins")}
        >
          Coins
        </button>
        <button
          className="relative w-full font-semibold z-10"
          onClick={() => setPageType("converter")}
        >
          Converter
        </button>
      </div>
      {pageType === "coins" ? (
        <div className="flex md:flex-row flex-col justify-around gap-2.5 mx-8 w-10/12 items-center">
          <PricesChart prices={prices} />
          <VolumeChart totalVolumes={totalVolumes} />
        </div>
      ) : (
        <div>Converter</div>
      )}
    </div>
  );
};

export default LandingPage;
