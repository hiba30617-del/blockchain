import mongoose from "mongoose";

const campaignSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    goalETH: { type: Number, required: true },
    ngoName: String,
    ngoAddress: String,
    totalDonations: { type: Number, default: 0 },
    blockchainId: { type: Number, default: null },
  },
  { timestamps: true }
);

// ✅ Export the model properly
const Campaign = mongoose.model("Campaign", campaignSchema);
export default Campaign;
