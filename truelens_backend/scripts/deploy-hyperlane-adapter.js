const { ethers } = require("hardhat");
const fs = require('fs');
const path = require('path');

async function main() {
  console.log("Deploying TrueLens Hyperlane Adapter to SAGA chainlet...");

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
  const trueTokenAddress = process.env.SAGA_TRUE_TOKEN || "0x1234567890123456789012345678901234567890";
  const verificationAddress = process.env.SAGA_VERIFICATION || "0x0987654321098765432109876543210987654321";
  const mailboxAddress = process.env.SAGA_MAILBOX || "0x1234567890123456789012345678901234567890";
  const ismAddress = process.env.SAGA_ISM || "0x0987654321098765432109876543210987654321";
  const rootstockDomainId = parseInt(process.env.ROOTSTOCK_DOMAIN_ID || "31");
  const rootstockPoolAddress = process.env.ROOTSTOCK_POOL || "0x1234567890123456789012345678901234567890";

  // Deploy the Hyperlane adapter
  const TrueLensHyperlaneAdapter = await ethers.getContractFactory("TrueLensHyperlaneAdapter");
  const adapter = await TrueLensHyperlaneAdapter.deploy(
    trueTokenAddress,
    verificationAddress,
    mailboxAddress,
    ismAddress,
    rootstockDomainId,
    rootstockPoolAddress
  );
  await adapter.deployed();
  console.log("TrueLensHyperlaneAdapter deployed to:", adapter.address);

  console.log("Hyperlane adapter deployed successfully");
  
  // Save the deployed contract address
  const deploymentInfo = {
    adapter: adapter.address
  };
  
  console.log("Contract address:", JSON.stringify(deploymentInfo));
  
  // Save to file
  fs.writeFileSync(
    path.join(logsDir, 'hyperlane-adapter-deployment.json'),
    JSON.stringify(deploymentInfo, null, 2)
  );
  
  // Update .env with adapter address
  const envPath = path.join(__dirname, '..', '.env');
  let envContent = fs.readFileSync(envPath, 'utf8');
  envContent = envContent.replace(/^SAGA_HYPERLANE_ADAPTER=.*$/m, `SAGA_HYPERLANE_ADAPTER=${adapter.address}`);
  if (!envContent.includes('SAGA_HYPERLANE_ADAPTER=')) {
    envContent += `\nSAGA_HYPERLANE_ADAPTER=${adapter.address}`;
  }
  fs.writeFileSync(envPath, envContent);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 