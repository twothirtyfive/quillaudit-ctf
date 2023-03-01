const { expect } = require("chai");
const { ethers, provider } = require("hardhat")

describe("d31eg4t3 contract", function () {
  it("Deploy d31eg4t3 contract, become owner of the contract, make canYouHackMe mapping to true for my own address", async function () {
    const [owner, attacker] = await ethers.getSigners();

    const baseContract = await ethers.getContractFactory("D31eg4t3");
    const hhBaseContract = await baseContract.deploy();
	await hhBaseContract.deployed()
	
	// // view delegate contract slots to verify storage layout
	// let result;
	// let resultList = [];
	// for(let i = 0; i < 8; i++) {
	// 	result = await ethers.provider.getStorageAt(hhBaseContract.address, i)
	// 	resultList.push(result)
	// 	console.log(result)
	// }
	
    const attackContract = await ethers.getContractFactory("AttackContract");
    const hhAttackContract = await attackContract.connect(attacker).deploy();
	await hhAttackContract.deployed()
	
	await hhAttackContract.connect(attacker).attack(hhBaseContract.address)
    expect(await hhBaseContract.owner()).to.eq(attacker.address);
    expect(await hhBaseContract.canYouHackMe(attacker.address)).to.be.true;
  });
});