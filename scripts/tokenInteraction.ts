
import { ethers } from 'hardhat'

async function main() {
    const tokenAddress = "0xe867EDDdEF402b7074D226701265819578D992EC";
    const stakingAddress = "0x0Fa96CA248911157645040a65397b707f3Dd0257";
    const EOA = "0x42AcD393442A1021f01C796A23901F3852e89Ff3";

    const TokenFactory = await ethers.getContractFactory("MyToken");
    const token = TokenFactory.attach(tokenAddress)

    const myBalance = await (token as any).balanceOf(EOA);
    console.log(myBalance);

    await (await (token as any).transfer(stakingAddress, 1000000000)).wait();

    const newBalance = await (token as any).balanceOf(EOA);
    console.log(newBalance);

    const allowance = await (token as any).allowance(EOA, stakingAddress);

    console.log(allowance);

}



main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});