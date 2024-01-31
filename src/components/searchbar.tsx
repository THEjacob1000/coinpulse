"use client";

import { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Search } from "lucide-react";
import { Button } from "./ui/button";

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
    <>
      <div className="w-1/2 hidden md:block">
        <Search className="w-4 h-4 absolute mt-3 ml-2" />
        <Input
          placeholder="Search"
          className="pl-10 bg-card/40 border-input/5 w-20 md:min-w-full"
        />
      </div>
      <Button className="md:hidden bg-card/40" variant={"secondary"}>
        <Search className="w-4 h-4" />
      </Button>
    </>
  );
};

export default Searchbar;
