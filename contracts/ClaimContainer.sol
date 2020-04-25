pragma solidity >=0.5.0 <0.7.0;

contract ClaimContainer {

    uint256 public claimCount;
    mapping (uint256 => Claim) public claims;

    mapping (address => Claim[]) public ownedClaims;
    mapping (address => uint256) public numberOfOwned;

    event ClaimRequested(
        address _sender,
        address _issuer);
    event ClaimAdded(
        address _issuer,
        string _ownerName,
        string _data);
    constructor  () public {
        claimCount = 0;
        addClaim("Facebook","Has Instagram");
        addClaim("Facebook","Has Facebook");
        addClaim("Facebook","Has Whatsapp");
        addClaimToOwned(1);
    }
    function get()
    public
    view
    returns(string memory _ownerName)
    {
        return ownedClaims[msg.sender][1].ownerName;
    }
    struct Claim {
        address payable issuer;
        string ownerName;
        string data;
    }

    function addClaim(
        string memory _ownerName,
        string memory _data
    )
        public
        returns(
            string memory _ownerNameR,
            string memory _dataR,
            address _issuer
        )
    {
        uint256 claimId = claimCount + 1;
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

    function addClaimToOwned(uint256 claimId) public {
            if(claimId > 1 && claimId <= claimCount){
                address payable self = msg.sender;
                uint256 nr = numberOfOwned[self];
                nr++;
                // ownedClaims[msg.sender][nr].issuer =    claims[claimId].issuer;
                // ownedClaims[msg.sender][nr].ownerName = claims[claimId].ownerName;
                // ownedClaims[msg.sender][nr].data =      claims[claimId].data;
                ownedClaims[self].push(Claim(
                                                claims[claimId].issuer,
                                                claims[claimId].ownerName,
                                                claims[claimId].data)
                                            );
                numberOfOwned[self] = nr;
        }
    }

    function getClaimOwnedNumber() public view returns(uint256 _nrOwned){
        address payable self = msg.sender;
        return numberOfOwned[self];
    }

    function getClaimOwned(uint256 _claimOwnedId) //Not working
        public
        view
        returns(
            address _issuer,
            string memory _ownerName,
            string memory _data
        )
    {
        return (
            ownedClaims[msg.sender][_claimOwnedId].issuer,
            ownedClaims[msg.sender][_claimOwnedId].ownerName,
            ownedClaims[msg.sender][_claimOwnedId].data
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