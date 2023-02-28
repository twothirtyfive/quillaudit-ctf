const { expect } = require("chai");
const { ethers, provider } = require("hardhat")

describe("ConfidentialHash contract", function () {
  it("Deploy ConfidentialHash and find the keccak256 hash of aliceHash and bobHash", async function () {
	const [owner, addr1, addr2] = await ethers.getSigners();

    const ConfidentialHashFactory = await ethers.getContractFactory("ConfidentialHash");

    const hhCHash = await ConfidentialHashFactory.deploy();
	await hhCHash.deployed()

	let result;
	let resultList = [];
	for(let i = 0; i < 10; i++) {
		result = await ethers.provider.getStorageAt(hhCHash.address, i)
		resultList.push(result)
	}
	const ALICE_HASH = resultList[4]
	const BOB_HASH = resultList[9]
	
	let hash = await hhCHash.hash(ALICE_HASH, BOB_HASH)
	
	result = await hhCHash.checkthehash(hash)
	expect(result).to.equal(true)
  });
});