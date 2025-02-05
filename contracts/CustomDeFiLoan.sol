// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "./LoanLibrary.sol";
import "./DeFiLoan.sol";


contract CustomDeFiLoan is DeFiLoan {

    constructor() DeFiLoan() {}

    // Funcție suplimentară pentru prelungirea unui împrumut
    function extendLoan(uint _loanIndex, uint _extraTime) public {
        require(_loanIndex < activeLoans[msg.sender].length, "Loan does not exist");
        Loan storage loan = activeLoans[msg.sender][_loanIndex];
        loan.dueDate += _extraTime;
    }
}
