
import { ethers } from 'hardhat'

async function main() {
    const tokenAddress = "0xe867EDDdEF402b7074D226701265819578D992EC";
    const stakingAddress = "0x0Fa96CA248911157645040a65397b707f3Dd0257";
    const EOA = "0x42AcD393442A1021f01C796A23901F3852e89Ff3";

    const StakingFactory = await ethers.getContractFactory("Staking");
    const TokenFactory = await ethers.getContractFactory("MyToken");
    const staking = StakingFactory.attach(stakingAddress);
    const token = TokenFactory.attach(tokenAddress);

    await (await (token as any).approve(stakingAddress, 20)).wait();

    await (await (staking as any).stake(20)).wait();
    const stakeInfo = await (staking as any).getStakeInfo(EOA);
    console.log(stakeInfo);

}



main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});