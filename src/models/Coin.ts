import mongoose, { Document, Model } from "mongoose";

// TypeScript interface for the Coin
export interface ICoin extends Document {
  id: string;
  name: string;
  symbol: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number;
  ath: number;
  ath_change_percentage: number;
  ath_date: Date;
  atl: number;
  atl_change_percentage: number;
  atl_date: Date;
  last_updated: Date;
  image: string;
}

const coinSchema = new mongoose.Schema({
  // Define schema fields corresponding to the interface
  id: String,
  name: String,
  symbol: String,
  current_price: Number,
  // Add other fields as per your requirements
});

// Define the model
const Coin: Model<ICoin> =
  mongoose.models.Coin || mongoose.model<ICoin>("Coin", coinSchema);

export default Coin;
