import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import dotenv from "dotenv"
dotenv.config();
const RPC_URL = process.env.RPC_URL;
const PRIVATE_KEY: string = process.env.PRIVATE_KEY!;
const config: HardhatUserConfig = {
  solidity: "0.8.19",
  networks: {
    sepolia: {
      url: RPC_URL,
      accounts: [PRIVATE_KEY]
    }
  }
};

export default config;
