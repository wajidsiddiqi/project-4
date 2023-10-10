"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Header from "./components/Header";
import EnterLottery from "./components/EnterLottery";
import {
  BronzeWinner,
  GoldWinner,
  SilverWinner,
} from "./components/getterFuntions";
import {
  Center,
  PageWrapper,
  Box,
  ChildContainer,
  Icon,
  ParaMid,
  ParaSm,
} from "./styles/styles";

export default function Home() {
  const [goldWinner, setGoldWinner] = useState("0x000");
  const [silverWinner, setSilverWinner] = useState("0x000");
  const [bronzeWinner, setBronzeWinner] = useState("0x000");

  const AddressSlice = (result) => {
    return `${result.slice(0, 6)}...${result.slice(result.length - 4)}`;
  };

  useEffect(() => {
    // Fetch the getter functions when the component mounts
    GoldWinner()
      .then((result) => {
        setGoldWinner(AddressSlice(result));
      })
      .catch((error) => {
        console.error("Error fetching total supply:", error);
      });

    SilverWinner()
      .then((result) => {
        setSilverWinner(AddressSlice(result));
      })
      .catch((error) => {
        console.error("Error fetching total supply:", error);
      });

    BronzeWinner()
      .then((result) => {
        setBronzeWinner(AddressSlice(result));
      })
      .catch((error) => {
        console.error("Error fetching total supply:", error);
      });
  }, []); // Empty dependency array to run once on mount*/

  return (
    <React.Fragment>
      <Header />
      <PageWrapper>
        <Center style={{ height: "100vh" }}>
          <Box>
            <ChildContainer>
              <Icon>
                <Image
                  src="/assets/icons/gold.svg"
                  width="40"
                  height="40"
                  alt="Gold"
                />
              </Icon>
              <Center style={{ alignItems: "end", gap: "0.4rem" }}>
                <Center>
                  <ParaMid>Gold Winner:</ParaMid>
                </Center>
                <Center>
                  <ParaSm>{goldWinner}</ParaSm>
                </Center>
              </Center>
            </ChildContainer>
            <ChildContainer>
              <Icon>
                <Image
                  src="/assets/icons/silver.svg"
                  width="40"
                  height="40"
                  alt="Silver"
                />
              </Icon>
              <Center style={{ alignItems: "end", gap: "0.4rem" }}>
                <Center>
                  <ParaMid>Silver Winner:</ParaMid>
                </Center>
                <Center>
                  <ParaSm>{silverWinner}</ParaSm>
                </Center>
              </Center>
            </ChildContainer>
            <ChildContainer>
              <Icon>
                <Image
                  src="/assets/icons/bronze.svg"
                  width="40"
                  height="40"
                  alt="Bronze"
                />
              </Icon>
              <Center style={{ alignItems: "end", gap: "0.4rem" }}>
                <Center>
                  <ParaMid>Bronze Winner:</ParaMid>
                </Center>
                <Center>
                  <ParaSm>{bronzeWinner}</ParaSm>
                </Center>
              </Center>
            </ChildContainer>
            <EnterLottery />
          </Box>
        </Center>
      </PageWrapper>
    </React.Fragment>
  );
}
