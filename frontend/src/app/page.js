"use client";
import React from "react";
import Header from "./components/Header";
import {
  Center,
  PageWrapper,
  Box,
  ChildContainer,
  Icon,
  ParaMid,
  StyledButton,
} from "./styles/styles";

export default function Home() {
  return (
    <React.Fragment>
      <Header />
      <PageWrapper>
        <Center>
          <Box>
            <ChildContainer>
              <Icon>Gold</Icon>
              <ParaMid>Gold Winner:</ParaMid>
              <ParaMid>0x00000000</ParaMid>
            </ChildContainer>
            <ChildContainer>
              <Icon>Silver</Icon>
              <ParaMid>Silver Winner:</ParaMid>
              <ParaMid>0x00000000</ParaMid>
            </ChildContainer>
            <ChildContainer>
              <Icon>Bronze</Icon>
              <ParaMid>Bronze Winner:</ParaMid>
              <ParaMid>0x00000000</ParaMid>
            </ChildContainer>
            <StyledButton>Enter Lotter</StyledButton>
          </Box>
        </Center>
      </PageWrapper>
    </React.Fragment>
  );
}
