pragma solidity >=0.5.0 <0.7.0;

contract ClaimContainer {

    uint256 public claimCount;
    mapping (uint256 => Claim) public claims;

    mapping (address => Claim[]) ownedClaims;
    mapping (address => uint256) public numberOfOwned;
    event ClaimRequested(address _sender,address _issuer);
    event ClaimAdded(address _issuer, string _ownerName, string _data);
    address public test_adding;
    constructor () public {
        test_adding = 0xb2341897B1CE81aC2C7553cE841d7efd2767e9EA;  //msg.sender
        addClaim("Facebook","Has Instagram");
        addClaim("Facebook","Has Facebook");
        addClaim("Facebook","Has Whatsapp");
        // addClaimToOwned(1);
        fill_mapHardCoded(
            Claim({issuer:0xb2341897B1CE81aC2C7553cE841d7efd2767e9EA,ownerName: "Microsoft",data:"Users" }),
            Claim({issuer:0xb2341897B1CE81aC2C7553cE841d7efd2767e9EA,ownerName: "Microsoft",data:"Windows 10" })
        );
    }
// --------------------------------------------------- TESTING HARD CODED
    function fill_mapHardCoded(Claim memory struct1,Claim memory struct2) internal  {
        ownedClaims[test_adding].push(struct1);
        ownedClaims[test_adding].push(struct2);
        numberOfOwned[test_adding] ++;
  }
    function returnTest_ConstrValues(uint256 _index) public view  //working
        returns( string memory _ownerNameR, string memory _dataR, address _issuer) {
            require(_index >= 0,"Error <0");
            require(_index < ownedClaims[test_adding].length,"Error out of bounds");
            return (
                ownedClaims[test_adding][_index].ownerName,
                ownedClaims[test_adding][_index].data,
                ownedClaims[test_adding][_index].issuer
            );
        }
    function returnTest_ConstrValues() public view  // working
        returns( string memory _ownerNameR, string memory _dataR, address _issuer) {
            return (
                ownedClaims[test_adding][0].ownerName,
                ownedClaims[test_adding][0].data,
                ownedClaims[test_adding][0].issuer
            );
    }
    function addToTestingAdding() public { // working
        address payable _is = 0xb2341897B1CE81aC2C7553cE841d7efd2767e9EA;
        ownedClaims[test_adding].push(Claim({
            issuer: _is,
            ownerName: "TestVal",
            data: "TestVal"})
             );
    }
// --------------------------------------------------- TESTING WITH ADDRESS MSG.SENDER THIS DOESNT WORK!!!
    function fill_map() public  {
        ownedClaims[msg.sender].push(Claim({issuer:0xb2341897B1CE81aC2C7553cE841d7efd2767e9EA,ownerName: "Microsoft",data:"Teams" }));
        ownedClaims[msg.sender].push(Claim({issuer:0xb2341897B1CE81aC2C7553cE841d7efd2767e9EA,ownerName: "Microsoft",data:"Windows 8.1" }));
        numberOfOwned[msg.sender] ++;
  }
    function addTest_values() public{  //not working
        ownedClaims[msg.sender][0].ownerName = "TestVal";
        ownedClaims[msg.sender][0].data = "TestVal";
        address payable _is = 0xb2341897B1CE81aC2C7553cE841d7efd2767e9EA;
        ownedClaims[msg.sender][0].issuer = _is;
    }
     function addTest_values2() public{
        address payable _is = 0xb2341897B1CE81aC2C7553cE841d7efd2767e9EA;
        ownedClaims[msg.sender].push(Claim({
            issuer: _is,
            ownerName: "TestVal",
            data: "TestVal"})
             );
    }

    function getMsgSender() public view returns (address _me){
        return msg.sender;
    }

    function get()  public view returns(string memory _ownerName) {
        return ownedClaims[msg.sender][1].ownerName;
    }

// --------------------------------------------------- TESTING WITH ADDRESS GIVEN ADDRESS
    // returns how many claim the owner has
    function getClaimOwnedNumber(address owner) public view returns(uint256 _nrOwned){
        return numberOfOwned[owner];
    }
     function getClaimOwnedNumberLength(address owner) public view returns(uint256 _nrOwned){
        return ownedClaims[owner].length;
    }
    function fill_map(address test_add) public  {
        ownedClaims[test_add].push(Claim({issuer:0xb2341897B1CE81aC2C7553cE841d7efd2767e9EA,ownerName: "Microsoft",data:"Teams" }));
        ownedClaims[test_add].push(Claim({issuer:0xb2341897B1CE81aC2C7553cE841d7efd2767e9EA,ownerName: "Microsoft",data:"Windows 8.1" }));
        numberOfOwned[test_add] ++;
  }
    function addTest_values(address test_add) public{  //not working
        ownedClaims[test_add][0].ownerName = "TestVal";
        ownedClaims[test_add][0].data = "TestVal";
        address payable _is = 0xb2341897B1CE81aC2C7553cE841d7efd2767e9EA;
        ownedClaims[test_add][0].issuer = _is;
    }
     function addTest_values2(address test_add) public{
        address payable _is = 0xb2341897B1CE81aC2C7553cE841d7efd2767e9EA;
        ownedClaims[test_add].push(Claim({
            issuer: _is,
            ownerName: "TestVal",
            data: "TestVal"})
             );
    }
    function addOwnedClaim(uint256 claimRequestedId, address owAddress) public{
        address payable _is = claims[claimRequestedId].issuer;
        string memory _owner = claims[claimRequestedId].ownerName;
        string memory _data = claims[claimRequestedId].data;
        ownedClaims[owAddress].push(Claim({
            issuer: _is,
            ownerName: _owner,
            data: _data})
             );
    }

  function getOwnedClaim(uint256 _claimOwnedId,address addr0) //Not working
        public
        view
        returns(
            address _issuer,
            string memory _ownerName,
            string memory _data
        )
    {
        return (
            ownedClaims[addr0][_claimOwnedId].issuer,
            ownedClaims[addr0][_claimOwnedId].ownerName,
            ownedClaims[addr0][_claimOwnedId].data
        );
    }
    function getMsgSender(address test_add) public pure returns (address _me){
        return test_add;
    }
     function getOwned0Value(address test_add) public view
        returns( string memory _ownerNameR, string memory _dataR, address _issuer) {
            return (
                ownedClaims[test_add][0].ownerName,
                ownedClaims[test_add][0].data,
                ownedClaims[test_add][0].issuer
            );
        }


    struct Claim {
        address payable issuer;
        string ownerName;
        string data;
    }
     function addClaim(string memory _ownerName, string memory _data) public
        returns( string memory _ownerNameR, string memory _dataR, address _issuer) {
        uint256 claimId = claimCount;
        claims[claimId].issuer = msg.sender;
        claims[claimId].ownerName = _ownerName;
        claims[claimId].data = _data;

        emit ClaimAdded(
            msg.sender,
            _ownerName,
            _data
        );
        claimCount++;
        return (
            claims[claimId].ownerName,
            claims[claimId].data,
            claims[claimId].issuer
        );
    }
    function getClaim(uint256 _claimId)
            public
            view
            returns(
                string memory _ownerName,
                string memory _data,
                address _issuer
            )
        {
            return (
                claims[_claimId].ownerName,
                claims[_claimId].data,
                claims[_claimId].issuer
            );
        }

}