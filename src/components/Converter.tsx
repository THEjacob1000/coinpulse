import { format } from "date-fns";
import { Coin } from "./CoinCard";

import Image from "next/image";
import { useCryptoStore } from "@/lib/store";
import { useEffect, useState } from "react";
import Searchbar from "./SearchBar";

const Converter = () => {
  const cryptoData = useCryptoStore((state) => state.cryptoData);
  const selectedCoins = useCryptoStore((state) => state.selectedCoin);
  const [price1, setPrice1] = useState<Coin>();
  const [price2, setPrice2] = useState<Coin>();
  useEffect(() => {
    setPrice1(
      cryptoData.filter((coin) => coin.id === selectedCoins[0])[0] ||
        (cryptoData.filter(
          (coin) => coin.id === "bitcoin"
        )[0] as Coin)
    );
    setPrice2(
      selectedCoins[1]
        ? (cryptoData.filter(
            (coin) => coin.id === selectedCoins[1]
          )[0] as Coin)
        : (cryptoData.filter(
            (coin) => coin.id === "ethereum"
          )[0] as Coin)
    );
  }, [cryptoData, selectedCoins]);
  if (!price1 || !price2) return null;
  const date = new Date();
  const formattedDate = format(date, "dd/MM/yyyy mm:hh");
  return (
    <div>
      <div className="font-semibold text-lg px-12">
        Online Currency Converter
      </div>
      <div className="text-muted-foreground px-12 mb-8">
        {formattedDate}
      </div>
      <div className="flex justify-center items-center gap-4 flex-col lg:flex-row w-full mx-auto">
        <div className="bg-card rounded-lg flex flex-col p-8 lg:w-5/12 w-5/6">
          <div className="text-sm text-muted-foreground">
            You sell
          </div>
          <div className="flex justify-between items-center mt-12">
            <div className="flex gap-2">
              <Image
                src={price1.image}
                alt={price1.name}
                width={24}
                height={24}
                className="w-8 h-8"
              />
              <Searchbar coin={price1} position="first" />
            </div>
          </div>
        </div>
        <div className="bg-card/50 rounded-lg flex flex-col p-8 w-5/12">
          <div className="text-sm text-muted-foreground">You buy</div>
          <div className="flex justify-between items-center mt-12">
            <div className="flex gap-2">
              <Image
                src={price2.image}
                alt={price2.name}
                width={24}
                height={24}
                className="w-8 h-8"
              />
              <Searchbar
                coin={price2}
                position="second"
                className="bg-card/0"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Converter;
