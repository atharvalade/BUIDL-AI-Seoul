# TrueLens Backend

This backend implementation connects the TrueLens SAGA chainlet with Rootstock using Hyperlane for cross-chain functionality.

## Directory Structure

- **saga/** - Contains contracts for the SAGA chainlet with TRUE token
- **rootstock/** - Contains contracts for pool management and rewards on Rootstock
- **hyperlane/** - Contains configuration and scripts for the Hyperlane bridge

## Setup Instructions

1. Install dependencies: `npm install`
2. Configure Hyperlane using the configs in `hyperlane/config/`
3. Deploy contracts using scripts in each respective directory
4. Set up Hyperlane bridge using scripts in `hyperlane/scripts/`

## Architecture

The system uses Hyperlane to bridge the TRUE token between SAGA and Rootstock:
- SAGA chainlet: User verification and TRUE token minting
- Rootstock: Pool management and rewards distribution
- Hyperlane: Cross-chain messaging and token transfers 