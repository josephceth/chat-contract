async function main() {
  const chatLogFactory = await hre.ethers.getContractFactory("ChatLog");
  const chatContract = await chatLogFactory.deploy();

  await chatContract.deployed();

  console.log("Chat Log deployed to:", chatContract.address);

  const accounts = await ethers.getSigners();
  const chatTx = await chatContract.sendMessage(
    accounts[1].address,
    "Hello World 1!"
  );
  await chatTx.wait();
  console.log("Message sent to:", accounts[1].address);

  const chatTx2 = await chatContract.sendMessage(
    accounts[2].address,
    "Hello World 2!"
  );
  await chatTx2.wait();

  const chatTx3 = await chatContract.sendMessage(
    accounts[2].address,
    "Hello World 2-2!"
  );
  await chatTx3.wait();

  const chatLog = await chatContract.getMessages(
    accounts[0].address,
    accounts[1].address
  );
  console.log(chatLog);

  const chatLog2 = await chatContract.getMessages(
    accounts[0].address,
    accounts[2].address
  );
  console.log(chatLog2);
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
