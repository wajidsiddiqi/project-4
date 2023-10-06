import styled from "styled-components";

//!Colors
const DarkYellow = "#ffaa00";
const LightYellow = "#fbf8ef";
const DarkBrown = "#18120b";

const MaxWidth = styled.div`
  max-width: 1600px;
  width: 100%;
  margin: auto;
`;

const LogoText = styled.h1`
  font-size: 1.2rem;
  font-weight: 900;
  color: black;
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

export { MaxWidth, MainPageWrapper, MainH1Title, LogoText, PageWrapperDark };
