const { Contract } = require("ethers");
const { ethers } = require("hardhat");
const { use, expect } = require("chai");

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  const chatLogFactory = await hre.ethers.getContractFactory("Faucet");
  const faucetContract = await chatLogFactory.deploy();

  await faucetContract.deployed();

  async function callFaucet(address) {
    console.log("\n", "calling faucet");
    let balance1 = await ethers.provider.getBalance(address);
    console.log(address, "balance:", ethers.utils.formatEther(balance1));
    let call = await faucetContract.faucet(address);
    let balance2 = await ethers.provider.getBalance(address);
    console.log(address, "balance:", ethers.utils.formatEther(balance2));
  }

  console.log("Faucet deployed to:", faucetContract.address);
  const accounts = await ethers.getSigners();
  await accounts[0].sendTransaction({
    to: faucetContract.address,
    value: ethers.utils.parseEther("0.5"),
  });

  console.log("Funds sent to:", faucetContract.address);

  callFaucet(accounts[0].address);
  await sleep(1000);

  expect(faucetContract.faucet(accounts[0].address)).to.reverted;
  await sleep(1000);
  console.log("\n", "Two claim test passed");

  callFaucet(accounts[1].address);
  await sleep(1000);
  callFaucet(accounts[2].address);
  await sleep(1000);
  callFaucet(accounts[3].address);
  await sleep(1000);
  callFaucet(accounts[4].address);
  await sleep(1000);

  expect(faucetContract.faucet(accounts[5].address)).to.reverted;
  await sleep(1000);
  console.log("\n", "faucet test passed");

  let balance = await ethers.provider.getBalance(accounts[0].address);
  console.log("Owner balance:", ethers.utils.formatEther(balance));

  balance = await ethers.provider.getBalance(faucetContract.address);
  console.log("Faucet balance:", ethers.utils.formatEther(balance));

  expect(faucetContract.connect(accounts[1]).emptyFaucet(balance)).to.reverted;
  console.log("Non Owner Empty Test Passed");

  await faucetContract.emptyFaucet(balance);
  balance = await ethers.provider.getBalance(accounts[0].address);
  console.log("Owner balance:", ethers.utils.formatEther(balance));

  balance = await ethers.provider.getBalance(faucetContract.address);
  console.log("Faucet balance:", ethers.utils.formatEther(balance));
}

const runMain = async () => {
  try {
    await main();
    process.exit(0); // exit Node process without error
  } catch (error) {
    console.log(error);
    process.exit(1); // exit Node process while indicating 'Uncaught Fatal Exception' error
  }
  // Read more about Node exit ('process.exit(num)') status codes here: https://stackoverflow.com/a/47163396/7974948
};

runMain();
