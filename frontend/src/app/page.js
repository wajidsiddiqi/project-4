"use client";
import Image from "next/image";
import { LogoText } from "@/app/styles/styles";
import {
  Navbar,
  NavbarContent,
  NavbarItem,
  Button,
  NavbarBrand,
} from "@nextui-org/react";
import { ConnectKitButton } from "connectkit";

export default function Home() {
  return (
    <Navbar position="static">
      <NavbarBrand>
        <LogoText>Decentralized Lottery</LogoText>
      </NavbarBrand>
      <NavbarContent justify="end">
        <NavbarItem>
          <ConnectKitButton.Custom>
            {({ show, isConnected }) => {
              return (
                <Button onClick={show} color="primary" variant="flat">
                  {isConnected ? "Disconnect" : "Connect"}
                </Button>
              );
            }}
          </ConnectKitButton.Custom>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
