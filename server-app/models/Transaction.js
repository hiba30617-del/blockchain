import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  campaignId: { type: mongoose.Schema.Types.ObjectId, ref: "Campaign" },
  donor: String,
  amountETH: Number,
  date: { type: Date, default: Date.now },
});

export default mongoose.model("Transaction", transactionSchema);
