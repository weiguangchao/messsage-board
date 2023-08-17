import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { toUtf8Bytes } from 'ethers/src.ts/utils/utf8';
import { ethers } from "hardhat";

describe("MessageBoard", function () {
  let messageBoard: any;
  let owner: any;
  let otherAccount: any;

  beforeEach(async () => {
    const [_owner, _otherAccount] = await ethers.getSigners();
    owner = _owner;
    otherAccount = _otherAccount;

    const MessageBoard = await ethers.getContractFactory("MessageBoard");
    messageBoard = await MessageBoard.deploy();
  });

  it("Submit message", async function () {
    // get key
    const content = ethers.toUtf8Bytes("hello hello!");
    const key = ethers.keccak256(ethers.toUtf8Bytes(new Date().getTime().toString()));

    // use owner to submit
    const tx = await messageBoard.connect(owner).submitMessage(key, content);

    await expect(tx).emit(messageBoard, "OnBoard").withArgs(content);
  });

  it("Submit message use other account", async function () {
    // get key
    const content = ethers.toUtf8Bytes("hello hello!");
    const key = ethers.keccak256(ethers.toUtf8Bytes(new Date().getTime().toString()));

    await expect(
      messageBoard
        .connect(otherAccount)
        .submitMessage(key, content)
    ).to.be.revertedWith("Ownable: caller is not the owner");
  });

  it("Repeat submit message", async function () {
    // get key
    const content = ethers.toUtf8Bytes("hello hello!");
    const key = ethers.keccak256(ethers.toUtf8Bytes(new Date().getTime().toString()));

    // first submit
    await messageBoard
      .connect(owner)
      .submitMessage(key, content);

    // use owner to deploy
    for (let i = 0, len = 10; i < len; i++) {
      await expect(
        messageBoard
          .connect(owner)
          .submitMessage(key, content)
      ).to.revertedWith("Message key repeat!");
    }

  });

  it("Submit message with empty content", async function () {
    // get key
    const content = ethers.toUtf8Bytes("");
    const key = ethers.keccak256(ethers.toUtf8Bytes(new Date().getTime().toString()));

    await expect(
      messageBoard
        .connect(owner)
        .submitMessage(key, content)
    ).to.revertedWith("Message is empty!");
  });

  it("Get Message by key", async function () {
    // get key
    const content = ethers.toUtf8Bytes("hello hello!");
    const key = ethers.keccak256(ethers.toUtf8Bytes(new Date().getTime().toString()));

    // use owner to submit
    const tx = await messageBoard.connect(owner).submitMessage(key, content);
    await expect(tx).emit(messageBoard, "OnBoard").withArgs(content);

    const value = await messageBoard.connect(owner).getMessageByKey(key);
    expect(value).to.equal(ethers.hexlify(value));
  });

  it("Transfer with receive", async function () {
    const amount = ethers.parseEther('1.0');
    const info = {
      to: messageBoard.getAddress(),
      value: amount // 将以太币数量转换为 wei 单位
    };
    await owner.sendTransaction(info);
    const tx = await messageBoard.connect(owner).getBalance();

    expect(tx).to.eq(amount);
    expect(tx).emit(messageBoard, "Received").withArgs(owner.getAddress(), amount);
  });
  it("Withdraw eth", async function () {
    // first, transfer eth to contract
    const amount = ethers.parseEther('1.0');
    const info = {
      to: messageBoard.getAddress(),
      value: amount // 将以太币数量转换为 wei 单位
    };
    await owner.sendTransaction(info);

    let tx = await messageBoard.connect(owner).getBalance();
    expect(tx).to.eq(amount);
    expect(tx).emit(messageBoard, "Received").withArgs(owner.getAddress(), amount);

    tx = await messageBoard.connect(owner).withdraw();
    expect(tx).emit(messageBoard, "Withdraw").withArgs(owner.getAddress(), amount);

    tx = await messageBoard.connect(owner).getBalance();
    expect(tx).to.eq(0n);
  });
});

