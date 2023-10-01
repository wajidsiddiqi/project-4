//*Lottery
//*Enter the lottery (paying some amount)
//*Pick random 3 winner (verifiably random)
//*Winner to be selected after every X mins => completly automate
//*Chainlink Oracle => randomness, Automated execution (Chainlibk keepers)

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/AutomationCompatible.sol";

error Lottery__NotEnoughETHEntered();
error Lottery__TransferFailed();
error Lottery__NotOpen();
error Lottery__UpkeepNotNeeded(
    uint256 currentBalance,
    uint256 numPlayers,
    uint256 lotteryState
);
error Lottery__DuplicateWinner();

/*
 ? @title Lottery
 ? @author Wajid
 ? @notice this contract is for creating an untamperable decentralized smart contract
 ? @dev this implements chainlink VRF v2 and chainlink keepers
 */

contract Lottery is VRFConsumerBaseV2, AutomationCompatibleInterface {
    //*Type declarations
    enum LotteryState {
        OPEN,
        CALCULATING
    }

    //*State Variables
    uint256 private immutable i_entranceFee;
    address payable[] private s_players;
    VRFCoordinatorV2Interface private immutable i_vrfCoordinator;
    bytes32 private immutable i_gasLane;
    uint64 private immutable i_subscriptionId;
    uint32 private immutable i_callbackGasLimit;
    uint16 private constant REQUEST_CONFIRMATIONS = 3;
    uint32 private constant NUM_WORDS = 3;

    //*Lottery Variables
    address payable private s_goldWinner;
    address payable private s_silverWinner;
    address payable private s_bronzeWinner;
    LotteryState private s_lotteryState;
    uint256 private s_lastTimeStamp;
    uint256 private immutable i_interval;

    //*Events
    event LotteryEnter(address indexed player);
    event RequestedLotteryWinners(uint256 indexed requestId);
    event WinnerPicked(address payable indexed winners);

    //*Functions
    constructor(
        address vrfCoordinatorV2,
        uint256 entranceFee,
        bytes32 gasLane,
        uint64 subscriptionId,
        uint32 callbackGasLimit,
        uint256 interval
    ) VRFConsumerBaseV2(vrfCoordinatorV2) {
        i_entranceFee = entranceFee;
        i_vrfCoordinator = VRFCoordinatorV2Interface(vrfCoordinatorV2);
        i_gasLane = gasLane;
        i_subscriptionId = subscriptionId;
        i_callbackGasLimit = callbackGasLimit;
        s_lotteryState = LotteryState.OPEN;
        s_lastTimeStamp = block.timestamp;
        i_interval = interval;
    }

    function enterLottery() public payable {
        if (msg.value < i_entranceFee) {
            revert Lottery__NotEnoughETHEntered();
        }
        if (s_lotteryState != LotteryState.OPEN) {
            revert Lottery__NotOpen();
        }
        s_players.push(payable(msg.sender));
        emit LotteryEnter(msg.sender);
    }

    /*
     ? @dev this is the function that the chainlink keeper nodes call
     ? they look for the "upkeepNeeded" to return true
     ? The following should be true in order to return true: 
     ? 1. Our time interval should have passed
     ? 2. The Lottery should have at least three player, and have some ETH 
     ? 3. Our subscription is funded with Link
     ? 4. The Lottery should be in an "open" state 
     */

    function checkUpkeep(
        bytes memory /* checkData */
    )
        public
        override
        returns (bool upkeepNeeded, bytes memory /* performData */)
    {
        bool isOpen = (LotteryState.OPEN == s_lotteryState);
        bool timePassed = ((block.timestamp - s_lastTimeStamp) > i_interval);
        bool hasPlayers = (s_players.length >= 3);
        bool hasBalance = address(this).balance > 0;
        upkeepNeeded = (isOpen && timePassed && hasPlayers && hasBalance);
    }

    function performUpkeep(bytes calldata /* performData */) external override {
        (bool upkeepNeeded, ) = checkUpkeep("");
        if (!upkeepNeeded) {
            revert Lottery__UpkeepNotNeeded(
                address(this).balance,
                s_players.length,
                uint256(s_lotteryState)
            );
        }

        s_lotteryState = LotteryState.CALCULATING;
        uint256 requestId = i_vrfCoordinator.requestRandomWords(
            i_gasLane,
            i_subscriptionId,
            REQUEST_CONFIRMATIONS,
            i_callbackGasLimit,
            NUM_WORDS
        );
        emit RequestedLotteryWinners(requestId);
    }

    function fulfillRandomWords(
        uint256 /*requestId,*/,
        uint256[] memory randomWords
    ) internal override {
        uint256[] memory winningIndexes = new uint256[](3);
        address payable[] memory players = s_players; // saving s_players array in memory cos of gas efficiency

        // Generate three unique random numbers for winners
        for (uint256 i = 0; i < 3; i++) {
            uint256 randomIndex = randomWords[i] % players.length;

            // Store the unique random index
            winningIndexes[i] = randomIndex;
        }

        s_goldWinner = players[winningIndexes[0]];
        s_silverWinner = players[winningIndexes[1]];
        s_bronzeWinner = players[winningIndexes[2]];

        s_lotteryState = LotteryState.OPEN;
        s_players = new address payable[](0);
        s_lastTimeStamp = block.timestamp;

        // Transfer rewards to winners
        distributeLottery();

        emit WinnerPicked(s_goldWinner);
        emit WinnerPicked(s_silverWinner);
        emit WinnerPicked(s_bronzeWinner);
    }

    function distributeLottery() internal {
        // Calculate prize amounts
        uint256 totalPrize = address(this).balance;
        uint256 goldPrize = (totalPrize * 50) / 100; // 50%
        uint256 silverPrize = (totalPrize * 30) / 100; // 30%
        uint256 bronzePrize = (totalPrize * 20) / 100; // 20%

        // Transfer prizes to winners
        require(s_goldWinner.send(goldPrize), "Gold transfer failed");
        require(s_silverWinner.send(silverPrize), "Silver transfer failed");
        require(s_bronzeWinner.send(bronzePrize), "Bronze transfer failed");
    }

    //*View Functions
    function getEntranceFee() public view returns (uint256) {
        return i_entranceFee;
    }

    function getPlayers(uint256 index) public view returns (address) {
        return s_players[index];
    }

    function getGoldWinner() public view returns (address) {
        return s_goldWinner;
    }

    function getSilverWinner() public view returns (address) {
        return s_silverWinner;
    }

    function getBronzeWinner() public view returns (address) {
        return s_bronzeWinner;
    }

    function getLotteryState() public view returns (LotteryState) {
        return s_lotteryState;
    }

    function getNumWords() public pure returns (uint32) {
        return NUM_WORDS;
    }

    function getNumberOfPlayers() public view returns (uint256) {
        return s_players.length;
    }

    function getLatestTimeStamp() public view returns (uint256) {
        return s_lastTimeStamp;
    }

    function getRequestConfirmations() public pure returns (uint256) {
        return REQUEST_CONFIRMATIONS;
    }

    function getInterval() public view returns (uint256) {
        return i_interval;
    }
}
