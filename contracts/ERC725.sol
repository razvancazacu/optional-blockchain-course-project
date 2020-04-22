pragma solidity >=0.5.0 <0.7.0;

// @refference 
// https://github.com/ethereum/EIPs/issues/725
// https://github.com/ethereum/EIPs/issues/734
abstract contract ERC725 {

    uint256 constant MANAGEMENT_KEY = 1;
    uint256 constant ACTION_KEY = 2;
    uint256 constant CLAIM_SIGNER_KEY = 3;
    uint256 constant ENCRYPTION_KEY = 4;

    event KeyAdded(address indexed key, uint256 indexed keyType);
    event KeyRemoved(address indexed key, uint256 indexed keyType);
    event ExecutionRequested(bytes32 indexed executionId, address indexed to, uint256 indexed value, bytes32 data);
    event Executed(bytes32 indexed executionId, address indexed to, uint256 indexed value, bytes32 data);
    event Approved(bytes32 indexed executionId, bool approved);

    function  getKeyType(address _key)  public virtual  view  returns(uint256 keyType);
    function getKeysByType(uint256 _type) public virtual  view returns(address[] memory keys);
    function addKey(address _key, uint256 _type) public virtual  returns (bool success);
    function removeKey(address _key) public virtual returns (bool success);
    function execute(address _to, uint256 _value, bytes32 _data) public virtual returns (bytes32 executionId);
    function approve(bytes32 _id, bool _approve) public virtual returns (bool success);
}