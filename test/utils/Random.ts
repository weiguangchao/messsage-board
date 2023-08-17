import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("utils/Random", function () {
  it("Generate unique bytes32", async function () {
    const [owner, otherAccount] = await ethers.getSigners();
    const Random = await ethers.getContractFactory("Random");
    const random = await Random.deploy();

    const str = await random.generateUniqueBytes32("hello hello!");
    console.log(str);
  });
});
