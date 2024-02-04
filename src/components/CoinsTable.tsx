import { TableCoin, columns } from "./columns";
import { DataTable } from "../components/data-table";
import { Coin } from "./CoinCard";

interface CoinsTableProps {
  coins: Coin[];
}

const CoinsTable = ({ coins }: CoinsTableProps) => {
  const data: TableCoin[] = coins.map((coin, index) => ({
    id: index + 1,
    name: [coin.image, coin.name],
    price: `$${coin.current_price.toFixed(2)}`,
    hourChange:
      coin.price_change_percentage_1h_in_currency.toFixed(2),
    dayChange: coin.price_change_percentage_24h.toFixed(2),
    weekChange:
      coin.price_change_percentage_7d_in_currency.toFixed(2),
    volumeMarketCap: [coin.total_volume, coin.market_cap],
    circulatingTotalSupply: [
      coin.circulating_supply,
      coin.max_supply,
    ],
    lastWeekData: coin.sparkline_in_7d.price,
  }));
  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  );
};

export default CoinsTable;
