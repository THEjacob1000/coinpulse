"use client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import CoinCard, { Coin } from "./CoinCard";
import { useCryptoStore } from "@/lib/store";
import { Skeleton } from "./ui/skeleton";
import { cn } from "@/lib/utils";

interface CoinCarouselProps {
  cryptoData: Coin[];
}

const CoinCarousel = ({ cryptoData }: CoinCarouselProps) => {
  const loading = useCryptoStore((state) => state.cryptoDataLoading);
  return (
    <div className="mb-12 mt-4 mx-8">
      <Carousel
        opts={{
          align: "start",
        }}
      >
        <CarouselContent className="-ml-1">
          <>
            {loading
              ? Array.from({ length: 6 }).map((_, index) => (
                  <CarouselItem
                    key={index}
                    className="basis-1/3 xl:basis-1/4 2xl:basis-1/6 pl-1"
                  >
                    <div
                      className={cn(
                        "flex justify-center h-20 w-full p-4 rounded-md md:gap-4 gap-2 font-['Space Grotesk']",
                        "bg-secondary/40"
                      )}
                    >
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="md:flex flex-col hidden">
                        <div className="flex items-center gap-2">
                          <Skeleton className="h-4 w-24 mb-2" />
                          <Skeleton className="h-4 w-10" />
                        </div>
                        <div className="inline-flex">
                          <Skeleton className="h-4 w-24" />
                          <div className="flex items-center ml-3">
                            <Skeleton className="h-4 w-4" />
                            <Skeleton className="h-4 w-10 ml-1" />
                          </div>
                        </div>
                      </div>
                      <Skeleton className="h-4 w-10 md:hidden" />
                    </div>
                  </CarouselItem>
                ))
              : cryptoData.map((coinData, index) => (
                  <CarouselItem
                    key={index}
                    className="basis-1/3 xl:basis-1/4 2xl:basis-1/6 pl-1"
                  >
                    <CoinCard coin={coinData} />
                  </CarouselItem>
                ))}
          </>
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};

export default CoinCarousel;
