const { Contract } = require("ethers");
const { ethers } = require("hardhat");
const { use, expect } = require("chai");
let faucetContract, accounts;

describe("Deployment", function () {
  it("It should deploy successfully", async function () {
    const chatLogFactory = await hre.ethers.getContractFactory("Faucet");
    faucetContract = await chatLogFactory.deploy();
    await faucetContract.deployed();

    accounts = await ethers.getSigners();
  });

  it("It should have 0.5 ETH for the contract balance", async function () {
    await accounts[0].sendTransaction({
      to: faucetContract.address,
      value: ethers.utils.parseEther("0.5"),
    });

    let balance = await ethers.provider.getBalance(faucetContract.address);
    expect(ethers.utils.formatEther(balance)).to.equal("0.5");
  });
});

describe("The same account will request funds back to back", function () {
  it("The first one should work and increase their balance by 0.01 ETH", async function () {
    let balance = await ethers.provider.getBalance(accounts[1].address);
    expect(ethers.utils.formatEther(balance)).to.equal("10000.0");
    await faucetContract.faucet(accounts[1].address);
    balance = await ethers.provider.getBalance(accounts[1].address);
    expect(ethers.utils.formatEther(balance)).to.equal("10000.01");
  });

  it("The second call should revert b/c you cannot call twice in 24 hours", async function () {
    expect(faucetContract.faucet(accounts[1].address)).to.reverted;
  });
});

describe("Additional accounts will make successful requests", function () {
  it("The next should all work", async function () {
    let balance = await ethers.provider.getBalance(accounts[2].address);
    expect(ethers.utils.formatEther(balance)).to.equal("10000.0");
    await faucetContract.faucet(accounts[2].address);
    balance = await ethers.provider.getBalance(accounts[2].address);
    expect(ethers.utils.formatEther(balance)).to.equal("10000.01");

    balance = await ethers.provider.getBalance(accounts[3].address);
    expect(ethers.utils.formatEther(balance)).to.equal("10000.0");
    await faucetContract.faucet(accounts[3].address);
    balance = await ethers.provider.getBalance(accounts[3].address);
    expect(ethers.utils.formatEther(balance)).to.equal("10000.01");

    balance = await ethers.provider.getBalance(accounts[4].address);
    expect(ethers.utils.formatEther(balance)).to.equal("10000.0");
    await faucetContract.faucet(accounts[4].address);
    balance = await ethers.provider.getBalance(accounts[4].address);
    expect(ethers.utils.formatEther(balance)).to.equal("10000.01");

    balance = await ethers.provider.getBalance(accounts[5].address);
    expect(ethers.utils.formatEther(balance)).to.equal("10000.0");
    await faucetContract.faucet(accounts[5].address);
    balance = await ethers.provider.getBalance(accounts[5].address);
    expect(ethers.utils.formatEther(balance)).to.equal("10000.01");
  });

  it("The last one should fail b/c it cannot be called more than 5 times in a day", async function () {
    expect(faucetContract.faucet(accounts[6].address)).to.reverted;
  });
});

describe("The history is cleared to avoid needind to reply for testing", async function () {
  it("It should fail - owner only", async function () {
    expect(faucetContract.clear(accounts[6].address)).to.reverted;
  });

  it("This will reset the history", async function () {
    await faucetContract.clear();
  });

  it("This call should work b/c this history has been reset", async function () {
    await faucetContract.faucet(accounts[7].address);
    await faucetContract.faucet(accounts[8].address);
    await faucetContract.faucet(accounts[9].address);
  });
});

describe("The ownwer is the only one who may empty the contract", async function () {
  it("This will fail b/c a non owner is calling it", async function () {
    let contractBalance = await ethers.provider.getBalance(
      faucetContract.address
    );
    expect(faucetContract.connect(accounts[1]).emptyFaucet(contractBalance)).to
      .reverted;
  });

  it("This will succeed", async function () {
    let contractBalance = await ethers.provider.getBalance(
      faucetContract.address
    );
    let ownerBalance = await ethers.provider.getBalance(accounts[0].address);
    let numContract = parseFloat(ethers.utils.formatEther(contractBalance));
    let numOwner = parseFloat(ethers.utils.formatEther(ownerBalance));
    await faucetContract.emptyFaucet(contractBalance);

    let finalBalance = await ethers.provider.getBalance(accounts[0].address);
    let numFinal = parseFloat(ethers.utils.formatEther(finalBalance));

    expect(numFinal.toFixed(3)).to.equal((numContract + numOwner).toFixed(3));
  });
});
