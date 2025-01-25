const DeFiLoan = artifacts.require("./DeFiLoan.sol");

module.exports = function(deployer) {
  deployer.deploy(DeFiLoan);
};
