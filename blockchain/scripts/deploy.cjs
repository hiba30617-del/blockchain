// scripts/deploy.cjs

const hre = require("hardhat");

async function main() {
  // Compile contracts (optional, but safe)
  await hre.run("compile");

  console.log("🚀 Deploying CharityDonation contract...");

  const CharityDonation = await hre.ethers.getContractFactory("CharityDonation");
  const charityDonation = await CharityDonation.deploy();

  await charityDonation.waitForDeployment();

  console.log(`✅ CharityDonation deployed to: ${await charityDonation.getAddress()}`);
}

// Run the deployment
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
