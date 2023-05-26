import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import Announcement from '../components/Announcement';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import Newsletter from '../components/Newsletter';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import { mobile, tablet } from '../responsive';
import { useEffect, useState, memo, useDeferredValue } from 'react';
import { publicRequest } from '../requestMethods';
import { addProduct } from '../redux/cartRedux';
import { useDispatch } from 'react-redux';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';


const Container = styled.div``;

const Wrapper = styled.div`
    padding: 50px;
    display: flex;
    ${mobile({ padding: '10px', flexDirection: 'column' })};
    ${tablet({ padding: '10px', flexDirection: 'column' })};
`;

const ImgContainer = styled.div`
    flex: 1;
`;


const Image = styled.img`
    width: 100%;
    height: 90vh;
    object-fit: cover;
    ${tablet({ height: '60vh', flexDirection: 'column' })};
    ${mobile({ height: '40vh', flexDirection: 'column' })};
`;

const InfoContainer = styled.div`
    flex: 1;
    padding: 0px 50px;
    ${mobile({ padding: '10px' })}
`;

const Title = styled.h1`
    font-weight: 200;
`;

const Desc = styled.p`
    margin: 20px 0px;
`;

const Price = styled.span`
    font-weight: 100;
    font-size: 40px;
`;

const FilterContainer = styled.div`
    display: flex;
    width: 100%;
    margin: 30px 0px;
    justify-content: space-around;
    align-items: center;
    ${mobile({ width: '100%' })}
`;

const Filter = styled.div`
    display: flex;
    align-items: center;
    padding: 10px;
`;

const FilterTitle = styled.span`
    font-size: 20px;
    font-weight: 200;
`;

const FilterColor = styled.span`
    width: 20px;
    height: 20px;
    border-radius: 50%;
    margin: 0 5px;
    background-color: #${props => props.color.toLowerCase() === 'red' 
                            ? '6f2da8'
                            : props.color.toLowerCase() === 'white'
                            ? 'A6BE47'
                            : 'white'
                        };
    cursor: pointer;
`;

const SelectedColor = styled.div`
    font-size: 20px;
    font-weight: 200;
`;

const AddContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-around;
    ${mobile({ width: '100%' })}
`;

const AmountContainer = styled.div`
    display: flex;
    align-items: center;
    font-weight: 700;
`;

const Amount = styled.span`
    width: 100px;
    border: 1px solid teal;
    align-items: center;
    justify-content: center;
    margin: 0 10px;
    padding: 14px;
    text-align: center;
    font-weight: 500;
`;

const Button = styled.button`
    padding: 15px;
    margin-top: 0 5px;
    border: 2px solid teal;
    background-color: white;
    color: teal;
    cursor: pointer;
    font-weight: 500;
    &:hover {
        background-color: #f8f4f4;
    }
`;

const BuyNowButton = styled.button`
    padding: 15px;
    border: 2px solid teal;
    background-color: teal;
    color: white;
    width: 90%;
    margin-top: 20px;
    cursor: pointer;
    font-weight: 500;
    &:hover {
        background-color: #4e8773;
    }
`;

const ProductSearch = () => {
    const location = useLocation();
    const query = location.pathname.split("/")[2];
    const deferredQuery = useDeferredValue(query); 
    const [product, setProduct] = useState({});
    const [quantity, setQuantity] = useState(100);
    const [color, setColor] = useState('red');
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const { t } = useTranslation(["search"]);

    useEffect(() => {
        (async () => {
            try {
                setIsLoading(true);
                const res = await publicRequest.get('/products/search/' + deferredQuery)
                if (res.data) {
                    const {desc, ...others} = res.data && res.data;
                    setProduct({...others, ...desc})
                } else {
                    toast.error(`${deferredQuery} ${t("no_results")}`);
                    setProduct({})
                }
            } catch(err) {
                console.log(err);
            } finally {
                setIsLoading(false);
            }
        })();
    }, [deferredQuery, t]);

    const handleQuantity = (type) => {
        if (type === 'dec') {
            quantity > 100 && setQuantity(quantity - 100)
        } else {
            quantity < 10000 && setQuantity(quantity + 100)
        }
    };

    const handleColor = (color) => {
        setColor(color);
    }

    const handleClick = () => {
        dispatch(
            addProduct({ ...product, quantity, color })
        );
        toast.success(`${quantity} ${t("kg_of")} ${t(product.title)} ${t("added_to_cart")}`);
        setQuantity(100)
    };

    const handleBuy = () => {
        dispatch(
            addProduct({ ...product, quantity, color })
        );
        navigate("/cart")
    }

  return (
    <Container>
      <Navbar />
      <Announcement />
      {isLoading 
        ? 'Loading, please wait...' 
        : Object.keys(product).length > 0 && (<Wrapper>
            <ImgContainer>
                <Image src={product.img} />
            </ImgContainer>
            <InfoContainer>
                <Title>{t(product.title)}</Title>
                <Desc>
                    {localStorage.getItem("i18nextLng") === 'en'
                        ? t(product.en)
                        : localStorage.getItem("i18nextLng") === 'ru'
                            ? t(product.ru)
                            : t(product.ua)
                    }
                </Desc>
                <Price>{t('currency')} {product.price} {t('per_kg')}</Price>
                <FilterContainer>
                    <Filter>
                        <FilterTitle>{t('choose_color')}</FilterTitle>
                        {product.color?.map((color) => (
                            <FilterColor color={color} key={color} onClick={() => handleColor(color)}/>                            
                        ))}
                    </Filter>
                    <Filter>
                        <SelectedColor>{t('selected_color')} {t(color)}</SelectedColor>
                        <FilterColor color={color} />
                    </Filter>
                </FilterContainer>
                <AddContainer>
                    <AmountContainer>
                        <RemoveIcon onClick={() => handleQuantity('dec') } style={{ color: 'red' }} />
                        <Amount>{quantity} {t('kg')}</Amount>
                        <AddIcon onClick={() => handleQuantity('inc') } style={{ color: 'green' }} />
                    </AmountContainer>
                    <Button onClick={handleClick}>{t('add_to_cart')}</Button>
                    <BuyNowButton onClick={handleBuy}>{t('buy_now')}</BuyNowButton>
                </AddContainer>
            </InfoContainer>
        </Wrapper>)}
      <Newsletter />
      <Footer />
    </Container>
  )
}

export default memo(ProductSearch)
