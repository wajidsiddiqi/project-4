import styled from "styled-components";

//!Colors
const DarkGreen = "#046865";
const CoolBlue = "#d7fff8";

const MaxWidth = styled.div`
  max-width: 1600px;
  width: 100%;
  margin: auto;
`;

const LogoText = styled.h1`
  font-size: 1.5rem;
  font-weight: 800;
  color: ${DarkGreen};
`;

//!Wrappers Styles
const PageWrapper = styled(MaxWidth)`
  display: flex;
  flex-direction: column;
  padding: 5rem;
  height: 100vh;
`;

//!Heading Styles

//!Paragraph Styles
const ParaBig = styled.p`
  color: ${CoolBlue};
  font-size: 1.5rem;
  line-height: 1;
  font-weight: 300;
`;

const ParaMid = styled(ParaBig)`
  font-size: 1.2rem;
  color: ${CoolBlue};
  font-weight: 700;

  @media (max-width: 500px) {
    font-size: 1rem;
  }
`;

const ParaSm = styled(ParaMid)`
  font-size: 1rem;
  font-weight: 500;
  color: ${CoolBlue};

  @media (max-width: 500px) {
    font-size: 0.9rem;
  }
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

const ChildContainer = styled(Center)`
  gap: 0.2rem;
`;

const Box = styled(Center)`
  border-radius: 12px;
  flex-direction: column;
  gap: 0.2rem;
  background-color: ${DarkGreen};
  padding: 2rem;
`;

const ErrorContainer = styled(Center)`
  padding: 3rem;
  opacity: ${(props) => (props.$isErrorSeen ? 1 : 0)};
  visibility: ${(props) => (props.$isErrorSeen ? "visible" : "hidden")};
  transition: all 0.3s ease-in-out;
`;

const SuccessContainer = styled(ErrorContainer)`
  opacity: ${(props) => (props.$isSucSeen ? 1 : 0)};
  visibility: ${(props) => (props.$isSucSeen ? "visible" : "hidden")};
  transition: all 0.3s ease-in-out;
`;

const ErrorMsg = styled.div`
  background-color: ${DarkGreen};
  border-radius: 2rem;
  padding: 4rem 2rem;
  text-align: center;
  color: ${CoolBlue};
  font-size: 1.2rem;
  position: relative;
`;

const SuccessMsg = styled(ErrorMsg)`
  font-weight: bold;
`;

const Modal = styled(Center)`
  position: fixed;
  z-index: 9999;
  top: 0;
  left: 0;
  backdrop-filter: blur(2.5px);
  -webkit-backdrop-filter: blur(2.5px);
  width: 100%;
  height: 100%;
  transition: all 0.3s ease-in-out;
  visibility: ${(props) => (props.$isErrorSeen ? "visible" : "hidden")};
`;

const Modal2 = styled(Modal)`
  transition: all 0.3s ease-in-out;
  visibility: ${(props) => (props.$isSucSeen ? "visible" : "hidden")};
`;

//!Buttons Styles
const StyledConnectButton = styled.button`
  padding: 12px 16px;
  color: ${(props) => (props.color === "opp" ? DarkGreen : CoolBlue)};
  cursor: pointer;
  border-radius: 12px;
  font-family: inherit;
  background-color: ${(props) =>
    props.color === "opp" ? CoolBlue : DarkGreen};
  border: none;
  font-size: 1rem;
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
  padding: 1.5rem 5rem;
  z-index: 98;
  position: absolute;

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
  bottom: 0;
`;

const FooterPara = styled.p`
  color: ${DarkGreen};
  font-size: 1.2rem;
  line-height: 1;
  text-align: center;

  @media (max-width: 525px) {
    font-size: 1rem;
  }
`;

export {
  MaxWidth,
  ParaBig,
  ParaMid,
  StyledButton,
  Center,
  CenterSpaceAround,
  CenterSpaceBetween,
  StyledConnectButton,
  StyledNav,
  ParaSm,
  Icon,
  Box,
  FooterPara,
  StyledFooter,
  HeaderBtn,
  NavBarContainer,
  LogoText,
  NavLinkForIcon,
  ChildContainer,
  Modal,
  ErrorContainer,
  ErrorMsg,
  CloseIcon,
  SuccessContainer,
  SuccessMsg,
  PageWrapper,
  Modal2,
};
