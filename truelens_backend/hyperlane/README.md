# TrueLens Hyperlane Integration

This directory contains the configuration and scripts for integrating Hyperlane as a bridge between the TrueLens SAGA chainlet and Rootstock.

## Directory Structure

- **config/** - Contains Hyperlane configuration files
  - `chains.yaml` - Chain configurations for SAGA and Rootstock
  - `ism.yaml` - Interchain Security Module configuration
  - `warp-route-deployment.yaml` - Configuration for creating a Warp Route for the TRUE token
- **scripts/** - Contains scripts for setting up and deploying Hyperlane
  - `setup-hyperlane.sh` - Script to deploy Hyperlane core contracts and Warp Route

## Setup Instructions

1. Install dependencies:
   ```
   npm install
   ```

2. Update the configuration files with your specific values:
   - Update `chains.yaml` with your SAGA chainlet RPC URL and ChainID
   - Update `ism.yaml` with your validator addresses
   - Update `warp-route-deployment.yaml` with your TRUE token address

3. Set up environment variables in `.env` file:
   ```
   PRIVATE_KEY=your_private_key_here
   ```

4. Run the setup script:
   ```
   ./scripts/setup-hyperlane.sh
   ```

## How It Works

1. **Hyperlane Core Contracts**: Deployed on both SAGA and Rootstock to enable cross-chain messaging.
2. **Validators and Relayers**: Set up via Kurtosis to secure and deliver messages between chains.
3. **Warp Route**: Creates a bridged version of the TRUE token on Rootstock.
4. **Message Passing**: TrueLensHyperlaneAdapter on SAGA sends verification results and rewards to TrueLensPool on Rootstock.

## Architecture

```
SAGA Chainlet                          Rootstock
+------------------------+              +------------------------+
| TRUEToken              |              | Bridged TRUEToken     |
+------------------------+              +------------------------+
| TrueLensVerification   |              | TrueLensPool          |
+------------------------+              +------------------------+
| TrueLensHyperlaneAdapter|<--Hyperlane-->| TrueLensLeaderboard   |
+------------------------+              +------------------------+
| Hyperlane Mailbox      |<--Validators-->| Hyperlane Mailbox     |
+------------------------+  & Relayers  +------------------------+
```

## Troubleshooting

- If Hyperlane message delivery fails, check the Kurtosis dashboard for validator and relayer status.
- Ensure you have the correct domain IDs and contract addresses in all configurations.
- Make sure there is enough gas on both chains for message delivery. 