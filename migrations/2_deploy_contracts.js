var myContract = artifacts.require("./MyContract.sol");

module.exports = function(deployer) {
  deployer.deploy(myContract);
};
