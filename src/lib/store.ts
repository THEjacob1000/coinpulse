import { Coin } from "@/components/CoinCard";
import { create } from "zustand";

export type Currency =
  | { symbol: "$"; currency: "USD" }
  | { symbol: "₹"; currency: "INR" }
  | { symbol: "€"; currency: "EUR" }
  | { symbol: "£"; currency: "GBP" }
  | { symbol: "¥"; currency: "JPY" }
  | { symbol: "$"; currency: "AUD" };
export type Currencies = Currency[];

interface CryptoState {
  currency: Currency;
  changeCurrency: (newCurr: Currency) => void;
  compare: boolean;
  changeCompare: () => void;
  selectedCoin: string[];
  setSelectedCoins: (coins: string[]) => void;
  changeSelectedCoin: (coin: string) => void | Error;
  cryptoData: Coin[];
  changeCryptoData: (newData: Coin[]) => void;
  cryptoDataLoading: boolean;
  changeCryptoDataLoading: (loading: boolean) => void;
  pageType: "coins" | "converter";
  changePageType: (newType: "coins" | "converter") => void;
}

export const useCryptoStore = create<CryptoState>()((set) => ({
  currency: { symbol: "$", currency: "USD" },
  changeCurrency: (newCurr) => set(() => ({ currency: newCurr })),
  compare: false,
  changeCompare: () =>
    set((state) => {
      const newMode = !state.compare;
      const newCoin: string[] = useCryptoStore
        .getState()
        .selectedCoin.slice(0, 1);
      return { compare: newMode, selectedCoin: newCoin };
    }),
  selectedCoin: ["bitcoin"],
  changeSelectedCoin: (coin) =>
    set((state) => {
      if (state.compare) {
        const isSelected = state.selectedCoin.includes(coin);
        console.log(
          isSelected
            ? state.selectedCoin.filter((id) => id !== coin)
            : [...state.selectedCoin, coin]
        );
        const newSelectedCoin = isSelected
          ? state.selectedCoin.filter((id) => id !== coin).length > 0
            ? state.selectedCoin.filter((id) => id !== coin)
            : ["bitcoin"]
          : [...state.selectedCoin, coin].length > 2
          ? new Error("Exceeded maximum selected coins")
          : [...state.selectedCoin, coin];
        if (newSelectedCoin instanceof Error) {
          throw new Error("Exceeded maximum selected coins");
        }
        return {
          selectedCoin: newSelectedCoin,
        };
      } else {
        console.log(
          coin === state.selectedCoin[0] ? ["bitcoin"] : [coin]
        );
        return {
          selectedCoin:
            coin === state.selectedCoin[0] ? ["bitcoin"] : [coin],
        };
      }
    }),
  setSelectedCoins: (coins) => set(() => ({ selectedCoin: coins })),
  cryptoData: [],
  changeCryptoData: (newData) => set(() => ({ cryptoData: newData })),
  cryptoDataLoading: true,
  changeCryptoDataLoading: (loading) =>
    set(() => ({ cryptoDataLoading: loading })),
  pageType: "coins",
  changePageType: (newType) => set(() => ({ pageType: newType })),
}));
