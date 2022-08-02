// SPDX-License-Identifier: UNLICENSED
/// @title A basic faucet contract
/// @author josephc.eth

pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Faucet is Ownable {
    event Drip(address recipient);
    event NextDrip(uint256 nextTimestamp);
    mapping(address => uint256) private lastClaim;
    uint256[] claimHistory;

    /// @notice The constructor
    constructor() {
        claimHistory.push(block.timestamp - 24 hours);
        claimHistory.push(block.timestamp - 24 hours);
        claimHistory.push(block.timestamp - 24 hours);
        claimHistory.push(block.timestamp - 24 hours);
        claimHistory.push(block.timestamp - 24 hours);
        console.log("We have been constructed!");
    }

    /** @notice allows a user to claim from the faucet, there must be enough ether in the faucet
        and there cannot be more than 5 claims in the past 24 hours */
    /// @param _to The address to send the ether to
    function faucet(address payable _to) public onlyOwner {
        require(
            address(this).balance > .01 ether,
            "Not enough ether in the faucet"
        );

        require(
            lastClaim[_to] == 0 ||
                (lastClaim[_to]) <= block.timestamp - 24 hours,
            "You can only claim once every 24 hours"
        );
        uint256 previousTimeStamp = claimHistory[claimHistory.length - 5];
        if (previousTimeStamp <= block.timestamp - 24 hours) {
            emit NextDrip(claimHistory[claimHistory.length - 4] + 24 hours);
        }
        require(
            previousTimeStamp <= block.timestamp - 24 hours,
            "The faucet has been claimed too many times in the past hour"
        );

        lastClaim[_to] = block.timestamp;
        claimHistory.push(block.timestamp);
        _to.transfer(.01 ether);
        emit Drip(_to);
    }

    /// @notice allows the owner to empty the faucet
    /// @param _amount The amount of ether to empty
    function emptyFaucet(uint256 _amount) public onlyOwner {
        require(
            address(this).balance <= _amount,
            "Not enough ether in the faucet"
        );
        payable(owner()).transfer(_amount);
    }

    function getLastClaim(address _to) public view returns (uint256) {
        return lastClaim[_to];
    }

    receive() external payable {}

    function clear() public onlyOwner {
        lastClaim[address(0xA528F58D716dC9a03487d7EEA1DBbD4a52AF4a23)] = 0;
        claimHistory.push(block.timestamp - 24 hours);
        claimHistory.push(block.timestamp - 24 hours);
        claimHistory.push(block.timestamp - 24 hours);
        claimHistory.push(block.timestamp - 24 hours);
        claimHistory.push(block.timestamp - 24 hours);
    }
}
