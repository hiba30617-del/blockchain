import express from "express";
import Campaign from "../models/Campaign.js";
import Transaction from "../models/Transaction.js";
import NGO from "../models/NGO.js";
const router = express.Router();

router.post("/ngos/register", async (req, res) => {
  try {
    const { name, walletAddress, description } = req.body;

    if (!name || !walletAddress || !description) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingNGO = await NGO.findOne({ walletAddress });
    if (existingNGO) {
      return res.status(400).json({ message: "NGO already registered" });
    }

    const newNGO = new NGO({
      name,
      walletAddress,
      description,
    });

    await newNGO.save();
    res.status(201).json({ message: "NGO registered successfully" });
  } catch (err) {
    console.error("Error registering NGO:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// 🟢 Get all campaigns
router.get("/campaigns", async (req, res) => {
  try {
    const campaigns = await Campaign.find().sort({ createdAt: -1 });
    res.json(campaigns);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 💰 Get all transactions
router.get("/transactions", async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ timestamp: -1 });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔍 Search transactions by donor or NGO
router.get("/transactions/search", async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) return res.status(400).json({ message: "Query required" });

    const results = await Transaction.find({
      $or: [
        { donor: { $regex: query, $options: "i" } },
        { txHash: { $regex: query, $options: "i" } },
      ],
    });
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📊 Get project overview stats
router.get("/overview", async (req, res) => {
  try {
    const campaigns = await Campaign.countDocuments();
    const transactions = await Transaction.find();
    const totalETH = transactions.reduce((sum, tx) => sum + tx.amountETH, 0);
    const totalINR = transactions.reduce((sum, tx) => sum + tx.amountINR, 0);
    res.json({ campaigns, totalETH, totalINR });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
