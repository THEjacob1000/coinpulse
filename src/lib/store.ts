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
  selectedCoin: string[];
  changeSelectedCoin: (coin: string) => void;
}

export const useCryptoStore = create<CryptoState>()((set) => ({
  currency: { symbol: "$", currency: "USD" },
  changeCurrency: (newCurr) => set(() => ({ currency: newCurr })),
  selectedCoin: ["bitcoin"], // Initialize as an empty array
  changeSelectedCoin: (coin) =>
    set((state) => {
      const isSelected = state.selectedCoin.includes(coin);
      return {
        selectedCoin: isSelected
          ? state.selectedCoin.filter((id) => id !== coin)
          : [...state.selectedCoin, coin],
      };
    }),
}));
