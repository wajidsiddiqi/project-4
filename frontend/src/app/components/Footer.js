"use client";
import Image from "next/image";
import {
  Center,
  FooterPara,
  StyledFooter,
  MaxWidth,
} from "@/app/styles/styles.js";

export default function Footer() {
  return (
    <StyledFooter>
      <MaxWidth style={{ margin: "auto" }}>
        <Center style={{ gap: "1rem" }}>
          <Center>
            <FooterPara>Developed with love by Wajid © 2023</FooterPara>
          </Center>

          <Center>
            <a href="https://twitter.com/abdulwajidsid" target="_blank">
              <Image
                src="/assets/icons/twitter.svg"
                width="36"
                height="36"
                alt="Twitter"
              />
            </a>
          </Center>
        </Center>
      </MaxWidth>
    </StyledFooter>
  );
}
