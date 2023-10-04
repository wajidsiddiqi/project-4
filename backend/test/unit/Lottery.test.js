const { network, getNamedAccounts, deployments, ethers } = require("hardhat");
const {
  developmentChains,
  networkConfig,
} = require("../../helper-hardhat-config");
const { assert, expect } = require("chai");

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("Lottery unit test", () => {
      let lottery, vrfCoordinator, lotteryEntranceFee, deployer, interval;
      const chainId = network.config.chainId;

      beforeEach(async () => {
        deployer = (await getNamedAccounts()).deployer;
        await deployments.fixture(["all"]);
        lottery = await ethers.getContract("Lottery", deployer);
        vrfCoordinator = await ethers.getContract(
          "VRFCoordinatorV2Mock",
          deployer
        );
        lotteryEntranceFee = await lottery.getEntranceFee();
        interval = await lottery.getInterval();
      });

      describe("constructor", () => {
        it("Initializes the lottery correctly", async () => {
          const lotteryState = await lottery.getLotteryState();
          assert.equal(lotteryState.toString(), "0");
          assert.equal(interval.toString(), networkConfig[chainId]["interval"]);
        });
      });

      describe("enterLottery", () => {
        it("reverts when you don't pay enough", async () => {
          await expect(lottery.enterLottery()).to.be.revertedWithCustomError(
            lottery,
            "Lottery__NotEnoughETHEntered"
          );
        });

        it("adds players when they enter", async () => {
          await lottery.enterLottery({ value: lotteryEntranceFee });
          const playerFromContract = await lottery.getPlayers(0);
          assert.equal(playerFromContract, deployer);
        });

        it("emits event on entrance", async () => {
          await expect(
            lottery.enterLottery({ value: lotteryEntranceFee })
          ).to.emit(lottery, "LotteryEnter");
        });

        it("doesn't allow entrance when lottery is calculating", async () => {
          for (let i = 0; i < 3; i++) {
            await lottery.enterLottery({ value: lotteryEntranceFee });
          }
          // for a documentation of the methods below, go here: https://hardhat.org/hardhat-network/reference
          await network.provider.send("evm_increaseTime", [
            interval.toNumber() + 1,
          ]);
          await network.provider.request({ method: "evm_mine", params: [] });
          // we pretend to be a keeper for a second
          await lottery.performUpkeep([]); // changes the state to calculating for our comparison below
          await expect(
            lottery.enterLottery({ value: lotteryEntranceFee })
          ).to.be.revertedWithCustomError(
            // is reverted as lottery is calculating
            lottery,
            "Lottery__NotOpen"
          );
        });
      });

      describe("checkUpkeep", () => {
        it("returns false if people haven't sent any ETH", async () => {
          await network.provider.send("evm_increaseTime", [
            interval.toNumber() + 1,
          ]);
          await network.provider.send("evm_mine", []);
          const { upkeepNeeded } = await lottery.callStatic.checkUpkeep([]);
          assert(!upkeepNeeded);
        });

        it("returns false if enough people haven't entered", async () => {
          for (let i = 0; i < 2; i++) {
            await lottery.enterLottery({ value: lotteryEntranceFee });
          }
          await network.provider.send("evm_increaseTime", [
            interval.toNumber() + 1,
          ]);
          await network.provider.send("evm_mine", []);
          const { upkeepNeeded } = await lottery.callStatic.checkUpkeep([]);
          assert(!upkeepNeeded);
        });

        it("returns false if lottery is not in open state", async () => {
          for (let i = 0; i < 3; i++) {
            await lottery.enterLottery({ value: lotteryEntranceFee });
          }
          await network.provider.send("evm_increaseTime", [
            interval.toNumber() + 1,
          ]);
          await network.provider.send("evm_mine", []);
          await lottery.performUpkeep([]);
          const lotteryState = await lottery.getLotteryState();
          const { upkeepNeeded } = await lottery.callStatic.checkUpkeep([]);
          assert.equal(lotteryState.toString(), "1");
          assert.equal(upkeepNeeded, false);
        });

        it("returns false if enough time hasn't passed", async () => {
          for (let i = 0; i < 3; i++) {
            await lottery.enterLottery({ value: lotteryEntranceFee });
          }
          await network.provider.send("evm_increaseTime", [
            interval.toNumber() - 5,
          ]);
          await network.provider.send("evm_mine", []);
          const { upkeepNeeded } = await lottery.callStatic.checkUpkeep([]);
          assert(!upkeepNeeded);
        });

        it("returns true if enough time has passed, have players, eth, and is open", async () => {
          for (let i = 0; i < 3; i++) {
            await lottery.enterLottery({ value: lotteryEntranceFee });
          }
          await network.provider.send("evm_increaseTime", [
            interval.toNumber() + 1,
          ]);
          await network.provider.send("evm_mine", []);
          const { upkeepNeeded } = await lottery.callStatic.checkUpkeep([]);
          assert(upkeepNeeded);
        });
      });

      describe("performUpkeep", () => {
        it("can only run if checkUpkeep is true", async () => {
          for (let i = 0; i < 3; i++) {
            await lottery.enterLottery({ value: lotteryEntranceFee });
          }
          await network.provider.send("evm_increaseTime", [
            interval.toNumber() + 1,
          ]);
          await network.provider.send("evm_mine", []);
          const tx = await lottery.performUpkeep([]);
          assert(tx);
        });

        it("reverts when checkUpkeep is false", async () => {
          await expect(lottery.performUpkeep([])).to.be.revertedWithCustomError(
            lottery,
            "Lottery__UpkeepNotNeeded"
          );
        });

        it("updates the lottery state, emits an event and calls the vrfCoordinator", async () => {
          for (let i = 0; i < 3; i++) {
            await lottery.enterLottery({ value: lotteryEntranceFee });
          }
          await network.provider.send("evm_increaseTime", [
            interval.toNumber() + 1,
          ]);
          await network.provider.send("evm_mine", []);
          const txResponse = await lottery.performUpkeep([]);
          const txReceipt = await txResponse.wait(1);
          const requestId = await txReceipt.events[1].args.requestId;
          const lotteryState = await lottery.getLotteryState();
          assert(requestId.toNumber() > 0);
          assert(lotteryState.toString() == "1");
        });
      });

      describe("fulfillRandomWords", () => {
        it("can only be called after performUpkeep", async () => {
          for (let i = 0; i < 3; i++) {
            await lottery.enterLottery({ value: lotteryEntranceFee });
          }
          await network.provider.send("evm_increaseTime", [
            interval.toNumber() + 1,
          ]);
          await network.provider.send("evm_mine", []);
          await expect(
            vrfCoordinator.fulfillRandomWords(0, lottery.address)
          ).to.be.revertedWith("nonexistent request");
          await expect(
            vrfCoordinator.fulfillRandomWords(1, lottery.address)
          ).to.be.revertedWith("nonexistent request");
        });

        it("picks three winners, fire events, resets, and sends money", async () => {
          const beginning = await lottery.getLatestTimeStamp();
          // Declare variables to store winner data
          let goldWinnerData;
          let silverWinnerData;
          let bronzeWinnerData;

          // Enter some players into the lottery.
          const accounts = await ethers.getSigners();
          for (let i = 0; i < 3; i++) {
            await lottery
              .connect(accounts[i])
              .enterLottery({ value: lotteryEntranceFee });
          }
          await network.provider.send("evm_increaseTime", [
            interval.toNumber() + 1,
          ]);
          await network.provider.send("evm_mine", []);
          const tx = await lottery.performUpkeep([]);
          const txReceipt = await tx.wait(1);
          await vrfCoordinator.fulfillRandomWords(
            txReceipt.events[1].args.requestId,
            lottery.address
          );

          // Define the event names you want to listen for
          const goldEventName = "GoldWinnerPicked";
          const silverEventName = "SilverWinnerPicked";
          const bronzeEventName = "BronzeWinnerPicked";

          // Define async functions to listen for events
          async function listenForGoldEvent() {
            await new Promise((resolve) => {
              lottery.on(goldEventName, (data) => {
                // Store the gold winner data
                goldWinnerData = data;
                console.log("GoldWinnerPicked event:", goldWinnerData);
                resolve();
              });
            });
          }

          async function listenForSilverEvent() {
            await new Promise((resolve) => {
              lottery.on(silverEventName, (data) => {
                // Store the silver winner data
                silverWinnerData = data;
                console.log("SilverWinnerPicked event:", silverWinnerData);
                resolve();
              });
            });
          }

          async function listenForBronzeEvent() {
            await new Promise((resolve) => {
              lottery.on(bronzeEventName, (data) => {
                // Store the bronze winner data
                bronzeWinnerData = data;
                console.log("BronzeWinnerPicked event:", bronzeWinnerData);
                resolve();
              });
            });
          }

          // Use Promise.all to start listening for all events concurrently
          await Promise.all([
            listenForGoldEvent(),
            listenForSilverEvent(),
            listenForBronzeEvent(),
          ]);

          // Now that all event listeners have completed, you can perform your checks.
          // Check that the lottery state and players array were reset & check time.
          const lotteryState = await lottery.getLotteryState();
          const numberOfPlayers = await lottery.getNumberOfPlayers();
          const ending = await lottery.getLatestTimeStamp();
          assert(lotteryState.toString() == "0");
          assert(numberOfPlayers.toString() == "0");
          assert(ending > beginning);

          // Check winners are picked
          assert.equal(await lottery.getGoldWinner(), goldWinnerData);
          assert.equal(await lottery.getSilverWinner(), silverWinnerData);
          assert.equal(await lottery.getBronzeWinner(), bronzeWinnerData);

          // Check that the winners were paid.
          const balance = await ethers.provider.getBalance(lottery.address);
          assert(balance.toString() == "0");
        });
      });
    });
