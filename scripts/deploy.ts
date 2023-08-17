import { ethers } from "hardhat";

async function main() {
  const signers = await ethers.getSigners();
  const [deployer] = await ethers.getSigners();

  const MessageBoard = await ethers.getContractFactory("MessageBoard");
  const messageBoard = await MessageBoard.connect(deployer).deploy();
  await messageBoard.waitForDeployment();
  console.log(`MessageBoard deploy successful! Contract address ${await messageBoard.getAddress()}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
