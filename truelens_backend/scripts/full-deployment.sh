#!/bin/bash

# Exit on error
set -e

echo "Starting full deployment of TrueLens backend..."

# Check if .env exists
if [ ! -f .env ]; then
  echo "Error: .env file not found!"
  exit 1
fi

# Load environment variables
source .env

if [ -z "$PRIVATE_KEY" ]; then
  echo "Error: PRIVATE_KEY not set in .env file!"
  exit 1
fi

# Step 1: Deploy TRUE token and verification contracts on SAGA
echo "Step 1: Deploying contracts on SAGA chainlet..."
npx hardhat run scripts/deploy-saga.js --network saga

# Extract and save contract addresses
echo "Extracting contract addresses from logs..."
SAGA_TRUE_TOKEN=$(grep -o '"trueToken":"0x[a-fA-F0-9]*"' logs/saga-deployment.json | cut -d'"' -f4)
SAGA_VERIFICATION=$(grep -o '"verification":"0x[a-fA-F0-9]*"' logs/saga-deployment.json | cut -d'"' -f4)

# Update .env with contract addresses
sed -i '' "s/^SAGA_TRUE_TOKEN=.*/SAGA_TRUE_TOKEN=$SAGA_TRUE_TOKEN/g" .env
sed -i '' "s/^SAGA_VERIFICATION=.*/SAGA_VERIFICATION=$SAGA_VERIFICATION/g" .env

echo "SAGA contracts deployed:"
echo "TRUE Token: $SAGA_TRUE_TOKEN"
echo "Verification: $SAGA_VERIFICATION"

# Step 2: Set up Hyperlane bridge between SAGA and Rootstock
echo "Step 2: Setting up Hyperlane bridge..."
bash hyperlane/scripts/setup-hyperlane.sh

# Step 3: Deploy Rootstock contracts
echo "Step 3: Deploying contracts on Rootstock..."
npx hardhat run scripts/deploy-rootstock.js --network rootstock

# Extract and save contract addresses
ROOTSTOCK_POOL=$(grep -o '"pool":"0x[a-fA-F0-9]*"' logs/rootstock-deployment.json | cut -d'"' -f4)
# Update .env with contract addresses
sed -i '' "s/^ROOTSTOCK_POOL=.*/ROOTSTOCK_POOL=$ROOTSTOCK_POOL/g" .env

echo "Rootstock contracts deployed:"
echo "TRUE Token (bridged): $ROOTSTOCK_TRUE_TOKEN"
echo "Pool: $ROOTSTOCK_POOL"

# Step 4: Deploy Hyperlane adapter on SAGA 
echo "Step 4: Deploying Hyperlane adapter on SAGA..."
npx hardhat run scripts/deploy-hyperlane-adapter.js --network saga

echo "Full deployment complete!"
echo "Please review the contract addresses in the .env file" 