import Image from "next/image";
import { Coin } from "./CoinCard";
import { capitalizeWords, cn } from "@/lib/utils";
import { PortfolioData, ValueAtBuy } from "@/app/portfolio/page";
import { Edit, Triangle } from "lucide-react";
import { useCryptoStore } from "@/lib/store";
import { Progress } from "./ui/progress";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { format } from "date-fns";
import CoinEdit from "./CoinEdit";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

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
  const cryptoData = useCryptoStore((state) => state.cryptoData);
  const updatedCoinData = cryptoData.find((c) => c.id === coin.id);
  const currency = currencies[selectedCurrency.currency];
  const currencyKey =
    selectedCurrency.currency.toLowerCase() as keyof ValueAtBuy;
  // console.log(portData);
  if (!updatedCoinData) return null;
  const startingPrice =
    portData.valueAtBuy[currencyKey] * portData.amountOwned;
  const currentPrice =
    updatedCoinData.current_price * currency * portData.amountOwned;
  const difference = currentPrice - startingPrice;
  return (
    <div className="flex md:hidden flex-col bg-accent/40 rounded-lg justify-center items-center p-6">
      <div className="flex justify-between items-center w-full">
        <div className="flex flex-col">
          <div className="text-lg">
            {capitalizeWords(portData.coin.id)}{" "}
            <span className="uppercase">
              ({portData.coin.symbol})
            </span>
          </div>
          <div className="text-muted-foreground">
            Purchased {format(portData.dateAdded, "dd MMM yyyy")}
          </div>
        </div>
        <Image
          src={portData.coin.image}
          width={64}
          height={64}
          alt={portData.coin.id}
          className="rounded-full h-16 w-16"
        />
      </div>
      <div className="w-11/12 mx-auto grid grid-cols-2 grid-rows-2 gap-2 mt-4">
        <Card className="w-full flex justify-center items-center">
          <CardHeader>
            <CardTitle>
              {selectedCurrency.symbol +
                updatedCoinData.current_price.toLocaleString()}
            </CardTitle>
            <CardDescription>Current price</CardDescription>
          </CardHeader>
        </Card>
        <Card className="w-full flex justify-center items-center">
          <CardHeader>
            <CardTitle
              className={cn(
                "flex justify-center items-center",
                updatedCoinData.price_change_percentage_24h < 0
                  ? "text-rose-500"
                  : "text-cyan-400"
              )}
            >
              <Triangle
                fill="cyan"
                className={cn(
                  "h-2 w-2 mr-1",
                  updatedCoinData.price_change_24h < 0 && "rotate-180"
                )}
              />
              %
              {updatedCoinData.price_change_percentage_24h.toFixed(2)}
            </CardTitle>
            <CardDescription className="ml-4">24h%</CardDescription>
          </CardHeader>
        </Card>
        <Card className="w-full flex justify-center items-center">
          <CardHeader>
            <CardTitle>
              {selectedCurrency.symbol +
                currentPrice.toLocaleString()}
            </CardTitle>
            <CardDescription>Current owned</CardDescription>
          </CardHeader>
        </Card>
        <Card className="w-full flex justify-center items-center">
          <CardHeader>
            <CardTitle
              className={cn(
                "flex justify-center items-center gap-1",
                difference < 0 ? "text-rose-500" : "text-cyan-400"
              )}
            >
              <div
                className={cn(
                  "w-0 h-0 border-x-2.5 border-x-transparent border-b-8 inline-block",
                  difference < 0
                    ? "rotate-180 border-b-rose-500"
                    : "border-b-cyan-400"
                )}
              />
              <Triangle
                fill="cyan"
                className={cn(
                  "h-2 w-2 mr-1",
                  difference < 0 && "rotate-180"
                )}
              />
              {selectedCurrency.symbol + difference.toFixed(2)}
            </CardTitle>
            <CardDescription className="ml-5">
              Profit / Loss
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
};

export default PortfolioCoin;
