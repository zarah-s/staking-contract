import {
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Staking", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployOneYearLockFixture() {


    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("MyToken");
    const token = await Token.deploy();

    const Staking = await ethers.getContractFactory("Staking");
    const staking = await Staking.deploy(token.target);

    return { token, owner, otherAccount, staking };
  }

  describe("Deployment", function () {
    it("Should set the token address", async function () {
      const { token, staking } = await loadFixture(deployOneYearLockFixture);

      expect(await staking.getTokenAddress()).to.equal(token.target);
    });


  });

  describe("Stake", function () {
    it("Should revert with custom error if amount sent is zero", async function () {
      const { token, staking } = await loadFixture(deployOneYearLockFixture);
      const amount = 0;
      await token.approve(staking.target, amount)
      await expect(staking.stake(amount)).to.be.revertedWithCustomError(staking, "ZERO_AMOUNT()")
    })

    it("Should revert with custom error if staker token balance is zero", async function () {
      const { token, staking, otherAccount } = await loadFixture(deployOneYearLockFixture);
      const amount = 10;
      await token.approve(staking.target, amount)
      await expect(staking.connect(otherAccount).stake(amount)).to.be.revertedWithCustomError(staking, "INSUFFICIENT_TOKEN()")
    })

    it("Should stake appropriate stake amount", async function () {
      const { token, staking, owner } = await loadFixture(deployOneYearLockFixture);
      const amount = 10;
      await token.approve(staking.target, amount)

      await staking.stake(amount);
      expect((await staking.getStakeInfo(owner.address)).totalStaked).eq(amount);
      expect((await staking.getStakeInfo(owner.address)).reward).eq(0);

    })
  })



  describe("UnStake", function () {
    it("Should revert if unstaking amount is greater than the staked amount", async function () {
      const { token, staking, owner } = await loadFixture(deployOneYearLockFixture);
      const amount = 10;
      await token.approve(staking.target, amount)

      await staking.stake(amount);
      await expect(staking.unstake(amount + 1)).to.be.revertedWithCustomError(staking, "INSUFFICIENT_STAKED_TOKEN()");

    })

    it("Should update stake info for user [on stake]", async function () {
      const { token, staking, owner } = await loadFixture(deployOneYearLockFixture);
      const amount = 10;
      await token.approve(staking.target, amount)

      await staking.stake(amount);
      await staking.unstake(amount);
      expect((await staking.getStakeInfo(owner.address)).totalStaked).eq(0);
      expect((await staking.getStakeInfo(owner.address)).reward).eq(0);

    })
  })


  describe("ClaimReward", function () {
    it("Should revert if reward us zero", async function () {
      const { token, staking, } = await loadFixture(deployOneYearLockFixture);
      const amount = 10;
      await token.approve(staking.target, amount)

      await staking.stake(amount);
      await expect(staking.claimReward()).to.be.revertedWithCustomError(staking, "NO_REWARD()");

    })
  })


});
