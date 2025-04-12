#!/bin/bash

# Exit on error
set -e

echo "Setting up Hyperlane for TrueLens..."

# Load environment variables
source .env

# Set necessary variables
export VALIDATOR_ADDRESS=$(echo $VALIDATOR_KEY | npx hardhat run scripts/derive-address.js)

# Replace variables in config files
sed -i '' "s/\${VALIDATOR_ADDRESS}/$VALIDATOR_ADDRESS/g" hyperlane/config/ism.yaml
sed -i '' "s/\${SAGA_TRUE_TOKEN}/$SAGA_TRUE_TOKEN/g" hyperlane/config/warp-route-deployment.yaml

# Install Hyperlane CLI if not already installed
if ! command -v hyperlane &> /dev/null
then
    echo "Installing Hyperlane CLI..."
    npm install -g @hyperlane-xyz/cli
fi

# Deploy Hyperlane core contracts
echo "Deploying Hyperlane core contracts..."
hyperlane deploy core \
  --targets saga,rootstock \
  --chains ./hyperlane/config/chains.yaml \
  --ism ./hyperlane/config/ism.yaml \
  --key $VALIDATOR_KEY

# Extract and save contract addresses
echo "Saving contract addresses to .env..."
CORE_ARTIFACTS=$(ls -t artifacts/core-deployment-*.json | head -1)
SAGA_MAILBOX=$(cat $CORE_ARTIFACTS | jq -r '.saga.mailbox')
SAGA_ISM=$(cat $CORE_ARTIFACTS | jq -r '.saga.defaultIsm')
ROOTSTOCK_MAILBOX=$(cat $CORE_ARTIFACTS | jq -r '.rootstock.mailbox')
ROOTSTOCK_ISM=$(cat $CORE_ARTIFACTS | jq -r '.rootstock.defaultIsm')

# Update .env with contract addresses
sed -i '' "s/^SAGA_MAILBOX=.*/SAGA_MAILBOX=$SAGA_MAILBOX/g" .env
sed -i '' "s/^SAGA_ISM=.*/SAGA_ISM=$SAGA_ISM/g" .env
sed -i '' "s/^ROOTSTOCK_MAILBOX=.*/ROOTSTOCK_MAILBOX=$ROOTSTOCK_MAILBOX/g" .env
sed -i '' "s/^ROOTSTOCK_ISM=.*/ROOTSTOCK_ISM=$ROOTSTOCK_ISM/g" .env

# Let the user know to set up validators and relayers
echo "Please set up Hyperlane validators and relayers using Kurtosis:"
echo "Run: hyperlane deploy kurtosis-agents"
echo "Follow the link provided and complete the setup in Kurtosis Cloud"
echo "Wait for validators and relayers to sync before proceeding"

read -p "Press enter once validators and relayers are set up..."

# Test the bridge
echo "Testing the Hyperlane bridge..."
hyperlane send message --key $VALIDATOR_KEY

# Deploy Warp Route
echo "Deploying Hyperlane Warp Route for TRUE token..."
hyperlane deploy warp --config ./hyperlane/config/warp-route-deployment.yaml --key $VALIDATOR_KEY

# Extract and save warp route token address
WARP_ARTIFACTS=$(ls -t artifacts/warp-route-deployment-*.json | head -1)
ROOTSTOCK_TRUE_TOKEN=$(cat $WARP_ARTIFACTS | jq -r '.rootstock.token')

# Update .env with token address
sed -i '' "s/^ROOTSTOCK_TRUE_TOKEN=.*/ROOTSTOCK_TRUE_TOKEN=$ROOTSTOCK_TRUE_TOKEN/g" .env

echo "Hyperlane setup complete!"
echo "Please review the contract addresses in the .env file" 