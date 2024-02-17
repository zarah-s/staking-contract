// SPDX-License-Identifier: MIT

pragma solidity ^0.8.8;

import "contracts/IERC20.sol";

error ZERO_AMOUNT();
error INSUFFICIENT_TOKEN();
error INSUFFICIENT_STAKED_TOKEN();
error NO_REWARD();

contract Staking {
    IERC20 token;

    // Struct to store user's staking data
    struct StakerData {
        uint totalStaked;
        uint lastStakedTimestamp;
        uint reward;
    }

    mapping(address => StakerData) stakers;

    constructor(IERC20 _token) {
        token = _token;
    }

    function getTokenAddress() external view returns (address) {
        return address(token);
    }

    function calculateReward(address user) public view returns (uint) {
        StakerData storage staker = stakers[user];

        uint stakingDuration = block.timestamp - staker.lastStakedTimestamp;

        uint calculatedReward = ((staker.totalStaked * 10) / 100) *
            ((stakingDuration / 60));

        return calculatedReward;
    }

    function stake(uint amount) external {
        if (amount < 1) {
            revert ZERO_AMOUNT();
        }

        if (token.balanceOf(msg.sender) < amount) {
            revert INSUFFICIENT_TOKEN();
        }

        token.transferFrom(msg.sender, address(this), amount);

        // Update staker's data
        StakerData storage staker = stakers[msg.sender];

        staker.reward = staker.reward + calculateReward(msg.sender);

        staker.totalStaked = staker.totalStaked + amount;

        staker.lastStakedTimestamp = block.timestamp;
    }

    function unstake(uint amount) external {
        StakerData storage staker = stakers[msg.sender];

        if (amount > staker.totalStaked) {
            revert INSUFFICIENT_STAKED_TOKEN();
        }

        // Update staker's data
        staker.reward = staker.reward + (calculateReward(msg.sender));

        staker.totalStaked = staker.totalStaked - (amount);

        staker.lastStakedTimestamp = block.timestamp;

        token.transfer(msg.sender, amount);
    }

    function claimReward() external {
        StakerData storage staker = stakers[msg.sender];

        uint reward = staker.reward + (calculateReward(msg.sender));

        if (reward < 1) {
            revert NO_REWARD();
        }

        staker.reward = 0;

        staker.lastStakedTimestamp = block.timestamp;

        token.transfer(msg.sender, reward);
    }

    function getStakeInfo(
        address _user
    ) external view returns (StakerData memory) {
        return stakers[_user];
    }
}
