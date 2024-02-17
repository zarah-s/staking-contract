// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyToken is ERC20, Ownable {
    constructor() ERC20("PYDECOIN", "PYC") Ownable(msg.sender) {
        _mint(msg.sender, 100000 * 10 ** 18);
    }
}
