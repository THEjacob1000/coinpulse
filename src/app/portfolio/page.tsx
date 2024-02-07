"use client";

import { Coin } from "@/components/CoinCard";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import z from "zod";
import { useCryptoStore } from "@/lib/store";
import { capitalizeWords, cn } from "@/lib/utils";
import axios from "axios";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/components/ui/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import Image from "next/image";

const FormSchema = z.object({
  coinId: z.string({
    required_error: "Please select a language.",
  }),
  amount: z
    .number({
      required_error: "Please enter an amount.",
    })
    .min(0, "Amount can't be lower than 0."),
  dateAdded: z.date({
    required_error: "Please select a date.",
  }),
});

const Page = () => {
  const [portfolioCoins, setPortfolioCoins] = useState<Coin[]>([]);
  const [coin, setCoin] = useState<Coin>();
  const cryptoData = useCryptoStore((state) => state.cryptoData);
  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const response = await axios.get("/api/portfolio");
        const data = response.data;
        setPortfolioCoins(data);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchPortfolio();
  });
  useEffect(() => {
    setCoin(cryptoData[0]);
  }, [cryptoData]);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });
  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">
            {JSON.stringify(data, null, 2)}
          </code>
        </pre>
      ),
    });
  }
  if (!cryptoData) return null;
  const ids = cryptoData.map((coin) => coin.id);
  const formattedIds = ids.map((id) => capitalizeWords(id));

  return (
    <div className="w-full flex flex-col px-12 md:px-24">
      <div className="flex justify-between items-center">
        <div className="text-xl">Portfolio</div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="px-12">Add Asset</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-5/6">
            <DialogHeader>
              <DialogTitle>Select Coins</DialogTitle>
            </DialogHeader>
            <div className="flex justify-between">
              {coin && (
                <div className="bg-card rounded-md flex flex-col p-12 justify-center items-center">
                  <Image
                    src={coin.image}
                    alt={coin.name}
                    width={48}
                    height={48}
                    className="w-12 h-12"
                  />
                  <div>
                    {capitalizeWords(coin.id)} (
                    {coin.symbol.toLocaleUpperCase()})
                  </div>
                </div>
              )}
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="coinId"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                className={cn(
                                  "w-[200px] justify-between",
                                  !field.value &&
                                    "text-muted-foreground"
                                )}
                              >
                                {field.value
                                  ? cryptoData.find(
                                      (coin) =>
                                        coin.id === field.value
                                    )?.id &&
                                    capitalizeWords(field.value)
                                  : coin
                                  ? capitalizeWords(coin.id)
                                  : "Select coin"}
                                <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-[200px] p-0">
                            <Command>
                              <CommandInput
                                placeholder="Search coins..."
                                className="h-9"
                              />
                              <CommandEmpty>
                                No coins found.
                              </CommandEmpty>
                              <CommandGroup>
                                {cryptoData.map((coin: Coin) => (
                                  <CommandItem
                                    value={capitalizeWords(coin.id)}
                                    key={coin.id}
                                    onSelect={() => {
                                      form.setValue(
                                        "coinId",
                                        coin.id
                                      );
                                      setCoin(coin);
                                    }}
                                  >
                                    {capitalizeWords(coin.id)}
                                    <CheckIcon
                                      className={cn(
                                        "ml-auto h-4 w-4",
                                        coin.id === field.value
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit">Save and Continue</Button>
                </form>
              </Form>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Page;
