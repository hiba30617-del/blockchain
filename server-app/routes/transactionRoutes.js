import express from "express";
import Transaction from "../models/Transaction.js";

const router = express.Router();

// Record a transaction
router.post("/", async (req, res) => {
  try {
    const { campaignId, donor, amountETH } = req.body;
    const newTx = await Transaction.create({
      campaignId,
      donor,
      amountETH,
      date: new Date(),
    });
    res.status(201).json(newTx);
  } catch (err) {
    res.status(500).json({ message: "Error saving transaction", error: err.message });
  }
});

// Fetch all transactions
router.get("/", async (req, res) => {
  try {
    const txs = await Transaction.find().sort({ date: -1 });
    res.json(txs);
  } catch (err) {
    res.status(500).json({ message: "Error fetching transactions" });
  }
});

export default router;
