// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface ILoan {
    struct Loan {
        uint amount;
        uint interest; //dobanda
        uint dueDate;
        address borrower;
        bool isRepaid; // imprumutul a fost returnat complet
    }
    function createLoan(uint _amount, uint _dueDate) external;
    function getActiveLoans(address _borrower) external view returns (Loan[] memory);
    function repayLoan(address _borrower, uint _index) external payable;
}
