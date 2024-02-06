"use client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import CoinCard, { Coin } from "./CoinCard";

interface CoinCarouselProps {
  cryptoData: Coin[];
}

const CoinCarousel = ({ cryptoData }: CoinCarouselProps) => {
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
              className="basis-1/3 xl:basis-1/4 2xl:basis-1/6 pl-1"
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
