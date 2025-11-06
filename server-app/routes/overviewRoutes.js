import express from "express";
import Campaign from "../models/Campaign.js";
import Transaction from "../models/Transaction.js";
import NGO from "../models/NGO.js";

const router = express.Router();

// GET /api/overview
router.get("/", async (req, res) => {
  try {
    const [campaignCount, totalDonations, ngoCount, txCount, recentTx] =
      await Promise.all([
        Campaign.countDocuments(),
        Transaction.aggregate([
          { $group: { _id: null, total: { $sum: "$amountETH" } } },
        ]),
        NGO.countDocuments(),
        Transaction.countDocuments(),
        Transaction.find().sort({ createdAt: -1 }).limit(5),
      ]);

    res.json({
      totalCampaigns: campaignCount,
      totalDonations: totalDonations[0]?.total || 0,
      totalNGOs: ngoCount,
      totalTransactions: txCount,
      recentTx,
    });
  } catch (error) {
    console.error("Overview Error:", error);
    res.status(500).json({ message: "Failed to load overview data" });
  }
});

export default router;
