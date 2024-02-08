import Image from "next/image";
import { Coin } from "./CoinCard";
import { capitalizeWords, cn } from "@/lib/utils";
import { PortfolioData, ValueAtBuy } from "@/app/portfolio/page";
import { Edit } from "lucide-react";
import { useCryptoStore } from "@/lib/store";
import { Progress } from "./ui/progress";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { format } from "date-fns";

interface PortfolioCoinProps {
  portData: PortfolioData;
}

const PortfolioCoin = ({ portData }: PortfolioCoinProps) => {
  const coin = portData.coin;
  const selectedCurrency = useCryptoStore((state) => state.currency);
  const currencies = {
    USD: 1,
    INR: 83.12,
    EUR: 0.93,
    GBP: 0.8,
    JPY: 148.66,
    AUD: 1.54,
  };

  const currency = currencies[selectedCurrency.currency];
  const currencyKey =
    selectedCurrency.currency.toLowerCase() as keyof ValueAtBuy;
  // console.log(portData);
  const startingPrice =
    portData.valueAtBuy[currencyKey] * portData.amountOwned;
  const currentPrice =
    coin.current_price * currency * portData.amountOwned;
  return (
    <div className="flex items-center bg-accent/40 min-w-full">
      <div className="flex flex-col min-w-1/6 justify-center items-center p-4 gap-8 flex-grow">
        <div className="bg-primary/10 p-4 rounded-md">
          <Image
            src={coin.image}
            width={64}
            height={64}
            alt={coin.id}
            className="h-16 w-16"
          />
        </div>
        <div className="text-2xl">
          {`${capitalizeWords(
            coin.id
          )} (${coin.symbol.toUpperCase()})`}
        </div>
      </div>
      <div className="flex flex-col w-5/6 bg-card/90 flex-grow">
        <div className="flex flex-col w-full p-4 px-6 gap-6">
          <div className="flex justify-between items-center w-full">
            <div className="text-xl font-semibold">Market Price</div>
            <Button className="p-2">
              <Edit />
            </Button>
          </div>
          <div className="flex justify-between items-center w-full">
            <div className="flex flex-col gap-2 justify-center items-stretch">
              <div>Current price</div>
              <div className="text-cyan-400 justify-center flex">
                {selectedCurrency.symbol +
                  Math.floor(
                    coin.current_price * currency
                  ).toLocaleString()}
              </div>
            </div>
            <div className="flex flex-col gap-2 justify-center items-stretch">
              <div>Price Change 24h</div>
              <div className="inline-flex gap-2 justify-center">
                <div
                  className={cn(
                    "w-0 h-0 border-x-[5px] border-x-transparent border-b-8 border-b-cyan-400 inline-block mt-1",
                    coin.price_change_percentage_24h < 0
                      ? "rotate-180 border-b-rose-500"
                      : "border-b-cyan-400"
                  )}
                />
                <div
                  className={cn(
                    "text-right font-normal font-['Space Grotesk'] leading-none",
                    coin.price_change_percentage_24h < 0
                      ? "text-rose-500"
                      : "text-cyan-400"
                  )}
                >
                  {selectedCurrency.symbol +
                    Math.floor(
                      coin.price_change_24h * currency
                    ).toLocaleString()}
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2 justify-center items-stretch">
              <div>Market Cap vs Volume</div>
              <Progress
                value={coin.market_cap / coin.total_volume}
                indicatorColor="bg-cyan-400"
              />
            </div>
            <div className="flex flex-col gap-2 justify-center items-stretch">
              <div>Circ Supply</div>
              <div className="text-cyan-400 flex justify-end">
                {Math.floor(coin.circulating_supply).toLocaleString()}
              </div>
            </div>
          </div>
          <Separator className="bg-foreground/50" />
          <div className="flex justify-start items-center w-full">
            <div className="text-xl font-semibold">Your coin</div>
          </div>
          <div className="flex justify-between items-center w-full">
            <div className="flex flex-col gap-2 justify-center items-stretch">
              <div>Coin Amount</div>
              <div className="text-cyan-400 flex justify-center">
                {portData.amountOwned.toFixed(3)}
              </div>
            </div>
            <div className="flex flex-col gap-2 justify-center items-stretch">
              <div>Profit / Loss</div>
              <div className="inline-flex gap-2">
                <div
                  className={cn(
                    "w-0 h-0 border-x-[5px] border-x-transparent border-b-8 border-b-cyan-400 inline-block mt-1",
                    currentPrice - startingPrice < 0
                      ? "rotate-180 border-b-rose-500"
                      : "border-b-cyan-400"
                  )}
                />
                <div
                  className={cn(
                    "text-right font-normal font-['Space Grotesk'] leading-none flex justify-center",
                    currentPrice - startingPrice < 0
                      ? "text-rose-500"
                      : "text-cyan-400"
                  )}
                >
                  {selectedCurrency.symbol +
                    (currentPrice - startingPrice).toLocaleString()}
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2 justify-center items-stretch">
              <div>% Increase since purchase</div>
              <div className="inline-flex gap-2 justify-center">
                <div
                  className={cn(
                    "w-0 h-0 border-x-[5px] border-x-transparent border-b-8 border-b-cyan-400 inline-block mt-1",
                    currentPrice / startingPrice < 0
                      ? "rotate-180 border-b-rose-500"
                      : "border-b-cyan-400"
                  )}
                />
                <div
                  className={cn(
                    "text-right font-normal font-['Space Grotesk'] leading-none",
                    currentPrice / startingPrice < 0
                      ? "text-rose-500"
                      : "text-cyan-400"
                  )}
                >
                  {selectedCurrency.symbol +
                    (currentPrice / startingPrice).toFixed(2)}
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2 justify-center items-stretch">
              <div>Purchase date</div>
              <div className="text-cyan-400 flex justify-end">
                {format(portData.dateAdded, "dd MMM yyyy")}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioCoin;
