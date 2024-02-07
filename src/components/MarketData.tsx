import { useCryptoStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import axios from "axios";
import { Zap } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Progress } from "./ui/progress";
import { Coin } from "./CoinCard";

type MarketData = {
  active_cryptocurrencies: number;
  upcoming_icos: number;
  ongoing_icos: number;
  ended_icos: number;
  markets: number;
  total_market_cap: { [key: string]: number };
  total_volume: { [key: string]: number };
  market_cap_percentage: { [key: string]: number };
  market_cap_change_percentage_24h_usd: number;
  updated_at: number;
};

const MarketData = () => {
  const [marketData, setMarketData] = useState<MarketData>();
  const [cryptoData, setCryptoData] = useState<Coin[]>();
  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const response = await axios.get("/api/marketData");
        const { data } = response.data[0];
        setMarketData(data);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    const fetchCryptoData = async () => {
      try {
        const response = await axios.get<Coin[]>("/api/cryptoData");
        setCryptoData(response.data);
        useCryptoStore.getState().changeCryptoData(response.data);
      } catch (error) {
        console.error("Error fetching crypto data:", error);
      }
    };
    fetchCryptoData();
    fetchMarketData();
  }, []);
  if (!marketData || !cryptoData) return null;
  return (
    <div className="h-12 w-full bg-card flex justify-center gap-10 sm:gap-16 lg:gap-20 items-center z-10 mt-24 md:mt-0">
      <div className="md:flex items-center gap-1 hidden">
        <Zap className="w-4 h-4 mr-1" />
        <div className="text-muted-foreground">Coins</div>
        <div className="text-foreground">
          {marketData.active_cryptocurrencies}
        </div>
      </div>
      <div className="md:flex items-center gap-1 hidden">
        <Image
          src="/convert.svg"
          alt="Markets"
          width={16}
          height={16}
          className="w-4 h-4 mr-1"
        />
        <div className="text-muted-foreground">Markets</div>
        <div className="text-foreground">{marketData.markets}</div>
      </div>
      <div className="flex items-center gap-1">
        <div
          className={cn(
            "w-0 h-0 border-x-4 border-x-transparent border-b-[6px] border-b-cyan-400 inline-block mr-1",
            marketData.market_cap_change_percentage_24h_usd < 0
              ? "rotate-180 border-b-rose-500"
              : "border-b-cyan-400"
          )}
        />
        <div>
          {marketData.market_cap_change_percentage_24h_usd.toFixed(3)}
          %
        </div>
      </div>
      <div className="flex items-center gap-1">
        <Image
          src={cryptoData[0].image}
          alt="Bitcoin"
          width={16}
          height={16}
          className="w-7 h-7 mr-1"
        />
        <div>{Math.floor(marketData.market_cap_percentage.btc)}%</div>
        <Progress
          value={Math.floor(marketData.market_cap_percentage.btc)}
          className="h-2 w-20 bg-slate-600/80"
          indicatorColor="bg-orange-400"
        />
      </div>
      <div className="flex items-center gap-1">
        <Image
          src={cryptoData[1].image}
          alt="Ethereum"
          width={16}
          height={16}
          className="w-7 h-7 mr-1"
        />
        <div>{Math.floor(marketData.market_cap_percentage.eth)}%</div>
        <Progress
          value={Math.floor(marketData.market_cap_percentage.eth)}
          className="h-2 w-20 bg-slate-600/80"
          indicatorColor="bg-blue-400"
        />
      </div>
    </div>
  );
};

export default MarketData;
