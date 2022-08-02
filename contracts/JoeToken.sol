pragma solidity ^0.8.0;
// SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// learn more: https://docs.openzeppelin.com/contracts/3.x/erc20

contract JoeToken is ERC20 {
    constructor() ERC20("Coffee", "JOE") {
        _mint(msg.sender, 10000000 * 10**18);
    }
}
