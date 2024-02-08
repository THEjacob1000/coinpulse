import Image from "next/image";
import { Coin } from "./CoinCard";
import { capitalizeWords } from "@/lib/utils";
import { PortfolioData } from "@/app/portfolio/page";

interface PortfolioCoinProps {
  portData: PortfolioData;
}

const PortfolioCoin = ({ portData }: PortfolioCoinProps) => {
  const coin = portData.data.coin;
  return (
    <div className="flex items-center">
      <div className="flex flex-col w-1/6">
        <div className="bg-card rouned-md">
          <Image
            src={coin.image}
            width={48}
            height={48}
            alt={coin.id}
          />
        </div>
        <div className="text-2xl">{capitalizeWords(coin.id)}</div>
        <div className="text-xl">
          {coin.symbol.toLocaleUpperCase()}
        </div>
      </div>
    </div>
  );
};

export default PortfolioCoin;
