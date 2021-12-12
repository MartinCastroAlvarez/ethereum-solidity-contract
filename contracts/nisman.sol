// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity >=0.4.22 <0.9.0;

contract Nisman {
    string constant name = "Nisman Token";
    string constant symbol = "Nisman";
    string constant standard = "Nisman v1.0";

    address private killer;
    mapping (address => uint) private kills;
    
    // Event emitted when the current killer of Nisman is updated.
    event Killed(address indexed oldKiller, address indexed newKiller);
    event Payment(uint256 value, uint256 amount);

    // Validates that the account attempting to change the killer
    // is the actual killer of Nisman.
    // The original killer is the account that deploys the contract.
    modifier isKiller() {
        require(msg.sender == killer, "Caller is not the killer");
        _;
    }
    
    // Constructor executed only once during the deployment of this contract.
    // The original killer is the account that deploys the contract.
    constructor() {
        killer = msg.sender;
        kills[killer] += 1;
        emit Killed(address(0), killer);
    }

    // Sets the killer of Nisman.
    // You need to send a transaction to write to a state variable.
    function setKiller(address payable newKiller) public isKiller {
        kills[newKiller] += 1;
        emit Killed(killer, newKiller);
        killer = newKiller;
        newKiller.transfer(address(this).balance);
    }

    // Sends money to the current killer.
    // https://solidity-by-example.org/payable/
    function payKiller(uint256 amount) payable public {
        emit Payment(msg.value, amount);
        require(uint256(msg.value) == amount, "The amount of Ether does not match.");
    }

    // Returns the current killer of Nisman.
    // You can read from a state variable without sending a transaction.
    function getKiller() public view returns (address) {
        return killer;
    }

    // Returns the total amount of kills by address.
    // You can read from a state variable without sending a transaction.
    function getKills(address _killer) public view returns (uint) {
        return kills[_killer];
    }
}
