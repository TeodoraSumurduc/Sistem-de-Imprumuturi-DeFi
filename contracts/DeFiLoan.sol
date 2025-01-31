pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

contract DeFiLoan {

    struct Loan {
        uint amount;
        uint interest;
        uint dueDate;
        address borrower;
        bool isRepaid;
    }

    address public owner;
    mapping(address => Loan[]) public loans;

    event LoanCreated(address indexed borrower, uint amount, uint interest, uint dueDate);
    event LoanRepaid(address indexed borrower, uint loanIndex);
    event OwnerAddress(address owner);

    modifier onlyOwner() {
        ///require(msg.sender == owner, "Not the owner");
        _;
    }

    constructor() public {
        owner = msg.sender; //adresa celui care a creat contractul
        emit OwnerAddress(owner);
        createLoan(5, 3, 27);
    }

    //adauga un nou imprumut in lista unui utilizator
    function createLoan(uint _amount, uint _interest, uint _dueDate) public {
        ///require(_amount > 0, "Amount must be greater than 0");
        ///require(_dueDate > block.timestamp, "Due date must be in the future");

        loans[owner].push(Loan({
            amount: _amount,
            interest: _interest,
            dueDate: _dueDate,
            borrower: owner,
            isRepaid: false
        }));

        emit LoanCreated(msg.sender, _amount, _interest, _dueDate);
    }

    //afiseaza toate imprumuturile unui utilizator
    function getLoans(address _borrower) external view returns (Loan[] memory) {
        return loans[_borrower];
    }

    /*
    //permite rambursarea unui anumit imprumut
    function repayLoan(uint _loanIndex) external payable {
        // Logica de rambursare
    }

    function withdrawFunds() public onlyOwner {
        // Transfer ETH către proprietar
    }

    function calculateInterest(uint _amount, uint _rate) public pure returns (uint) {
        return (_amount * _rate) / 100;
    }
    */
}