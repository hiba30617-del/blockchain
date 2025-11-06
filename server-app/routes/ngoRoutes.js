import express from "express";
import NGO from "../models/NGO.js"; // 👈 make sure this model file exists

const router = express.Router();

// 🏢 Register NGO
router.post("/ngos/register", async (req, res) => {
  try {
    const { name, walletAddress, description } = req.body;
    if (!name || !walletAddress || !description) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existing = await NGO.findOne({ walletAddress });
    if (existing) {
      return res.status(400).json({ message: "NGO already registered" });
    }

    const newNGO = new NGO({ name, walletAddress, description });
    await newNGO.save();

    res.status(201).json({ message: "NGO registered successfully" });
  } catch (err) {
    console.error("Error during NGO registration:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
