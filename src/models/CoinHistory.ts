import mongoose, { Document, Model } from "mongoose";

interface ICoinHistory extends Document {
  coinId: string;
  date: Date;
  price: number;
  volume: number;
  marketCap: number;
}

const coinHistorySchema = new mongoose.Schema({
  coinId: { type: String, ref: "Coin" },
  date: Date,
  price: Number,
  volume: Number,
  marketCap: Number,
});

const CoinHistory: Model<ICoinHistory> =
  mongoose.models.CoinHistory ||
  mongoose.model<ICoinHistory>("CoinHistory", coinHistorySchema);

export default CoinHistory;
