import styled from 'styled-components';
import ArrowLeftOutlinedIcon from '@mui/icons-material/ArrowLeftOutlined';
import ArrowRightOutlinedIcon from '@mui/icons-material/ArrowRightOutlined';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { sliderItems_en, sliderItems_ua, sliderItems_ru } from '../data';
import { mobile, mobileLarge, tablet, tabletSmall } from '../responsive';
import { useTranslation } from 'react-i18next';
import { memo } from 'react';


const Container = styled.div`
    width: 100%;
    height: 100vh;
    display: flex;
    position: relative;
    overflow: hidden;
    object-fit: cover;
    ${mobile({ display: 'none' })};
    ${tabletSmall({
        height: '50vh',
        textAlign: 'center'
    })};
    ${mobileLarge({
        height: '70vh',
        width: '100%',
    })}
`

const Arrow = styled.div`
    width: 50px;
    height: 50px;
    background-color: #fff7f7;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 0;
    bottom: 0;
    left: ${props => props.direction === 'left' && '10px'};
    right: ${props => props.direction === 'right' && '10px'};
    margin: auto;
    cursor: pointer;
    opacity: 0.5;
    z-index: 2;
    ${mobileLarge({
        backgroundColor: 'pink'
    })}
`

const Wrapper = styled.div`
    height: 100%;
    display: flex;
    transition: all 1.5s ease;
    transform: translateX(${props => props.slideIndex * -100}vw);
`

const Slide = styled.div`
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    text-align: start;
    background-color: #${props => props.bg};
    ${tabletSmall({
        height: '70vh',
        alignItems: 'start',
    })}
    ${mobileLarge({
        flexDirection: 'column',
    })}
`;

const ImgContainer = styled.div`
    height: 100%;
    flex: 1;
    ${mobileLarge({
        display: 'flex',
        textAlign: 'center'
    })}
`;

const Image = styled.img`
    height: 80%;
    width: 50vw;
    object-fit: cover;
    ${tabletSmall({
        height: '70%',
        width: '40vw',
    })}
    ${mobileLarge({
        height: '30vh',
        width: '100vw',
    })}
`

const InfoContainer = styled.div`
    flex: 1;
    padding: 50px;
    ${mobileLarge({
        padding: '20px'
    })}
`;

const Title = styled.h1`
    font-size: 70px;
    margin: 0;
    text-align: start;
    ${tablet({
        fontSize: '50px'
    })};
    ${mobileLarge({
        fontSize: '40px',
        marginTop: '20px'
    })}
`;

const Desc = styled.p`
    margin: 50px 0px;
    font-size: 30px;
    font-weight:500;
    letter-spacing: 3px;
    ${tablet({
        fontSize: '26px'
    })};
    ${mobileLarge({
        fontSize: '22px',
        margin: '20px 0'
    })}
`

const Button = styled.button`
    padding: 10px;
    width: 98%;
    font-size: 20px;
    background-color: teal;
    cursor: pointer;
    ${mobileLarge({
        fontSize: '16px'
    })}
`

const Slider = () => {
    const [slideIndex, setSlideIndex] = useState(0)
    const handleClick = (direction) => {
        if (direction === 'left') {
            setSlideIndex(slideIndex > 0 ? slideIndex-1 : sliderItems.length-1)
        } else if (direction === 'right') {
            setSlideIndex(slideIndex < (sliderItems.length-1) ? slideIndex+1 : 0)
        }
    };
    const { t } = useTranslation(["slider"]);
    const lang = localStorage.getItem("i18nextLng");
    const sliderItems = lang === 'ua' 
        ? sliderItems_ua 
        : lang === 'ru'
            ? sliderItems_ru
            : sliderItems_en;
  return (
    <Container>
      <Arrow direction='left' onClick={() => handleClick('left')}>
        <ArrowLeftOutlinedIcon />
      </Arrow>
      <Wrapper slideIndex={slideIndex}>
        {sliderItems.map(item => (
            <Slide bg={item.bg} key={item.id}>
                <ImgContainer>
                    <Image src={item.img} />
                </ImgContainer>
                <InfoContainer>
                    <Title>{item.title}</Title>
                    <Desc>{item.desc}</Desc>
                    <Link to={`/products/${item.category}`}>
                        <Button>{t("shop_now")}</Button>
                    </Link>
                </InfoContainer>
            </Slide>
        ))}
      </Wrapper>
      <Arrow direction='right' onClick={() => handleClick('right')}>
        <ArrowRightOutlinedIcon />
      </Arrow>
    </Container>
  )
}

export default memo(Slider);
