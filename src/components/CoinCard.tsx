import { useCryptoStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Button } from "./ui/button";
import { useState } from "react";

export type Coin = {
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  circulating_supply: number;
  current_price: number;
  fully_diluted_valuation: number;
  high_24h: number;
  id: string;
  image: string;
  last_updated: string;
  low_24h: number;
  market_cap: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  market_cap_rank: number;
  max_supply: number | null;
  name: string;
  price_change_24h: number;
  price_change_percentage_1h_in_currency: number;
  price_change_percentage_7d_in_currency: number;
  price_change_percentage_24h: number;
  price_change_percentage_24h_in_currency: number;
  roi: {
    times: number;
    currency: string;
    percentage: number;
  } | null;
  sparkline_in_7d: {
    price: number[];
  };
  symbol: string;
  total_supply: number;
  total_volume: number;
};

type CoinCardProps = {
  coin: Coin;
};
const CoinCard = ({ coin }: CoinCardProps) => {
  const [selected, setSelected] = useState<boolean>(
    useCryptoStore.getState().selectedCoin.includes(coin.id)
  );
  const toggleSelected = () => {
    const { changeSelectedCoin } = useCryptoStore.getState();
    changeSelectedCoin(coin.id);
    setSelected(!selected);
  };

  return (
    <Button
      variant={selected ? "default" : "secondary"}
      className="flex justify-center h-20 w-full p-4 rounded-md gap-4 font-['Space Grotesk']"
      onClick={toggleSelected}
    >
      <Image src={coin.image} alt={coin.id} width={50} height={50} />
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <div className="truncate max-w-24 inline-block whitespace-nowrap">
            {coin.name}
          </div>
          <div>
            (<span className="uppercase">{coin.symbol}</span>)
          </div>
        </div>
        <div className="inline-flex">
          <div>
            {coin.current_price}{" "}
            {useCryptoStore.getState().currency.currency}
          </div>
          <div className="h-4 justify-start items-start gap-1 inline-flex ml-3 mt-1">
            <div
              className={cn(
                "w-0 h-0 border-x-4 border-x-transparent border-b-[6px] border-b-cyan-400 inline-block mt-1",
                coin.price_change_percentage_24h < 0
                  ? "rotate-180 border-b-rose-500"
                  : "border-b-cyan-400"
              )}
            />
            <div
              className={cn(
                "text-right text-sm font-normal font-['Space Grotesk'] leading-none",
                coin.price_change_percentage_24h < 0
                  ? "text-rose-500"
                  : "text-cyan-400"
              )}
            >
              {coin.price_change_percentage_24h.toFixed(2)}%
            </div>
          </div>
        </div>
      </div>
    </Button>
  );
};

export default CoinCard;
