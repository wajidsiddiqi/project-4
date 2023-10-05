import styled from "styled-components";

//!Colors
const DarkYellow = "#ffaa00";
const LightYellow = "#fbf8ef";
const DarkBrown = "#18120b";
const Gray = "#18160fc4";

const MaxWidth = styled.div`
  max-width: 1600px;
  width: 100%;
  margin: auto;
`;

const LogoText = styled.h1`
  font-size: 1.5rem;
  font-weight: 800;
  color: ${DarkYellow};
`;

//!Wrappers Styles
const MainPageWrapper = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
`;

const PageWrapperDark = styled(MainPageWrapper)`
  background-color: ${DarkYellow};
`;

//!Heading Styles
const MainH1Title = styled.h1`
  color: ${LightYellow};
  font-size: 8rem;
  /* text-transform: uppercase; */
  font-weight: 900;
  display: inline;
  background-image: linear-gradient(#fff0 60%, ${DarkYellow} 55%);
  background-size: 100% 100%;
  background-size: 8% 86%;

  @media (max-width: 1265px) {
    font-size: 6rem;
  }

  @media (max-width: 592px) {
    font-size: 4rem;
  }

  @media (max-width: 355px) {
    font-size: 3.4rem;
  }
`;

//!Paragraph Styles
const ParaBig = styled.p`
  color: ${LightYellow};
  font-size: 1.5rem;
  line-height: 1;
  font-weight: 300;

  @media (max-width: 1265px) {
    font-size: 1.3rem;
  }

  @media (max-width: 1050px) {
    text-align: center;
  }

  @media (max-width: 592px) {
    font-size: 1.1rem;
  }
`;

const ParaMid = styled(ParaBig)`
  font-size: 1.2rem;
  color: ${DarkBrown};
  font-weight: 700;

  @media (max-width: 592px) {
    font-size: 1rem;
  }
`;

const ParaSm = styled(ParaMid)`
  font-size: 1rem;
  font-weight: 500;
  color: ${Gray};
`;

//!Containers & Boxes
const Center = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CenterSpaceAround = styled(Center)`
  justify-content: space-around;
`;

const CenterSpaceBetween = styled(Center)`
  justify-content: space-between;
`;

const BoxContainer = styled(CenterSpaceBetween)`
  width: 100%;
`;

const BoxContainer_2 = styled(BoxContainer)`
  @media (max-width: 498px) {
    flex-direction: column;
    gap: 0.5rem;
  }
`;

const LeftSide = styled(Center)`
  flex-direction: column;
  gap: 2rem;
  align-items: flex-start;

  @media (max-width: 1050px) {
    align-items: center;
  }
`;

const RightSide = styled(LeftSide)`
  align-items: center;
`;

const QuantityBox = styled(Center)`
  width: 2.5rem;
  font-size: 1.2rem;
  font-weight: 800;
  background-color: ${DarkYellow};
  color: ${DarkBrown};
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-size: 1.2rem;

  @media (max-width: 592px) {
    font-size: 1rem;
    width: 1rem;
  }

  @media (max-width: 498px) {
    width: 9.5rem;
  }
`;

const Container = styled(MaxWidth)`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4rem 8rem;
  gap: 15rem;

  @media (max-width: 1470px) {
    gap: 12rem;
  }

  @media (max-width: 1419px) {
    gap: 8rem;
  }

  @media (max-width: 1360px) {
    gap: 2.5rem;
    padding: 4rem 5rem;
  }

  @media (max-width: 1050px) {
    flex-direction: column;
  }

  @media (max-width: 592px) {
    padding: 4rem 2rem;
  }
`;

const ChildContainer = styled(Center)`
  flex-direction: column;
  gap: 0.1rem;
`;

const Box = styled(Center)`
  background-color: ${LightYellow};
  padding: 1.5rem;
  border-radius: 2rem;
  flex-direction: column;
  gap: 1rem;
`;

const ErrorContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 3rem;
`;

const SuccessContainer = styled(ErrorContainer)``;

const ErrorMsg = styled.div`
  background-color: ${LightYellow};
  border-radius: 2rem;
  padding: 4rem 2rem;
  text-align: center;
  color: red;
  font-size: 1.2rem;
  opacity: ${(props) => (props.$isErrorSeen ? 1 : 0)};
  visibility: ${(props) => (props.$isErrorSeen ? "visible" : "hidden")};
  position: relative;
`;

const SuccessMsg = styled(ErrorMsg)`
  color: ${DarkYellow};
  font-weight: bold;
  opacity: ${(props) => (props.$isSucSeen ? 1 : 0)};
  visibility: ${(props) => (props.$isSucSeen ? "visible" : "hidden")};
`;

const Modal = styled.div`
  position: fixed;
  z-index: 9999;
  top: 0;
  left: 0;
  backdrop-filter: blur(2.5px);
  -webkit-backdrop-filter: blur(2.5px);
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`;

//!Buttons Styles
const StyledConnectButton = styled.button`
  padding: 0.5rem 1rem;
  color: ${DarkBrown};
  cursor: pointer;
  border-radius: 2rem;
  font-family: inherit;
  background-color: ${DarkYellow};
  border: none;
  font-size: 1.2rem;
  transition: background-color 0.3s, color 0.3s;
  font-weight: 600;
`;

const StyledButton = styled(StyledConnectButton)`
  @media (max-width: 592px) {
    font-size: 1rem;
  }
`;

const HeaderBtn = styled(Center)`
  gap: 2rem;

  @media (max-width: 360px) {
    gap: 1rem;
  }
`;

//!NavBar Styles
const StyledNav = styled.nav`
  width: 100%;
  border-bottom: ${LightYellow} solid 1px;
  padding: 1.5rem 5rem;
  z-index: 98;
  position: relative;

  @media (max-width: 496px) {
    padding: 1.5rem 2rem;
  }
`;

const NavBarContainer = styled(CenterSpaceAround)`
  gap: 2rem;
  justify-content: end;
`;

const NavLinkForIcon = styled.div`
  padding: 0.7rem 0rem;
`;

//!Image Styles & Containers
const ImageContainer = styled(Center)`
  position: relative;
  width: 350px;
  height: 350px;

  @media (max-width: 1150px) {
    width: 280px;
    height: 280px;
  }

  @media (max-width: 496px) {
    width: 235px;
    height: 235px;
  }
`;

const EnlargedImageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: ${(props) => (props.isOpen ? 1 : 0)};
  visibility: ${(props) => (props.isOpen ? "visible" : "hidden")};
  transition: opacity 0.5s, visibility 0.5s;
  width: 100vh;
  padding: 4rem;
`;

const ImageStyle = {
  borderRadius: "2rem",
  width: "100%",
  height: "auto",
  cursor: "pointer",
};

//!Icons Styles
const Icon = styled(Center)``;

const CloseIcon = styled.div`
  position: absolute;
  top: 15px;
  right: 20px;
  cursor: pointer;
  font-weight: bold;
`;

//!Footer Styles
const StyledFooter = styled(StyledNav)`
  border-top: ${LightYellow} solid 1px;
  border-bottom: ${LightYellow} solid 0px;
`;

const FooterPara = styled.p`
  color: ${LightYellow};
  font-size: 1.2rem;
  line-height: 1;
  text-align: center;

  @media (max-width: 525px) {
    font-size: 1rem;
  }
`;

export {
  MaxWidth,
  MainPageWrapper,
  MainH1Title,
  ParaBig,
  ParaMid,
  StyledButton,
  Center,
  CenterSpaceAround,
  CenterSpaceBetween,
  StyledConnectButton,
  StyledNav,
  ImageContainer,
  Container,
  BoxContainer,
  ParaSm,
  Icon,
  ImageStyle,
  Box,
  FooterPara,
  StyledFooter,
  HeaderBtn,
  NavBarContainer,
  LogoText,
  NavLinkForIcon,
  LeftSide,
  RightSide,
  ChildContainer,
  QuantityBox,
  EnlargedImageContainer,
  Modal,
  BoxContainer_2,
  ErrorContainer,
  ErrorMsg,
  CloseIcon,
  SuccessContainer,
  SuccessMsg,
  PageWrapperDark,
};
