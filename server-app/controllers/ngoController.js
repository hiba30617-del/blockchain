import NGO from "../models/NGO.js";

// ✅ Get all NGOs
export const getNGOs = async (req, res) => {
  try {
    const ngos = await NGO.find();
    res.json(ngos);
  } catch (error) {
    res.status(500).json({ message: "Error fetching NGOs", error });
  }
};

// ✅ Register a new NGO
export const registerNGO = async (req, res) => {
  try {
    const { name, description, walletAddress } = req.body;

    const newNGO = new NGO({
      name,
      description,
      walletAddress,
      verified: false,
    });

    await newNGO.save();
    res.status(201).json({ message: "NGO registered successfully", newNGO });
  } catch (error) {
    res.status(500).json({ message: "Error registering NGO", error });
  }
};
