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
      try {
        const response = await axios.get<Coin[]>("/api/cryptoData");
        setCryptoData(response.data);
      } catch (error) {
        console.error("Error fetching crypto data:", error);
      }
    };

    fetchCryptoData();
  }, []);
  return (
    <div className="mb-12 mt-4 mx-8">
      <Carousel
        opts={{
          align: "start",
        }}
      >
        <CarouselContent className="-ml-1">
          {cryptoData.map((coinData, index) => (
            <CarouselItem
              key={index}
              className="basis-1/2 lg:basis-1/3 xl:basis-1/4 2xl:basis-1/6 pl-1"
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
