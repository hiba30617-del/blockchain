import express from "express";
import Transaction from "../models/Transaction.js";

const router = express.Router();

// Log blockchain transaction
router.post("/", async (req, res) => {
  try {
    const { donor, ngoName, amountETH, txHash } = req.body;
    if (!donor || !amountETH || !txHash)
      return res.status(400).json({ message: "Missing required fields" });

    const tx = new Transaction({
      donor,
      ngoName,
      amountETH,
      txHash,
    });

    await tx.save();
    res.status(201).json({ message: "Donation recorded", tx });
  } catch (error) {
    console.error("Donation save error:", error);
    res.status(500).json({ message: "Failed to record donation" });
  }
});

export default router;
