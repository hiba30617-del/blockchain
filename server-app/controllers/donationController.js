import Transaction from "../models/Transaction.js";
import Campaign from "../models/Campaign.js";

// ✅ Record new donation
export const recordDonation = async (req, res) => {
  try {
    const { donor, amountETH, ngoName, campaignId, txHash } = req.body;

    const transaction = new Transaction({
      donor,
      amountETH,
      ngoName,
      campaign: campaignId,
      txHash,
    });
    await transaction.save();

    // update total donations in campaign
    await Campaign.findByIdAndUpdate(campaignId, {
      $inc: { totalDonations: amountETH },
    });

    res.status(201).json({ message: "Donation recorded", transaction });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error saving donation", error });
  }
};

// ✅ Get all donations
export const getDonations = async (req, res) => {
  try {
    const donations = await Transaction.find().populate("campaign", "name");
    res.json(donations);
  } catch (error) {
    res.status(500).json({ message: "Error fetching donations", error });
  }
};
