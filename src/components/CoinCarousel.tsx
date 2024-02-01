"use client";
import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import axios from "axios";
import CoinCard, { Coin } from "./CoinCard";

const CoinCarousel = () => {
  const [cryptoData, setCryptoData] = useState<Coin[]>([]);
  useEffect(() => {
    const fetchCryptoData = async () => {
      const options = {
        method: "GET",
        url: "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=true&price_change_percentage=1h%2C24h%2C7d",
      };

      try {
        const response = await axios.request(options);
        // console.log("Response data:", response.data);
        setCryptoData(response.data);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchCryptoData();
  }, []);
  return (
    <div className="my-12 mx-8">
      <Carousel
        opts={{
          align: "start",
        }}
      >
        <CarouselContent className="-ml-1">
          {cryptoData.map((coinData, index) => (
            <CarouselItem
              key={index}
              className="md:basis-1/2 lg:basis-2/12 pl-1"
            >
              <CoinCard coin={coinData} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};

export default CoinCarousel;
