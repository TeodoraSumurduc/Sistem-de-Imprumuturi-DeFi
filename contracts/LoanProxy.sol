// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract LoanProxy {
    address public loanLogic; // Adresa contractului logic (DeFiLoan)
    address public owner;

    constructor(address _loanLogic) {
        loanLogic = _loanLogic;
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }

    // Permite upgrade-ul contractului logic
    function upgrade(address _newLogic) public onlyOwner {
        loanLogic = _newLogic;
    }

    // Funcție receive pentru a accepta ETH fără date
    receive() external payable {}

    // Funcție fallback care deleghează apelurile către contractul logic
    fallback() external payable {
        (bool success, ) = loanLogic.delegatecall(msg.data);
        require(success, "Delegatecall failed");
    }
}
