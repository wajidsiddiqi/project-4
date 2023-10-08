"use client";
import React from "react";
import { ConnectKitButton } from "connectkit";
import NextLink from "next/link";

import {
  CenterSpaceBetween,
  MaxWidth,
  StyledConnectButton,
  StyledNav,
  HeaderBtn,
  NavBarContainer,
  LogoText,
} from "@/app/styles/styles.js";

export default function Header() {
  return (
    <StyledNav>
      <MaxWidth style={{ margin: "auto" }}>
        <CenterSpaceBetween>
          <NextLink href="/" style={{ textDecoration: "none" }}>
            <LogoText>Decentralized Lottery</LogoText>
          </NextLink>
          <NavBarContainer>
            <HeaderBtn>
              <ConnectKitButton.Custom>
                {({ show, isConnected }) => {
                  return (
                    <StyledConnectButton onClick={show}>
                      {isConnected ? "Disconnect" : "Connect"}
                    </StyledConnectButton>
                  );
                }}
              </ConnectKitButton.Custom>
            </HeaderBtn>
          </NavBarContainer>
        </CenterSpaceBetween>
      </MaxWidth>
    </StyledNav>
  );
}
