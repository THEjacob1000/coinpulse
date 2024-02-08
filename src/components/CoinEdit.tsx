"use client";

import { Coin } from "@/components/CoinCard";
import { CalendarIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import z from "zod";
import { capitalizeWords, cn } from "@/lib/utils";
import axios from "axios";

import { Controller, useForm } from "react-hook-form";
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

import Image from "next/image";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { useEffect, useState } from "react";
import { PortfolioData } from "@/app/portfolio/page";
import { useCryptoStore } from "@/lib/store";
import { Edit } from "lucide-react";

const FormSchema = z.object({
  amount: z
    .number({
      required_error: "Please enter an amount.",
    })
    .min(0, "Amount can't be lower than 0."),
  dateAdded: z.date({
    required_error: "Please select a date.",
  }),
});

interface CoinFormProps {
  portData: PortfolioData;
}

const CoinForm = ({ portData }: CoinFormProps) => {
  const [coin, setCoin] = useState<Coin>();
  useEffect(() => {
    setCoin(portData.coin);
  }, [portData]);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      amount: portData.amountOwned,
      dateAdded: new Date(),
    },
  });
  function onSubmit(data: z.infer<typeof FormSchema>) {
    // console.log(format(data.dateAdded, "dd-MM-yyyy"));
    const fetchPrice = async () => {
      try {
        const response = await axios.get(
          `/api/historicalData?coinId=${
            portData.coin.id
          }&date=${format(data.dateAdded, "dd-MM-yyyy")}`
        );
        const coinData = await response.data;
        return coinData;
      } catch (error) {
        console.error("Error:", error);
        return 1;
      }
    };

    fetchPrice().then((fetchedPrice) => {
      const newCoin = portData.coin;
      const portfolioData = {
        data: {
          coin: newCoin,
          dateAdded: new Date(data.dateAdded),
          amountOwned: data.amount,
          valueAtBuy: fetchedPrice,
        },
      };
      // console.log(portfolioData);

      const addPortfolioData = async () => {
        try {
          const response = await axios.post(
            "/api/setPortfolio",
            JSON.stringify(portfolioData),
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          // console.log("Portfolio data added:", response.data);
          window.location.reload();
          toast({
            title: "Coin updated successfully",
            description: "Your coin data has been saved.",
          });
        } catch (error) {
          console.error("Error adding coin data:", error);
          toast({
            title: "Error",
            description: "There was a problem saving your coin data.",
          });
        }
      };

      addPortfolioData();
    });
  }
  function handleDelete() {
    const addPortfolioData = async () => {
      const portfolioData = {
        data: {
          coin: portData.coin,
          dateAdded: portData.dateAdded,
          amountOwned: 0,
          valueAtBuy: portData.valueAtBuy,
        },
      };
      try {
        const response = await axios.post(
          "/api/setPortfolio",
          JSON.stringify(portfolioData),
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        // console.log("Portfolio data added:", response.data);
        window.location.reload();
        toast({
          title: "Coin deleted successfully",
          description: "Your coin data has been deleted.",
        });
      } catch (error) {
        console.error("Error deleting coin data:", error);
        toast({
          title: "Error",
          description: "There was a problem deleting your coin data.",
        });
      }
    };

    addPortfolioData();
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="p-4">
          <Edit />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-5/6">
        <DialogHeader>
          <DialogTitle>
            Edit {capitalizeWords(portData.coin.id)}
          </DialogTitle>
        </DialogHeader>
        <div className="flex justify-between gap-6">
          {coin && (
            <div className="bg-card rounded-md flex flex-col p-12 justify-center items-center w-full">
              <Image
                src={coin.image}
                alt={coin.name}
                width={48}
                height={48}
                className="w-12 h-12"
              />
              <div className="w-fit">
                {`${capitalizeWords(
                  coin.id
                )} (${coin.symbol.toLocaleUpperCase()})`}
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
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Controller
                        name="amount"
                        control={form.control}
                        render={({
                          field: {
                            onChange,
                            onBlur,
                            value,
                            name,
                            ref,
                          },
                        }) => (
                          <Input
                            placeholder="Select amount..."
                            type="number"
                            name={name}
                            ref={ref}
                            value={value}
                            onBlur={onBlur}
                            onChange={(e) =>
                              onChange(
                                parseFloat(e.target.value) || 0
                              )
                            }
                          />
                        )}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dateAdded"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[240px] pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Purchased date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-auto p-0"
                        align="start"
                      >
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date: Date) =>
                            date > new Date() ||
                            date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogClose className="flex gap-2">
                <Button variant="destructive" onClick={handleDelete}>
                  Delete
                </Button>
                <Button type="submit">Save and Continue</Button>
              </DialogClose>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CoinForm;
