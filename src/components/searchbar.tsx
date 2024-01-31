"use client";

import { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Search } from "lucide-react";

const Searchbar = () => {
  const [coins, setCoins] = useState([]);
  useEffect(() => {
    const getCoins = async () => {
      const res = await fetch("/api/coins");
      const coins = await res.json();
      setCoins(coins.data.coins);
    };
    getCoins();
  }, []);
  return (
    <div className="w-1/6">
      <Search className="w-4 h-4 absolute mt-3 ml-2" />
      <Input placeholder="Search" className="pl-10" />
    </div>
  );
};

export default Searchbar;
