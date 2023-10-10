import React, { useEffect, useState } from "react";
import Image from "next/image";
import { ethers } from "ethers";
import {
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
  useAccount,
} from "wagmi";
import { ConnectKitButton } from "connectkit";
import {
  StyledButton,
  StyledConnectButton,
  Modal,
  Modal2,
  ErrorMsg,
  ErrorContainer,
  CloseIcon,
  SuccessContainer,
  SuccessMsg,
} from "@/app/styles/styles.js";
import Contract from "../Lottery.json";

const entranceFee = ethers.parseEther("0.01");

export default function EnterLottery() {
  const { isConnected } = useAccount();
  const [isErrorSeen, setIsErrorSeen] = useState(false);
  const [isSucSeen, setIsSucSeen] = useState(false);

  const {
    config,
    error: prepareError,
    isError: isPrepareError,
  } = usePrepareContractWrite({
    address: Contract.address,
    abi: Contract.abi,
    functionName: "enterLottery",
    value: BigInt(entranceFee.toString()),
  });

  const { data, error, isError, write } = useContractWrite(config);
  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  useEffect(() => {
    if (isPrepareError || isError) {
      setIsErrorSeen(true);
    }

    if (isSuccess) {
      setIsSucSeen(true);
    }
  }, [isPrepareError, isError, isSuccess]);

  function handleError(error) {
    if (error) {
      const errorMsg = error?.message;
      if (errorMsg.includes("InsufficientFundsError")) {
        return "Insufficient funds to perform this operation.";
      } else {
        const errorLines = errorMsg.split("\n");
        let output = "";
        for (let i = 0; i < errorLines.length; i++) {
          if (errorLines[i].startsWith("Contract Call")) {
            break;
          }
          output += errorLines[i] + "\n";
        }
        return output;
      }
    } else {
      console.error(error);
      return "An error occurred while executing the contract function.";
    }
  }

  return (
    <React.Fragment>
      {isConnected ? (
        <StyledButton
          disabled={!write || isLoading}
          onClick={write}
          color="opp"
          style={{ marginTop: "10px" }}
        >
          {isLoading ? (
            <Image
              src="/assets/icons/dot_loader.svg"
              width="36"
              height="36"
              alt="loading"
            />
          ) : (
            "Enter Lottery"
          )}
        </StyledButton>
      ) : (
        <ConnectKitButton.Custom>
          {({ show }) => {
            return (
              <StyledConnectButton
                color="opp"
                style={{ marginTop: "10px" }}
                onClick={show}
              >
                Enter Lottery
              </StyledConnectButton>
            );
          }}
        </ConnectKitButton.Custom>
      )}

      {(isPrepareError || isError) && (
        <Modal $isErrorSeen={isErrorSeen}>
          <ErrorContainer $isErrorSeen={isErrorSeen}>
            <ErrorMsg>
              <CloseIcon onClick={() => setIsErrorSeen(false)}>X</CloseIcon>
              {handleError(prepareError || error)}
            </ErrorMsg>
          </ErrorContainer>
        </Modal>
      )}

      {isSuccess && (
        <Modal2 $isSucSeen={isSucSeen}>
          <SuccessContainer $isSucSeen={isSucSeen}>
            <SuccessMsg>
              <CloseIcon onClick={() => setIsSucSeen(false)}>X</CloseIcon>
              You have successfully entered the lottery!
              <br />
              View transition on{" "}
              <a
                href={`https://sepolia.etherscan.io/tx/${data?.hash}`}
                target="_blank"
                style={{
                  textDecoration: "none",
                  color: "#21325b",
                }}
              >
                Etherscan
              </a>
            </SuccessMsg>
          </SuccessContainer>
        </Modal2>
      )}
    </React.Fragment>
  );
}
