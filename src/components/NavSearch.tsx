"use client";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useCryptoStore } from "@/lib/store";
import { capitalizeWords, cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { Input } from "./ui/input";
import useMediaQuery from "@/hooks/use-media-query";
import { Drawer, DrawerContent, DrawerTrigger } from "./ui/drawer";
import { Button } from "./ui/button";
import { Coin } from "./CoinCard";
import { useRouter } from "next/navigation";
import { SearchIcon } from "lucide-react";
import Link from "next/link";

const NavSearch = () => {
  const cryptoData = useCryptoStore((state) => state.cryptoData);
  const [active, setActive] = useState(false);
  const dropdownRef = useRef(null);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        (dropdownRef.current as HTMLElement).contains(
          event.target as Node
        )
      ) {
        setActive(true);
      } else {
        setActive(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  if (isDesktop) {
    return (
      <div ref={dropdownRef}>
        {active ? (
          <div className="absolute w-1/5 z-10 top-4">
            <Command className="rounded-lg border border-border/10 shadow-md">
              <CommandInput placeholder="Search..." />
              <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup>
                  {cryptoData
                    .sort((a, b) => (a.id < b.id ? -1 : 1))
                    .map((coin, index) => (
                      <CommandItem
                        key={index}
                        value={coin.id}
                        onSelect={() => setActive(false)}
                      >
                        <Link href={`/coins/${coin.id}`}>
                          {capitalizeWords(coin.id)}
                        </Link>
                      </CommandItem>
                    ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </div>
        ) : (
          <Input
            onClick={() => setActive(true)}
            placeholder="Search..."
            className="rounded-lg border shadow-md w-full"
          />
        )}
      </div>
    );
  }
  return (
    <Drawer open={active} onOpenChange={setActive}>
      <DrawerTrigger
        asChild
        className="rounded-lg border border-border/10 shadow-md bg-card/50"
      >
        <Button
          variant="outline"
          className="w-full justify-start text-muted-foreground"
        >
          <SearchIcon />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mt-4 border-t">
          <CoinList setActive={setActive} />
        </div>
      </DrawerContent>
    </Drawer>
  );
};

function CoinList({
  setActive,
}: {
  setActive: (open: boolean) => void;
}) {
  const cryptoData = useCryptoStore((state) => state.cryptoData);
  const router = useRouter();

  return (
    <Command>
      <CommandInput placeholder="Choose coin..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup>
          {cryptoData.map((coin, index) => (
            <CommandItem
              key={coin.id}
              value={coin.id}
              onSelect={() => setActive(false)}
            >
              <Link href={`/coins/${coin.id}`}>
                {capitalizeWords(coin.id)}
              </Link>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}

export default NavSearch;
