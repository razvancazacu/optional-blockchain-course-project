pragma solidity >=0.5.0 <0.7.0;

import "./ERC725.sol";

contract KeyContainer is ERC725 {
 /*
 * key: A public key owned by this identity
 * purpose: uint256[] Array of the key types, like 1 = MANAGEMENT, 2 = EXECUTION
 * keyType: The type of key used, which would be a 
 *          uint256 for different key types. e.g. 1 = ECDSA, 2 = RSA, etc.
 * key: bytes32 The public key. // for non-hex and long keys, its the Keccak256 hash of the key
 */
    mapping (address => uint256) keys;
    mapping (uint256 => address[]) keysByType;

    function  getKeyType(address _key)  public override  view  returns(uint256 keyType){
        return keys[_key];
    }
    function getKeysByType(uint256 _type) public override  view returns(address[] memory _keys){
        return keysByType[_type]
    }   
    function addKey(address _key, uint256 _type) public override  returns (bool success){
        
    }
    function removeKey(address _key) public override returns (bool success){
        
    }
    function execute(address _to, uint256 _value, bytes32 _data) public override returns (bytes32 executionId){
        
    }
    function approve(bytes32 _id, bool _approve) public override returns (bool success){
        
    }
}