// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Withdrawal {
    mapping(address => uint256) public balances;

    // Permite depunerea de fonduri
    function deposit() public payable {
        balances[msg.sender] += msg.value;
    }

    // Permite retragerea fondurilor
    function withdraw() public {
        uint256 amount = balances[msg.sender];
        require(amount > 0, "Insufficient balance");

        // Setează balancele înainte de transfer pentru a preveni atacurile de reentrancy
        balances[msg.sender] = 0;

        // Transferă fondurile către utilizator
        payable(msg.sender).transfer(amount);
    }
}
