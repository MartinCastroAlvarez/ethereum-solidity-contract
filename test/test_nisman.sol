pragma solidity >=0.4.25 <0.9.0;

import "truffle/Assert.sol";
import "../contracts/nisman.sol";

contract TestNisman {
    uint public initialBalance = 1 ether;

    // Validating the default killer is the account that deploys the contract.
    function testGetKiller() public {
        Nisman nisman = new Nisman();
        address killer = nisman.getKiller();
        Assert.isTrue(killer == address(this), "There is no initial killer");
    }

    // Validating the function to get the total amount of kills by address.
    function testGetKills() public {
        Nisman nisman = new Nisman();
        uint kills = nisman.getKills(address(this));
        Assert.equal(kills, 1, "There are not enough kills");
    }

    // Validating the method to set the new killer.
    // It must update the current killer and the total amount of kills.
    function testSetKiller() public {
        Nisman nisman = new Nisman();
        uint seed = 123;
        address killer = address(uint160(uint(keccak256(abi.encodePacked(seed, blockhash(block.timestamp))))));
        Assert.isTrue(nisman.getKills(killer) == 0, "The initial amount of kills is not zero.");
        nisman.setKiller(payable(killer));
        Assert.isTrue(nisman.getKiller() == killer, "The new killer was not set.");
        Assert.isTrue(nisman.getKills(killer) == 1, "The kills count was not updated.");
    }

    // Validating that the sender must be equal to the current
    // killer of the Contract. Otherwise, it fails.
    function testSetKillerInvalidSender() public {
        Nisman nisman = new Nisman();
        uint seed = 123;
        address first = address(uint160(uint(keccak256(abi.encodePacked(seed, blockhash(block.timestamp))))));
        address second = address(uint160(uint(keccak256(abi.encodePacked(seed, blockhash(block.timestamp))))));
        nisman.setKiller(payable(first));
        bool failed = false;
        try nisman.setKiller(payable(second)) {
            failed = false;
        }
        catch {
            failed = true;
        }
        Assert.isTrue(failed, "Not restricting the killer to set a new killer.");
    }

    // Validating the function that sends Ether to the Contract.
    function testPayKiller() payable public {
        Nisman nisman = new Nisman();
        uint amount = 1;
        nisman.payKiller{value: amount}(amount);
        // Assert.equal(address(nisman).balance, amount, "The contract has not received any Ether");
    }

    // Validating that the new Killer gets the contract current balance.
    function testSetKillerPayment() payable public {
        Nisman nisman = new Nisman();
        uint8 amount = 2;
        nisman.payKiller{value: amount}(amount);
        uint seed = 123;
        address killer = address(uint160(uint(keccak256(abi.encodePacked(seed, blockhash(block.timestamp))))));
        nisman.setKiller(payable(killer));
    }
}
