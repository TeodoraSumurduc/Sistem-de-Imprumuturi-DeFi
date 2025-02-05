const LoanLibrary = artifacts.require("LoanLibrary");
const DeFiLoan = artifacts.require("DeFiLoan");
const CustomDeFiLoan = artifacts.require("CustomDeFiLoan");
const LoanProxy = artifacts.require("LoanProxy");

module.exports = async function (deployer) {
  // Migratează LoanLibrary mai întâi
  await deployer.deploy(LoanLibrary);
  const loanLibrary = await LoanLibrary.deployed();

  // Leagă LoanLibrary la DeFiLoan și CustomDeFiLoan
  await deployer.link(LoanLibrary, DeFiLoan);
  await deployer.link(LoanLibrary, CustomDeFiLoan);
  
  // Migratează DeFiLoan
  await deployer.deploy(DeFiLoan);
  const defiLoan = await DeFiLoan.deployed();

  // Migratează CustomDeFiLoan, legând LoanLibrary
  await deployer.deploy(CustomDeFiLoan);
  const customDeFiLoan = await CustomDeFiLoan.deployed();

  // Migratează LoanProxy, indicând adresa contractului DeFiLoan
  await deployer.deploy(LoanProxy, defiLoan.address);
  const loanProxy = await LoanProxy.deployed();

  console.log("LoanLibrary contract deployed at:", loanLibrary.address);
  console.log("DeFiLoan contract deployed at:", defiLoan.address);
  console.log("CustomDeFiLoan contract deployed at:", customDeFiLoan.address);
  console.log("LoanProxy contract deployed at:", loanProxy.address);
};
