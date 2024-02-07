import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/lib/mongodb";

type PortfolioData = {
  data: Array<{
    name: string;
    dateAdded: Date;
    amountOwned: number;
    valueAtBuy: number;
  }>;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const portfolioData: PortfolioData = JSON.parse(req.body);

      const client = await clientPromise;
      const db = client.db("coins");

      const response = await db
        .collection("portfolioData")
        .insertOne(portfolioData);

      res.status(200).json({
        message: "Portfolio data added successfully",
        id: response.insertedId,
      });
    } catch (error) {
      console.error("Failed to insert portfolio data", error);
      res
        .status(500)
        .json({ error: "Failed to insert portfolio data" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
