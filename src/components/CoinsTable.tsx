import {
  DesktopTableCoin,
  desktopColumns,
} from "./desktop-table/columns";
import { DesktopTable } from "./desktop-table/data-table";
import { Coin } from "./CoinCard";
import { MobileTable } from "./mobile-table/data-table";
import {
  MobileTableCoin,
  mobileColumns,
} from "./mobile-table/columns";
import { useState } from "react";

interface CoinsTableProps {
  coins: Coin[];
}

const CoinsTable = ({ coins }: CoinsTableProps) => {
  const [mobileActive, setMobileActive] = useState(0);
  const timeSliderPosition =
    mobileActive === 0
      ? "left-0"
      : `left-full translate-x-[-${(3 - mobileActive) * 100}%]`;
  const timeframes = ["1D", "7D", "1M"];
  const desktopData: DesktopTableCoin[] = coins.map(
    (coin, index) => ({
      id: index + 1,
      name: [coin.image, coin.name],
      price: `$${coin.current_price.toFixed(2)}`,
      hourChange:
        coin.price_change_percentage_1h_in_currency.toFixed(2),
      dayChange: coin.price_change_percentage_24h.toFixed(2),
      weekChange:
        coin.price_change_percentage_7d_in_currency.toFixed(2),
      volumeMarketCap: [coin.total_volume, coin.market_cap],
      circulatingTotalSupply: [
        coin.circulating_supply,
        coin.max_supply,
      ],
      sparkline: coin.sparkline_in_7d.price,
    })
  );
  const mobileData: MobileTableCoin[] = coins.map((coin, index) => ({
    id: index + 1,
    name: [coin.image, coin.name],
    price: [
      coin.current_price,
      mobileActive === 0
        ? coin.price_change_percentage_1h_in_currency
        : mobileActive === 1
        ? coin.price_change_percentage_24h
        : coin.price_change_percentage_7d_in_currency,
    ],
    sparkline: coin.sparkline_in_7d.price,
  }));
  return (
    <div className="w-full">
      <div className="container mx-auto py-10 lg:flex hidden w-full">
        <DesktopTable columns={desktopColumns} data={desktopData} />
      </div>
      <div className="flex flex-col justify-between min-w-full lg:hidden mt-8 items-center">
        <div className="w-full flex justify-between px-12 items-center">
          <h2 className="text-lg font-semibold mb-5">
            Market Overview
          </h2>
          <div className="relative w-1/2 h-16 p-1 bg-card/70 rounded-md gap-1 mb-8">
            <div className="relative w-11/12 h-10 m-2 bg-card rounded-md flex items-center gap-1 overflow-hidden">
              <div
                className={`absolute top-0 ${timeSliderPosition} h-full w-1/3 bg-primary transition-all duration-300 ease-in-out rounded-md`}
                aria-hidden="true"
              ></div>
              {timeframes.map((tf, index) => (
                <button
                  key={index}
                  className={`relative w-full font-semibold z-10 ${
                    index === mobileActive
                      ? "text-primary-foreground"
                      : ""
                  }`}
                  onClick={() => setMobileActive(index)}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>
        </div>
        <MobileTable columns={mobileColumns} data={mobileData} />
      </div>
    </div>
  );
};

export default CoinsTable;
