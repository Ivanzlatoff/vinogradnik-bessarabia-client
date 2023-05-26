import styled from "styled-components";
// import { useTranslation } from "react-i18next";
import { tabletSmall, mobileLarge } from "../responsive";
import { memo } from "react";


const Container = styled.div`
  background-color: teal;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  font-weight: 200;
  ${tabletSmall({
    fontSize: '18px',
  })};
  ${mobileLarge({
    fontSize: '14px'
  })}
`;

const Announcement = () => {
  // const { t } = useTranslation(["announcement"]);
  
  return (
    <Container>
      {/* {t("announcement")}  */}
    </Container>
  )
}

export default memo(Announcement)
