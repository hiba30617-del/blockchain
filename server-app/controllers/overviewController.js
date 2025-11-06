import Campaign from "../models/Campaign.js";
import NGO from "../models/NGO.js";
import Transaction from "../models/Transaction.js";

export const getOverview = async (req, res) => {
  try {
    const totalNGOs = await NGO.countDocuments();
    const totalCampaigns = await Campaign.countDocuments();
    const totalDonations = await Transaction.countDocuments();
    const recentTx = await Transaction.find().sort({ createdAt: -1 }).limit(5);

    res.json({
      totalNGOs,
      totalCampaigns,
      totalDonations,
      recentTx,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching overview data", error });
  }
};
