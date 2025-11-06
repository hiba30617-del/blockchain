import axios from "axios";

export const getETHtoINR = async () => {
  try {
    const { data } = await axios.get(
      "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=inr"
    );
    return data.ethereum.inr;
  } catch (err) {
    console.error("⚠️ Error fetching ETH price:", err.message);
    return 0;
  }
};
