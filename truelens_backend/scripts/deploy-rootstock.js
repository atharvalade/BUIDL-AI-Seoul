const { ethers } = require("hardhat");
const fs = require('fs');
const path = require('path');

async function main() {
  console.log("Deploying TrueLens contracts to Rootstock...");

  // Create logs directory if it doesn't exist
  const logsDir = path.join(__dirname, '..', 'logs');
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir);
  }

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  
  // Load environment variables if available
  require('dotenv').config();
  
  // Required parameters - load from environment or use fallbacks
  const trueTokenAddress = process.env.ROOTSTOCK_TRUE_TOKEN || "0x1234567890123456789012345678901234567890"; // From Hyperlane warp
  const mailboxAddress = process.env.ROOTSTOCK_MAILBOX || "0x0987654321098765432109876543210987654321";
  const ismAddress = process.env.ROOTSTOCK_ISM || "0x1234567890123456789012345678901234567890";
  const sagaDomainId = parseInt(process.env.SAGA_DOMAIN_ID || "33333");

  // Deploy the pool contract
  const TrueLensPool = await ethers.getContractFactory("TrueLensPool");
  const pool = await TrueLensPool.deploy(
    trueTokenAddress,
    mailboxAddress,
    ismAddress,
    sagaDomainId
  );
  await pool.deployed();
  console.log("TrueLensPool deployed to:", pool.address);

  // Deploy the leaderboard contract
  const TrueLensLeaderboard = await ethers.getContractFactory("TrueLensLeaderboard");
  const leaderboard = await TrueLensLeaderboard.deploy(pool.address);
  await leaderboard.deployed();
  console.log("TrueLensLeaderboard deployed to:", leaderboard.address);

  console.log("Rootstock contracts deployed successfully");
  
  // Save the deployed contract addresses
  const deploymentInfo = {
    pool: pool.address,
    leaderboard: leaderboard.address
  };
  
  console.log("Contract addresses:", JSON.stringify(deploymentInfo));
  
  // Save to file
  fs.writeFileSync(
    path.join(logsDir, 'rootstock-deployment.json'),
    JSON.stringify(deploymentInfo, null, 2)
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 