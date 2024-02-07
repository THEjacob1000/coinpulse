import { format } from "date-fns";
import { Coin } from "./CoinCard";

import Image from "next/image";
import { useCryptoStore } from "@/lib/store";
import { useEffect, useState } from "react";
import Searchbar from "./SearchBar";
import { Separator } from "./ui/separator";
import { Input } from "./ui/input";

const Converter = () => {
  const cryptoData = useCryptoStore((state) => state.cryptoData);
  const selectedCoins = useCryptoStore((state) => state.selectedCoin);
  const [price1, setPrice1] = useState<Coin>();
  const [price2, setPrice2] = useState<Coin>();
  const [input1, setInput1] = useState<string>("1");
  const [input2, setInput2] = useState<string>("1");
  const [placeholder1, setPlaceholder1] = useState<string>(input1);
  const [placeholder2, setPlaceholder2] = useState<string>(input2);
  const currency = useCryptoStore((state) => state.currency);
  const currencies = {
    USD: 1,
    INR: 83.12,
    EUR: 0.93,
    GBP: 0.8,
    JPY: 148.66,
    AUD: 1.54,
  };
  useEffect(() => {
    const coin1 =
      cryptoData.find((coin) => coin.id === selectedCoins[0]) ||
      cryptoData.find((coin) => coin.id === "bitcoin");
    const coin2 = selectedCoins[1]
      ? cryptoData.find((coin) => coin.id === selectedCoins[1])
      : cryptoData.find((coin) => coin.id === "ethereum");
    setPrice1(coin1);
    setPrice2(coin2);
  }, [cryptoData, selectedCoins]);

  if (!price1 || !price2) return null;

  if (!price1 || !price2) return null;
  const handleInput1Change = (value: string) => {
    setInput1(value);
    const exchangeRate = price2.current_price / price1.current_price;
    const convertedValue = (Number(value) / exchangeRate).toFixed(4);
    setInput2(convertedValue);
    setPlaceholder2(convertedValue);
  };

  const handleInput2Change = (value: string) => {
    setInput2(value);
    const exchangeRate = price1.current_price / price2.current_price;
    const convertedValue = (Number(value) / exchangeRate).toFixed(4);
    setInput1(convertedValue);
    setPlaceholder1(convertedValue);
  };

  const handleInput1Focus = () => {
    setPlaceholder1(input1);
    setInput1("");
  };

  const handleInput2Focus = () => {
    setPlaceholder2(input2);
    setInput2("");
  };

  const handleInput1Blur = () => {
    if (input1 === "") {
      setInput1(placeholder1);
    }
  };

  const handleInput2Blur = () => {
    if (input2 === "") {
      setInput2(placeholder2);
    }
  };

  const price1Converted =
    price1.current_price * currencies[currency.currency];
  const price2Converted =
    price2.current_price * currencies[currency.currency];

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
            <div className="flex items-center gap-2">
              <Input
                type="number"
                placeholder={placeholder1}
                value={input1}
                onFocus={handleInput1Focus}
                onBlur={handleInput1Blur}
                onChange={(e) => handleInput1Change(e.target.value)}
                className="text-right border-none bg-card/0 remove-arrow focus:border-none"
              />
              <span className="text-muted-foreground">
                {price1.symbol.toUpperCase()}
              </span>
            </div>
          </div>
          <Separator className="my-4 bg-muted" />
          <div className="text-sm inline-flex w-full">
            1 {price1.symbol.toLocaleUpperCase()} ={" "}
            {currency.symbol + price1Converted}{" "}
            {currency.currency.toUpperCase()}
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
            <div className="flex items-center gap-2">
              <Input
                type="number"
                placeholder={placeholder2}
                value={input2}
                onFocus={handleInput2Focus}
                onBlur={handleInput2Blur}
                onChange={(e) => handleInput2Change(e.target.value)}
                className="text-right border-none bg-card/0 remove-arrow"
              />
              <span className="text-muted-foreground">
                {price2.symbol.toUpperCase()}
              </span>
            </div>
          </div>
          <Separator className="my-4 bg-muted" />
          <div className="text-sm inline-flex w-full">
            1 {price2.symbol.toLocaleUpperCase()} ={" "}
            {currency.symbol + price2Converted}{" "}
            {currency.currency.toUpperCase()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Converter;
