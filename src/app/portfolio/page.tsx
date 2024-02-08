"use client";

import { Coin } from "@/components/CoinCard";
import { useCryptoStore } from "@/lib/store";
import axios from "axios";

import { useEffect, useState } from "react";
import CoinForm from "@/components/CoinForm";
import PortfolioCoin from "@/components/PortfolioCoin";
import PortfolioCoinMobile from "@/components/PortfolioCoinMobile";

export type ValueAtBuy = {
  usd: number;
  eur: number;
  aud: number;
  inr: number;
  gbp: number;
  jpy: number;
};

export type PortfolioData = {
  coin: Coin;
  amountOwned: number;
  dateAdded: string;
  valueAtBuy: ValueAtBuy;
};

const Page = () => {
  const [portfolioCoins, setPortfolioCoins] = useState<
    PortfolioData[]
  >([]);
  const cryptoData = useCryptoStore((state) => state.cryptoData);
  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const response = await axios.get("/api/getPortfolio");
        const data = response.data;
        setPortfolioCoins(data);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchPortfolio();
  }, []);

  if (!cryptoData) return null;
  const ids = cryptoData.map((coin) => coin.id);

  return (
    <div className="w-full flex flex-col px-12 md:px-24">
      <div className="flex justify-between items-center w-11/12 mx-auto">
        <div className="text-xl">Portfolio</div>
        <CoinForm cryptoData={cryptoData} />
      </div>
      <div className="flex flex-col justify-center items-center w-full mt-6 mb-32">
        {portfolioCoins &&
          portfolioCoins.map((coin, index) => {
            if (!coin) return null;
            return (
              <div key={index} className="m-4 w-11/12">
                <PortfolioCoin portData={coin} />
                <PortfolioCoinMobile portData={coin} />
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Page;
