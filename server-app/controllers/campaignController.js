import Campaign from "../models/Campaign.js";

// ✅ Get all campaigns
export const getCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find().populate("ngo", "name walletAddress");
    res.json(campaigns);
  } catch (error) {
    res.status(500).json({ message: "Error fetching campaigns", error });
  }
};

// ✅ Create new campaign
export const createCampaign = async (req, res) => {
  try {
    const { name, description, targetAmount, ngo } = req.body;

    const campaign = new Campaign({
      name,
      description,
      targetAmount,
      ngo,
      totalDonations: 0,
    });

    await campaign.save();
    res.status(201).json({ message: "Campaign created successfully", campaign });
  } catch (error) {
    res.status(500).json({ message: "Error creating campaign", error });
  }
};
