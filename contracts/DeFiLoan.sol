pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

contract DeFiLoan {

    struct Loan {
        uint amount;
        uint interest; //dobanda
        uint dueDate;
        address borrower;
        bool isRepaid; // imprumutul a fosr returnat complet, adica tot cu dobanda
    }

    address public owner;
    mapping(address => Loan[]) public activeLoans;
    mapping(address => Loan[]) public paidLoans;

    event LoanCreated(address indexed borrower, uint amount, uint interest, uint dueDate, bool isRepaid);
    event LoanRepaid(address indexed borrower, uint loanIndex);
    event OwnerAddress(address owner);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }

    constructor() public {
        owner = msg.sender; //adresa celui care a creat contractul
        emit OwnerAddress(owner);
       // Creează un împrumut cu data de scadență în viitor (30 de zile de la timestamp-ul curent)
        uint dueDate = block.timestamp + (30 * 1 days); // 30 zile
        createLoan(5, dueDate);
        createLoan(5, dueDate);
    }

    //adauga un nou imprumut in lista unui utilizator
    function createLoan(uint _amount, uint _dueDate) public {
        require(_amount > 0, "Amount must be greater than 0");
        require(_dueDate > block.timestamp, "Due date must be in the future");

        activeLoans[owner].push(Loan({
            amount: _amount,
            interest: 10,
            dueDate: _dueDate,
            borrower: owner,
            isRepaid: false
        }));

        emit LoanCreated(msg.sender, _amount, 10, _dueDate, false);
    }

    //afiseaza toate imprumuturile unui utilizator
    function getActiveLoans(address _borrower) external view returns (Loan[] memory) {
        return activeLoans[_borrower];
    }

    function getPaidLoans(address _borrower) external view returns (Loan[] memory) {
        return paidLoans[_borrower];
    }

    //permite rambursarea unui anumit imprumut
    function repayLoan(address borrower, uint256 index) public payable {
        //require(index < activeLoans[borrower].length, "Loan does not exist");
    
        Loan storage loan = activeLoans[borrower][index];
        //uint256 totalAmount = loan.amount + loan.interest;
    
        //require(msg.value >= totalAmount, "Not enough funds to repay loan");
    
        // Marcare ca rambursat
        loan.isRepaid = true;
    
        // Mută împrumutul în lista de împrumuturi plătite
        paidLoans[borrower].push(loan);

        // Șterge împrumutul din activeLoans
        delete activeLoans[borrower][index];
    }

    /*
    function withdrawFunds() public onlyOwner {
        // Transfer ETH către proprietar
    }

    function calculateInterest(uint _amount, uint _rate) public pure returns (uint) {
        return (_amount * _rate) / 100;
    }
    */
}