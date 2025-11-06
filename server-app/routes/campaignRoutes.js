import express from "express";
import Campaign from "../models/Campaign.js";

const router = express.Router();

/**
 * 🟢 Create a new campaign
 */
router.post("/create", async (req, res) => {
  try {
    const { name, description, goalETH, ngoName } = req.body;

    if (!name || !goalETH) {
      return res.status(400).json({ message: "Name and goal (ETH) are required" });
    }

    // ⚙️ Just create in MongoDB for now
    // If blockchain integration is added, capture campaignIdOnChain here.
    const newCampaign = new Campaign({
      name,
      description,
      goalETH,
      ngoName,
      blockchainId: null, // will be linked later if needed
    });

    await newCampaign.save();

    res.status(201).json({
      message: "✅ Campaign created successfully",
      campaign: newCampaign,
    });
  } catch (error) {
    console.error("❌ Campaign creation error:", error);
    res.status(500).json({
      message: "Failed to create campaign",
      error: error.message,
    });
  }
});

/**
 * 🟣 Get all campaigns
 */
router.get("/", async (req, res) => {
  try {
    const campaigns = await Campaign.find().sort({ createdAt: -1 });

    // Add numeric blockchain-compatible ID (fallback if not deployed)
    const formatted = campaigns.map((c, idx) => ({
      ...c._doc,
      blockchainId: c.blockchainId || idx + 1, // ensure it’s numeric
    }));

    res.json(formatted);
  } catch (error) {
    console.error("❌ Failed to fetch campaigns:", error);
    res.status(500).json({ message: "Failed to fetch campaigns" });
  }
});

/**
 * 🟠 Update campaign donation total after blockchain transaction
 */
router.put("/:id/donate", async (req, res) => {
  try {
    const { amountETH } = req.body;
    const campaign = await Campaign.findById(req.params.id);

    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }

    campaign.totalDonations += Number(amountETH);
    await campaign.save();

    res.json({ message: "Donation updated successfully", campaign });
  } catch (error) {
    console.error("❌ Donation update failed:", error);
    res.status(500).json({ message: "Failed to update campaign donation" });
  }
});

export default router; 