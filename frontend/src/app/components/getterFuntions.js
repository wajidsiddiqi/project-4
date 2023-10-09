import { readContracts } from "wagmi";
import { ethers } from "ethers";
import Contract from "../Lottery.json";

const EntranceFee = async () => {
  const getEntranceFee = await readContracts({
    contracts: [
      {
        address: Contract.address,
        abi: Contract.abi,
        functionName: "getEntranceFee",
      },
    ],
  });

  if (getEntranceFee[0].status === "success") {
    return ethers.formatEther(getEntranceFee[0].result).toString();
  } else {
    const error = getTotalSupply[0].error;
    console.error("Error:", error);
  }
};

const GoldWinner = async () => {
  const getGoldWinner = await readContracts({
    contracts: [
      {
        address: Contract.address,
        abi: Contract.abi,
        functionName: "getGoldWinner",
      },
    ],
  });

  if (getGoldWinner[0].status === "success") {
    return getGoldWinner[0].result.toString();
  } else {
    const error = getGoldWinner[0].error;
    console.error("Error:", error);
  }
};

const SilverWinner = async () => {
  const getSilverWinner = await readContracts({
    contracts: [
      {
        address: Contract.address,
        abi: Contract.abi,
        functionName: "getSilverWinner",
      },
    ],
  });

  if (getSilverWinner[0].status === "success") {
    return getSilverWinner[0].result.toString();
  } else {
    const error = getSilverWinner[0].error;
    console.error("Error:", error);
  }
};

const BronzeWinner = async () => {
  const getBronzeWinner = await readContracts({
    contracts: [
      {
        address: Contract.address,
        abi: Contract.abi,
        functionName: "getBronzeWinner",
      },
    ],
  });

  if (getBronzeWinner[0].status === "success") {
    return getBronzeWinner[0].result.toString();
  } else {
    const error = getBronzeWinner[0].error;
    console.error("Error:", error);
  }
};

export { EntranceFee, GoldWinner, SilverWinner, BronzeWinner };
