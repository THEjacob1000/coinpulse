"use client";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useCryptoStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import axios from "axios";
import { Copy, Layers, Link as LinkIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

type CoinData = {
  _id: string;
  id: string;
  additional_notices: any[];
  asset_platform_id: null | string;
  block_time_in_minutes: number;
  categories: string[];
  community_data: {
    [key: string]: any;
  };
  country_origin: string;
  description: {
    [language: string]: string;
  };
  detail_platforms: {
    [key: string]: any;
  };
  genesis_date: string;
  hashing_algorithm: string;
  image: {
    [key: string]: string;
  };
  lastUpdate: Date | string;
  last_updated: string;
  links: {
    [key: string]: any;
  };
  market_cap_rank: number;
  market_data: {
    [key: string]: any;
  };
  name: string;
  platforms: {
    [key: string]: string | null;
  };
  preview_listing: boolean;
  public_notice: null | string;
  sentiment_votes_down_percentage: number;
  sentiment_votes_up_percentage: number;
  status_updates: any[];
  symbol: string;
  watchlist_portfolio_users: number;
  web_slug: string;
};
const Page = ({ params }: { params: { coinId: string } }) => {
  const [coinData, setCoinData] = useState<CoinData>();
  const [isClamped, setIsClamped] = useState(false);
  const [wasClamped, setWasClamped] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const setRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (node) {
        const isContentClamped =
          node.scrollHeight > node.clientHeight;
        setIsClamped(isContentClamped);

        if (isContentClamped && !wasClamped) {
          setWasClamped(true);
        }
      }
    },
    [wasClamped]
  );
  const coinId = params.coinId;
  const currency = useCryptoStore((state) => state.currency);
  const currencyShorthand = currency.currency.toLocaleLowerCase();

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      console.log("Link copied to clipboard");
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };
  const numberReducer = (number: number) => {
    return number > 1000000000
      ? (number / 1000000000).toFixed(3) + "B"
      : (number / 1000000).toFixed(3) + "M";
  };
  useEffect(() => {
    const fetchPageData = async () => {
      try {
        const response = await axios.get(
          `/api/coinData?coinId=${coinId}`
        );
        const data = response.data;
        setCoinData(data);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchPageData();
  }, [coinId]);

  if (!coinData) {
    return (
      <div className="flex flex-col w-full gap-4 mt-12">
        <div className="flex justify-around items-start flex-wrap gap-4 lg:gap-24">
          <div className="flex flex-col justify-center items-center w-5/6 md:w-1/3 lg:w-1/4 gap-3 shrink-0">
            <div className="bg-card rounded-lg p-8 flex flex-col items-center justify-center gap-4 w-full">
              <Skeleton className="w-24 h-24 rounded-full" />
              <Skeleton className="w-3/4 h-6" />
            </div>
            <div className="flex justify-center items-center bg-card rounded-lg py-2 w-full gap-2">
              <Skeleton className="w-12 h-6" />
              <Skeleton className="w-3/4 h-4" />
            </div>
          </div>
          <div className="flex flex-col justify-center items-center w-5/6 md:w-1/3 lg:w-1/4 bg-card rounded-lg gap-4 p-8 shrink-0">
            <Skeleton className="w-3/4 h-6" />
            <div className="flex justify-start items-center gap-3 w-full">
              <Skeleton className="w-10 h-6" />
              <Skeleton className="w-1/4 h-6" />
            </div>
            <Skeleton className="w-10 h-10" />
            <div className="flex justify-between items-start gap-4 w-full">
              <div className="flex flex-col gap-1">
                <Skeleton className="w-1/2 h-4" />
                <Skeleton className="w-full h-4" />
                <Skeleton className="w-3/4 h-4" />
                <Skeleton className="w-1/2 h-4" />
              </div>
              <div className="flex flex-col gap-1">
                <Skeleton className="w-1/2 h-4" />
                <Skeleton className="w-full h-4" />
                <Skeleton className="w-3/4 h-4" />
                <Skeleton className="w-1/2 h-4" />
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-start items-center w-5/6 lg:w-1/4 bg-card rounded-lg gap-2 p-8 shrink-0">
            <Skeleton className="w-full h-4" />{" "}
            <Skeleton className="w-full h-4" />{" "}
            <Skeleton className="w-full h-4" />{" "}
            <Skeleton className="w-full h-4" />{" "}
          </div>
        </div>
        <div className="flex flex-col justify-start items-center lg:items-start px-16 py-8 mt-16">
          <Skeleton className="w-1/4 h-6" />
          <Skeleton className="w-full h-24" />
        </div>
      </div>
    );
  }
  const price_change_percentage =
    coinData.market_data.price_change_percentage_30d;
  const marketCap =
    coinData.market_data.market_cap[currencyShorthand];
  const formattedDescription = coinData.description.en.replace(
    /<a href="(.*?)">(.*?)<\/a>/g,
    `<a href="$1" style="color: hsl(240 59% 61%);">$2</a>`
  );

  return (
    <div className="flex flex-col w-full gap-4 mt-12">
      <div className="flex justify-around items-start flex-wrap gap-4">
        <div className="flex flex-col justify-center items-center w-5/6 md:w-1/3 lg:w-1/4 gap-3 shrink-0">
          <div className="bg-card rounded-lg p-8 flex flex-col items-center justify-center gap-4 w-full">
            <Image
              src={coinData.image.large}
              width={100}
              height={100}
              alt={`${coinData.id} logo`}
            />
            <div className="text-3xl">
              <div className="capitalize">
                {coinData.id} (
                <span className="uppercase">{coinData.symbol}</span>)
              </div>
            </div>
          </div>
          <div className="flex justify-center items-center bg-card rounded-lg py-2 w-full gap-2">
            <Link href={coinData.links.homepage[0]} target="_blank">
              <Button variant={"ghost"}>
                <LinkIcon className="h-4 w-4" />
              </Button>
            </Link>
            <div>{coinData.links.homepage[0]}</div>
            <Button
              variant={"ghost"}
              onClick={() =>
                copyToClipboard(coinData.links.homepage[0])
              }
            >
              <Copy />
            </Button>
          </div>
        </div>
        <div className="flex flex-col justify-center items-center w-5/6 md:w-1/3 lg:w-1/4 bg-card rounded-lg gap-4 p-8 shrink-0">
          <div className="text-3xl">
            {currency.symbol +
              coinData.market_data.current_price[currencyShorthand]}
          </div>
          <div className="h-4 justify-start items-start gap-3 inline-flex ml-3 mt-1">
            <div
              className={cn(
                "w-0 h-0 border-x-8 border-x-transparent border-b-[12px] border-b-cyan-400 inline-block mt-1",
                price_change_percentage < 0
                  ? "rotate-180 border-b-rose-500"
                  : "border-b-cyan-400"
              )}
            />
            <div
              className={cn(
                "text-right text-xl font-normal font-['Space Grotesk'] leading-none",
                price_change_percentage < 0
                  ? "text-rose-500"
                  : "text-cyan-400"
              )}
            >
              {price_change_percentage.toFixed(2)}%
            </div>
          </div>
          <Layers className="h-10 w-10" strokeWidth={2} />
          <div className="flex justify-between items-start gap-4">
            <div className="text-lg flex flex-col gap-1">
              <div className="font-bold">ATH:</div>
              <div className="font-semibold">
                {currency.symbol +
                  coinData.market_data.ath[currencyShorthand]}
              </div>
              <div className="font-semibold">
                {coinData.market_data.ath_change_percentage[
                  currencyShorthand
                ].toFixed(3)}
                %
              </div>
              <div className="font-semibold">
                {new Date(
                  coinData.market_data.ath_date.usd
                ).toLocaleDateString("en-US", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </div>
            </div>
            <div className="text-lg flex flex-col gap-1">
              <div className="font-bold">ATL:</div>
              <div className="font-semibold">
                {currency.symbol +
                  coinData.market_data.atl[currencyShorthand]}
              </div>
              <div className="font-semibold">
                {coinData.market_data.atl_change_percentage[
                  currencyShorthand
                ].toFixed(3)}
                %
              </div>
              <div className="font-semibold">
                {new Date(
                  coinData.market_data.atl_date.usd
                ).toLocaleDateString("en-US", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-start items-center w-5/6 lg:w-1/4 bg-card rounded-lg gap-2 p-8 shrink-0">
          <div className="flex justify-start gap-3 items-center w-full">
            <div className="bg-primary rounded-md  w-8 h-8 flex justify-center items-center font-bold">
              +
            </div>
            <div className="flex gap-1">
              <span className="font-bold">Market Cap:</span>
              <div>{currency.symbol + numberReducer(marketCap)}</div>
              <div className="h-4 justify-start items-start gap-3 inline-flex ml-3 mt-1">
                <div
                  className={cn(
                    "w-0 h-0 border-x-4 border-x-transparent border-b-[8px] border-b-cyan-400 inline-block mt-1",
                    coinData.market_data
                      .market_cap_change_percentage_24h < 0
                      ? "rotate-180 border-b-rose-500"
                      : "border-b-cyan-400"
                  )}
                />
                <div
                  className={cn(
                    "text-right text-md font-normal font-['Space Grotesk'] leading-none",
                    coinData.market_data
                      .market_cap_change_percentage_24h < 0
                      ? "text-rose-500"
                      : "text-cyan-400"
                  )}
                >
                  {coinData.market_data.market_cap_change_percentage_24h.toFixed(
                    2
                  )}
                  %
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-start gap-3 items-center w-full">
            <div className="bg-primary rounded-md  w-8 h-8 flex justify-center items-center font-bold">
              +
            </div>
            <div className="flex gap-1">
              <span className="font-bold">
                Fully Diluted Valuation:
              </span>
              <div>
                {currency.symbol +
                  numberReducer(
                    coinData.market_data.fully_diluted_valuation[
                      currencyShorthand
                    ]
                  )}
              </div>
            </div>
          </div>
          <div className="flex justify-start gap-3 items-center w-full">
            <div className="bg-primary rounded-md  w-8 h-8 flex justify-center items-center font-bold">
              +
            </div>
            <div className="flex gap-1">
              <span className="font-bold">Total Volume:</span>
              <div>
                {currency.symbol +
                  numberReducer(
                    coinData.market_data.total_volume[
                      currencyShorthand
                    ]
                  )}
              </div>
            </div>
          </div>
          <div className="flex justify-start gap-3 items-center w-full">
            <div className="bg-primary rounded-md  w-8 h-8 flex justify-center items-center font-bold">
              +
            </div>
            <div className="flex gap-1">
              <span className="font-bold">Volume / Market:</span>
              <div>
                {(
                  coinData.market_data.total_volume[
                    currencyShorthand
                  ] / marketCap
                ).toFixed(6)}
                ...
              </div>
            </div>
          </div>
          <div className="flex justify-start gap-3 items-center w-full">
            <div className="bg-primary rounded-md  w-8 h-8 flex justify-center items-center font-bold">
              +
            </div>
            <div className="flex gap-1">
              <span className="font-bold text-green-500">
                Total Volume:
              </span>
              <div>
                {currency.symbol +
                  numberReducer(
                    coinData.market_data.total_volume[
                      currencyShorthand
                    ]
                  )}
              </div>
            </div>
          </div>
          <div className="flex justify-start gap-3 items-center w-full">
            <div className="bg-primary rounded-md  w-8 h-8 flex justify-center items-center font-bold">
              +
            </div>
            <div className="flex gap-1">
              <span className="font-bold">Circulating Supply:</span>
              <div>
                {coinData.market_data.circulating_supply +
                  " " +
                  coinData.symbol.toLocaleUpperCase()}
              </div>
            </div>
          </div>
          <div className="flex justify-start gap-3 items-center w-full">
            <div className="bg-primary rounded-md  w-8 h-8 flex justify-center items-center font-bold">
              +
            </div>
            <div className="flex gap-1">
              <span className="font-bold text-primary">
                Max Supply:
              </span>
              <div>
                {coinData.market_data.total_supply +
                  " " +
                  coinData.symbol.toLocaleUpperCase()}
              </div>
            </div>
          </div>
          <div className="flex flex-col w-full items-center mt-4">
            <div className="flex justify-between w-full">
              <div className="flex gap-1 items-center">
                <div className="h-2 w-2 rounded-full bg-primary" />
                <div className="text-xs text-primary">
                  {Math.floor(
                    (coinData.market_data.circulating_supply /
                      coinData.market_data.total_supply) *
                      100
                  )}
                  %
                </div>
              </div>
              <div className="flex gap-1 items-center">
                <div className="h-2 w-2 rounded-full bg-primary/60" />
                <div className="text-xs text-primary/60">
                  {100 -
                    Math.floor(
                      (coinData.market_data.circulating_supply /
                        coinData.market_data.total_supply) *
                        100
                    )}
                  %
                </div>
              </div>
            </div>

            <Progress
              value={
                (coinData.market_data.circulating_supply /
                  coinData.market_data.total_supply) *
                100
              }
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-start items-center lg:items-start px-16 py-8">
        <div className="text-2xl font-bold mb-4">Description</div>
        <div className="w-full flex flex-col lg:flex-row justify-center lg:justify-between items-center lg:items-start gap-20">
          <div className="flex flex-col justify-start items-start w-3/4">
            <div
              ref={setRef}
              className={`line-clamp-10 text-sm ${
                isExpanded ? "line-clamp-none" : ""
              }`}
              dangerouslySetInnerHTML={{
                __html: formattedDescription,
              }}
            />
            {isClamped && !isExpanded ? (
              <Button
                onClick={() => setIsExpanded(true)}
                variant="link"
                className="text-base p-0"
              >
                Read more
              </Button>
            ) : wasClamped && isExpanded ? (
              <Button
                onClick={() => setIsExpanded(false)}
                variant="link"
                className="text-base p-0"
              >
                Show less
              </Button>
            ) : null}
          </div>
          <div className="flex flex-col gap-6 lg:w-1/3 w-fit">
            {coinData.links.blockchain_site
              .slice(0, 3)
              .map((link: string, index: number) => (
                <div
                  className="flex justify-center items-center bg-card rounded-lg py-2 w-full gap-2"
                  key={index}
                >
                  <Link href={link} target="_blank">
                    <Button variant={"ghost"}>
                      <LinkIcon className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href={link} target="_blank">
                    <div>
                      {link.length > 50
                        ? `${link.substring(0, 50)}...`
                        : link}
                    </div>
                  </Link>
                  <Button
                    variant={"ghost"}
                    onClick={() => copyToClipboard(link)}
                  >
                    <Copy />
                  </Button>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
