"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useCryptoStore } from "@/lib/store";
import { Coin } from "./CoinCard";
import useMediaQuery from "@/hooks/use-media-query";
import { capitalizeWords, cn } from "@/lib/utils";

interface SearchbarProps {
  coin?: Coin;
  className?: string;
  position: "first" | "second";
}

const Searchbar = ({ coin, className, position }: SearchbarProps) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [open, setOpen] = React.useState(false);
  const [selectedCoin, setSelectedCoin] = React.useState<Coin | null>(
    coin || null
  );

  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          asChild
          className={cn("border-none bg-card", className)}
        >
          <Button
            variant="outline"
            className="w-full justify-start text-2xl"
          >
            {selectedCoin ? (
              <>
                {capitalizeWords(selectedCoin.id) +
                  " (" +
                  selectedCoin.symbol.toLocaleUpperCase() +
                  ")"}
              </>
            ) : (
              <>Search...</>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-fit p-0" align="start">
          <CoinList
            setOpen={setOpen}
            setSelectedCoin={setSelectedCoin}
            position={position}
          />
        </PopoverContent>
      </Popover>
    );
  }
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger
        asChild
        className={cn("border-none bg-card", className)}
      >
        <Button
          variant="outline"
          className="w-full justify-start text-2xl"
        >
          {selectedCoin ? (
            <>{capitalizeWords(selectedCoin.id)}</>
          ) : (
            <>Search...</>
          )}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mt-4 border-t">
          <CoinList
            setOpen={setOpen}
            setSelectedCoin={setSelectedCoin}
            position={position}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
};
function CoinList({
  setOpen,
  setSelectedCoin,
  position,
}: {
  setOpen: (open: boolean) => void;
  setSelectedCoin: (coin: Coin | null) => void;
  position: "first" | "second";
}) {
  const cryptoData = useCryptoStore((state) => state.cryptoData);

  return (
    <Command>
      <CommandInput placeholder="Choose coin..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup>
          {cryptoData.map((coin, index) => (
            <CommandItem
              key={coin.id}
              className="cursor-pointer"
              value={coin.id}
              onSelect={(value) => {
                const newCoin =
                  cryptoData.find((c) => c.id === value) || null;

                if (newCoin) {
                  setSelectedCoin(newCoin);

                  const currentSelectedCoins =
                    useCryptoStore.getState().selectedCoin;
                  let updatedSelectedCoins = [
                    ...currentSelectedCoins,
                  ];

                  if (position === "first") {
                    updatedSelectedCoins[0] = newCoin.id;
                  } else {
                    if (updatedSelectedCoins.length < 2) {
                      updatedSelectedCoins.push(newCoin.id);
                    } else {
                      updatedSelectedCoins[1] = newCoin.id;
                    }
                  }

                  useCryptoStore
                    .getState()
                    .setSelectedCoins(updatedSelectedCoins);

                  setOpen(false);
                }
              }}
            >
              {capitalizeWords(coin.id)}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
export default Searchbar;
