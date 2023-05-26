import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { mobile, tablet, tabletLarge, tabletMiddle, tabletSmall, mobileLarge } from '../responsive';
import { memo } from 'react';


const Container = styled.div`
  flex: 1;
  min-width: 280px;;
  margin: 3px;
  height: 70vh;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fcf1ed;
  ${tabletLarge({
    height: '60vh',
  })};
  ${tablet({
    height: '50vh'
  })};
  ${tabletMiddle({
    height: '40vh'
  })};
  ${tabletSmall({
    height: '30vh'
  })}
  ${mobile({ height: "20vh "})}
`;

const Image = styled.img`
  height: 70vh;
  width: 100%;
  object-fit: cover;
  ${tabletLarge({
    height: '60vh',
  })};
  ${tablet({
    height: '50vh',
  })};
  ${tabletMiddle({
    height: '40vh'
  })};
  ${tabletSmall({
    height: '26vh',
    width: '42vw'
  })};
  ${mobileLarge({ 
    height: "26vh",
    width: '80vw'
  })}
`;

const Info = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Title = styled.h1`
  color: white;
  margin-top: 0;
  margin-bottom: 10px;
  font-weight: 600;
  ${tabletLarge({
    fontSize: '28px'
  })};
  ${mobile({
    fontSize: '40px'
  })}
`;

const Button = styled.button`
  border: none;
  width: 300px;
  padding: 10px;
  background-color: white;
  color: black;
  cursor: pointer;
  font-size: 20px;
  font-weight: 300;
  &:hover{
    background-color: pink;
  }
  ${tabletLarge({
    fontSize: '16px',
    width: '250px',
  })};
  ${tablet({
    fontSize: '14px',
    width: '220px'
  })};
  ${mobile({
    fontSize: '16px',
    width: '220px',
    padding: '5px'
  })}
`;

const CategoriesItem = ({ item }) => {
    const { t } = useTranslation(["slider"]);

  return (
    <Container>
        <Link to={`/products/${item.category}`}>
            <Image src={item.img}/>
            <Info>
                <Title>{t(item.category)}</Title>
                <Button>{t("shop_now")}</Button>
            </Info>
        </Link>
    </Container>
  )
}

export default memo(CategoriesItem);
