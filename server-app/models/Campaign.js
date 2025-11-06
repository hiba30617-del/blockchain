import mongoose from "mongoose";

const campaignSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    goalETH: { type: Number, required: true },
    ngoName: String,
    totalDonations: { type: Number, default: 0 },
    blockchainId: { type: Number, default: null },
  },
  { timestamps: true }
);

export default mongoose.model("Campaign", campaignSchema);
