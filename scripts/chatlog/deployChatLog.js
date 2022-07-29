const hre = require("hardhat");

async function main() {
  const chatLogFactory = await hre.ethers.getContractFactory("ChatLog");
  const chatContract = await chatLogFactory.deploy();

  await chatContract.deployed();

  console.log("Chat Log deployed to:", chatContract.address);
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
