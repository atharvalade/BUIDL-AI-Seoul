require("@nomicfoundation/hardhat-toolbox");
require("hardhat-deploy");
require("dotenv").config();

const PRIVATE_KEY = process.env.PRIVATE_KEY || "0x0000000000000000000000000000000000000000000000000000000000000000";
const SAGA_RPC_URL = process.env.SAGA_RPC_URL || "https://your-saga-chainlet-rpc-url";
const ROOTSTOCK_RPC_URL = process.env.ROOTSTOCK_RPC_URL || "https://public-node.testnet.rsk.co";

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    saga: {
      url: SAGA_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: parseInt(process.env.SAGA_CHAIN_ID || "1712771388991266")
    },
    rootstock: {
      url: ROOTSTOCK_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 31,  // Rootstock testnet chainId
      gasPrice: 65000000 // Specific for Rootstock
    }
  },
  namedAccounts: {
    deployer: {
      default: 0
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  }
}; 