import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import ngoRoutes from "./routes/ngoRoutes.js";
import campaignRoutes from "./routes/campaignRoutes.js";
import overviewRoutes from "./routes/overviewRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import donationRoutes from "./routes/donationRoutes.js";

import { listenToBlockchain } from "./services/blockchainListener.js";
dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/auth", authRoutes);
app.use("/api/ngos", ngoRoutes);
app.use("/api/campaigns", campaignRoutes);
app.use("/api/overview", overviewRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/donate", donationRoutes);
app.use("/api", ngoRoutes); 
app.get("/", (req, res) => res.send("🚀 CharityChain API Running..."));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
listenToBlockchain();