import { ethers } from "hardhat";

async function main() {

  const token = await ethers.deployContract("MyToken");
  await token.waitForDeployment();

  const staking = await ethers.deployContract("Staking", [token.target]);
  staking.waitForDeployment()
  console.log(
    `Token contract deployed at ${token.target}`
  );

  console.log(
    `Staking contract deployed at ${staking.target}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
