import { ethers } from "ethers";
import fs from "fs";
import dotenv from "dotenv";
import Campaign from "../models/Campaign.js";
import Transaction from "../models/Transaction.js";
import { getETHtoINR } from "./priceService.js";

dotenv.config();

export const listenToBlockchain = async () => {
  try {
    // ✅ Switch to WebSocket to prevent "results is not iterable" bug
    const provider = new ethers.WebSocketProvider("http://127.0.0.1:8545");

    const raw = fs.readFileSync(process.env.CONTRACT_ABI_PATH, "utf-8");
    const abi = JSON.parse(raw).abi;
    const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, abi, provider);
    console.log("👂 Listening to CharityDonation contract events (WebSocket)...");

    // 🟢 CampaignCreated event
    contract.on("CampaignCreated", async (id, name, ngoAddress, event) => {
      try {
        const newCampaign = new Campaign({
          campaignId: Number(id),
          name,
          ngo: ngoAddress,
          description: "Synced from blockchain",
          totalDonations: 0,
        });
        await newCampaign.save();
        console.log(`📢 New Campaign Added: ${name} (${ngoAddress})`);
      } catch (err) {
        console.error("Error saving campaign:", err.message);
      }
    });

    // 💰 DonationReceived event
    contract.on("DonationReceived", async (campaignId, donor, amount, event) => {
      try {
        const txHash = event.log.transactionHash;
        const amountETH = parseFloat(ethers.formatEther(amount));
        const ethToINR = await getETHtoINR();
        const amountINR = amountETH * ethToINR;

        const newTx = new Transaction({
          txHash,
          campaignId: Number(campaignId),
          donor,
          amountETH,
          amountINR,
        });
        await newTx.save();

        const campaign = await Campaign.findOne({ campaignId: Number(campaignId) });
        if (campaign) {
          campaign.totalDonations += amountETH;
          await campaign.save();
        }

        console.log(
          `💰 Donation received: ${amountETH} ETH (~₹${amountINR.toFixed(
            2
          )}) from ${donor}`
        );
      } catch (err) {
        console.error("Error saving donation:", err.message);
      }
    });
  } catch (err) {
    console.error("Listener setup failed:", err.message);
  }
};
