const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying TrueLens contracts to SAGA chainlet...");

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  // Deploy the TRUE token
  const TRUEToken = await ethers.getContractFactory("TRUEToken");
  const trueToken = await TRUEToken.deploy(deployer.address);
  await trueToken.deployed();
  console.log("TRUEToken deployed to:", trueToken.address);

  // Deploy the verification contract
  const TrueLensVerification = await ethers.getContractFactory("TrueLensVerification");
  const verification = await TrueLensVerification.deploy(trueToken.address);
  await verification.deployed();
  console.log("TrueLensVerification deployed to:", verification.address);

  // Note: The Hyperlane adapter will be deployed after Hyperlane is set up
  console.log("SAGA contracts deployed successfully");
  
  // Save the deployed contract addresses
  console.log("Contract addresses:", JSON.stringify({
    trueToken: trueToken.address,
    verification: verification.address
  }));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 