//*Lottery
//*Enter the lottery (paying some amount)
//*Pick a random winner (verifiably random)
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

/*
 ? @title A sample Lottery Contract
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
    uint32 private constant NUM_WORDS = 1;
    uint256 private constant NUM_WINNERS = 3;

    //*Lottery Variables
    address[] private s_recentWinners;
    LotteryState private s_lotteryState;
    uint256 private s_lastTimeStamp;
    uint256 private immutable i_interval;

    //*Events
    event LotteryEnter(address indexed player);
    event RequestedLotteryWinner(uint256 indexed requestId);
    event WinnersPicked(address[] indexed winners);

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
     ? 2. The Lottery should have at least one player, and have some ETH 
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
        bool hasPlayers = (s_players.length > 0);
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
        emit RequestedLotteryWinner(requestId);
    }

    function fulfillRandomWords(
        uint256 /*requestId,*/,
        uint256[] memory randomWords
    ) internal override {
        require(
            s_players.length >= NUM_WINNERS,
            "Not enough players for winners"
        );

        address payable[] memory winners = new address payable[](NUM_WINNERS);
        bool[] memory usedIndices = new bool[](s_players.length); // Use s_players.length to match the number of players

        for (uint8 i = 0; i < NUM_WINNERS; i++) {
            uint256 randomIndex;
            do {
                randomIndex = randomWords[i] % s_players.length;
            } while (usedIndices[randomIndex]);

            winners[i] = s_players[randomIndex];
            usedIndices[randomIndex] = true;
        }

        s_recentWinners = winners;
        s_lotteryState = LotteryState.OPEN;
        s_players = new address payable[](0);
        s_lastTimeStamp = block.timestamp;

        for (uint8 i = 0; i < NUM_WINNERS; i++) {
            (bool success, ) = winners[i].call{
                value: address(this).balance / NUM_WINNERS
            }("");
            if (!success) {
                revert Lottery__TransferFailed();
            }
        }

        emit WinnersPicked(winners);
    }

    //*View Functions
    function getEntranceFee() public view returns (uint256) {
        return i_entranceFee;
    }

    function getPlayers(uint256 index) public view returns (address) {
        return s_players[index];
    }

    function getLotteryState() public view returns (LotteryState) {
        return s_lotteryState;
    }

    function getNumWords() public pure returns (uint56) {
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

    function getRecentWinners() public view returns (address[] memory) {
        return s_recentWinners;
    }

    function getNumWinners() public pure returns (uint8) {
        return NUM_WINNERS;
    }
}
