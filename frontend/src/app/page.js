"use client";
import React from "react";
import Image from "next/image";
import Header from "./components/Header";
import {
  Center,
  PageWrapper,
  Box,
  ChildContainer,
  Icon,
  ParaMid,
  StyledButton,
  ParaSm,
} from "./styles/styles";

export default function Home() {
  return (
    <React.Fragment>
      <Header />
      <PageWrapper>
        <Center>
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
              <Center style={{ alignItems: "baseline", gap: "0.2rem" }}>
                <Center>
                  <ParaMid>Gold Winner:</ParaMid>
                </Center>
                <Center>
                  <ParaSm>0x00000000</ParaSm>
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
              <Center style={{ alignItems: "baseline", gap: "0.2rem" }}>
                <Center>
                  <ParaMid>Silver Winner:</ParaMid>
                </Center>
                <Center>
                  <ParaSm>0x00000000</ParaSm>
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
              <Center style={{ alignItems: "baseline", gap: "0.2rem" }}>
                <Center>
                  <ParaMid>Bronze Winner:</ParaMid>
                </Center>
                <Center>
                  <ParaSm>0x00000000</ParaSm>
                </Center>
              </Center>
            </ChildContainer>
            <StyledButton style={{ marginTop: "7px" }}>
              Enter Lotter
            </StyledButton>
          </Box>
        </Center>
      </PageWrapper>
    </React.Fragment>
  );
}
