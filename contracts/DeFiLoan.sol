// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "./ILoan.sol";
import "./LoanLibrary.sol";

contract DeFiLoan is ILoan {
    address payable public owner;
    mapping(address => Loan[]) public activeLoans;
    mapping(address => Loan[]) public paidLoans;
    mapping(address => uint) public balances; 

    event LoanCreated(
        address indexed borrower,
        uint amount,
        uint interest,
        uint dueDate,
        bool isRepaid
    );
    event LoanRepaid(address indexed borrower, uint loanIndex);
    event OwnerAddress(address owner);


    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }

    constructor() {
        owner = payable(msg.sender); 
        emit OwnerAddress(owner);
    }

    function getBalance() public view returns (uint value){
        return balances[msg.sender];
    }

   
    function createLoan(uint _amount, uint _dueDate) public override {
       
    require(_amount > 0, "Amount must be greater than 0");
    require(_dueDate > block.timestamp, "Due date must be in the future");

   
  

        activeLoans[msg.sender].push(
            Loan({
                amount: _amount,
                interest: 10,
                dueDate: _dueDate,
                borrower: msg.sender,
                isRepaid: false
            })
        );
        

        emit LoanCreated(msg.sender, _amount, 10, _dueDate, false);
    }

   
    function getActiveLoans(
        address _borrower
    ) external view override returns (Loan[] memory) {
        return activeLoans[_borrower];
    }

    function getPaidLoans(
        address _borrower
    ) external view returns (Loan[] memory) {
        return paidLoans[_borrower];
    }

    function repayLoan(address _borrower, uint256 _index) public payable override {
        require(_index < activeLoans[_borrower].length, "Loan does not exist");

        Loan storage loan = activeLoans[_borrower][_index];
        uint256 interestAmount = LoanLibrary.calculateInterest(loan.amount, loan.interest);
        uint total = loan.amount + interestAmount;

        require(msg.value == total, "Not enough funds to repay loan");

        
        loan.isRepaid = true;

        
        payable(owner).transfer(interestAmount);

        paidLoans[_borrower].push(loan);

        emit LoanRepaid(_borrower, _index);
    }


    
}
   

