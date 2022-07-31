const hre = require("hardhat");

async function main() {
  const joeFactory = await hre.ethers.getContractFactory("JoeToken");
  const joeContract = await joeFactory.deploy();

  await joeContract.deployed();

  console.log("JOE deployed to:", joeContract.address);
  console.log("JOE Address:", joeContract.address);
  console.log(
    "JOE Supply:",
    ethers.utils.formatEther(await joeContract.totalSupply())
  );
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
