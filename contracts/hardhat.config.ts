import { defineConfig } from "hardhat/config";
import hardhatEthers from "@nomicfoundation/hardhat-ethers";
import * as dotenv from "dotenv";

dotenv.config();

export default defineConfig({
  plugins: [hardhatEthers],
  solidity: {
    version: "0.8.28",
  },
  networks: {
    hardhat: {
      type: "edr-simulated",
    },
    arc_testnet: {
      type: "http",
      url: process.env.ARC_RPC_URL || "",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
  },
});