"use client";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import axios from "axios";

const LandingPage = () => {
  const [pageType, setPageType] = useState("coins");
  const [marketCaps, setMarketCaps] = useState<number[][]>();
  const [prices, setPrices] = useState<number[][]>([]);
  const [totalVolumes, setTotalVolumes] = useState<number[][]>([]);
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
    <div className="mx-24 my-24">
      <div className="w-1/4 p-1 bg-card rounded-md justify-start items-start inline-flex gap-1 mb-20">
        <Button
          className="w-full font-semibold"
          variant={pageType !== "coins" ? "ghost" : "default"}
          onClick={() => setPageType("coins")}
        >
          Coins
        </Button>
        <Button
          className="w-full font-semibold"
          variant={pageType !== "converter" ? "ghost" : "default"}
          onClick={() => setPageType("converter")}
        >
          Converter
        </Button>
      </div>
      {pageType === "coins" ? (
        <div>{marketCaps}</div>
      ) : (
        <div>Converter</div>
      )}
    </div>
  );
};

export default LandingPage;
