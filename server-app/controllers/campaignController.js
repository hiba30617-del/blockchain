import Campaign from "../models/Campaign.js";

export const getCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find();
    res.json(campaigns);
  } catch (error) {
    res.status(500).json({ message: "Error fetching campaigns", error });
  }
};

export const createCampaign = async (req, res) => {
  try {
    const { name, description, goalETH, ngoName, ngoAddress, blockchainId } = req.body;
    const campaign = new Campaign({ name, description, goalETH, ngoName, ngoAddress, blockchainId });
    await campaign.save();
    res.status(201).json({ message: "Campaign created successfully", campaign });
  } catch (error) {
    res.status(500).json({ message: "Error creating campaign", error });
  }
};
