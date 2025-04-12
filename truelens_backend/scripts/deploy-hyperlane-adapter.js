const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying TrueLens Hyperlane Adapter to SAGA chainlet...");

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  
  // Required parameters - in production these would come from .env
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
  console.log("Contract address:", JSON.stringify({
    adapter: adapter.address
  }));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 