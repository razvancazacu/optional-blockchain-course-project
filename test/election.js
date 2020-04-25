var ClaimContainer = artifacts.require("./ClaimContainer.sol");

contract("ClaimContainer", function(accounts) {
  var claimInstance;


  it("it initializes the candidates with the correct values", function() {
    return ClaimContainer.deployed().then(function(instance) {
      claimInstance = instance;
      return claimInstance.candidates(1);
    }).then(function(candidate) {
      assert.equal(candidate[0], 1, "contains the correct id");
      assert.equal(candidate[1], "Candidate 1", "contains the correct name");
      assert.equal(candidate[2], 0, "contains the correct votes count");
      return claimInstance.candidates(2);
    }).then(function(candidate) {
      assert.equal(candidate[0], 2, "contains the correct id");
      assert.equal(candidate[1], "Candidate 2", "contains the correct name");
      assert.equal(candidate[2], 0, "contains the correct votes count");
    });
  });

});
