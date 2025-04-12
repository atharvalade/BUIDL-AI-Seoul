#!/bin/bash

# Exit on error
set -e

echo "Setting up Hyperlane for TrueLens..."

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
  --key $PRIVATE_KEY

# Let the user know to set up validators and relayers
echo "Please set up Hyperlane validators and relayers using Kurtosis:"
echo "Run: hyperlane deploy kurtosis-agents"
echo "Follow the link provided and complete the setup in Kurtosis Cloud"
echo "Wait for validators and relayers to sync before proceeding"

read -p "Press enter once validators and relayers are set up..."

# Test the bridge
echo "Testing the Hyperlane bridge..."
hyperlane send message --key $PRIVATE_KEY

# Deploy Warp Route
echo "Deploying Hyperlane Warp Route for TRUE token..."
hyperlane deploy warp --config ./hyperlane/config/warp-route-deployment.yaml --key $PRIVATE_KEY

echo "Hyperlane setup complete!"
echo "Please update the contract addresses in .env file with the addresses from the deployment artifacts" 