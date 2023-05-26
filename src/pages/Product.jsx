import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import Announcement from '../components/Announcement';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import Newsletter from '../components/Newsletter';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import { mobile, mobileLarge, tablet } from '../responsive';
import { useEffect, useState } from 'react';
import { publicRequest } from '../requestMethods';
import { addProduct } from '../redux/cartRedux';
import { useDispatch } from 'react-redux';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { memo } from 'react';


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
    ${mobileLarge({ height: '30vh', flexDirection: 'column' })};
`;

const InfoContainer = styled.div`
    flex: 1;
    padding: 0px 50px;
    text-align: center;
    ${mobileLarge({ padding: '10px' })}
`;

const MainInfo = styled.div`
    display: block;
`;

const TopInfo = styled.div`
    display: flex;
    justify-content: space-between;
`;

const Title = styled.h1`
    font-weight: 200;
    font-size: 30px;
    margin: 0;
    ${mobile({
        fontSize: '26px'
    })}
`;

const Price = styled.span`
    font-weight: 100;
    font-size: 30px;
    ${mobile({
        fontSize: '24px'
    })}
`;

const Desc = styled.p`
    display: flex;
    text-align: justify;
    font-size: 18px;
    -webkit-box-shadow: 0px 0px 15px -10px rgba(0, 0, 0, 0.75);
    box-shadow: 0px 0px 15px -10px rgba(0, 0, 0, 0.75);
    padding: 10px
`;

const FilterContainer = styled.div`
    width: 100%;
    margin: 30px 0px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    ${mobileLarge({ 
        width: '100%',
        flexDirection: 'column',
    })}
`;

const Filter = styled.div`
    display: flex;
    align-items: center;
    padding: 10px;
    ${mobileLarge({ 
        width: '100%',
        justifyContent: 'space-between',
        padding: '0',
    })}
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
    justify-content: space-between;
    ${mobile({ width: '100%' })}
    ${mobileLarge({
        justifyContent: 'center'
    })}
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

const AddToCartButton = styled.button`
    padding: 14px;
    width: 20vw;
    margin-top: 0 5px;
    border: 1px solid teal;
    background-color: white;
    color: teal;
    cursor: pointer;
    font-size: 18px;
    font-weight: 500;
    &:hover {
        background-color: #f8f4f4;
    }
    ${tablet({ 
        width: '40vw'
     })};
     ${mobileLarge({
        width: '100%',
        marginTop: '20px'
     })}
`;

const BuyNowButton = styled.button`
    padding: 14px;
    background-color: teal;
    color: white;
    width: 100%;
    margin-left: auto;
    margin-right: auto;
    margin-top: 20px;
    cursor: pointer;
    font-weight: 500;
    font-size: 18px;
    &:hover {
        background-color: #4e8773;
    }
`;

const Product = () => {
    const location = useLocation();
    const id = location.pathname.split("/")[2];
    const [product, setProduct] = useState({});
    const [quantity, setQuantity] = useState(100);
    const [color, setColor] = useState('');
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const { t } = useTranslation(["product"]);

    useEffect(() => {
        let ignore = false;
        (async () => {
            try {
                if (!ignore) {
                    setIsLoading(true);
                    const res = await publicRequest.get('/products/find/' + id)
                    setProduct(res.data)
                    setColor(res.data.color[0])
                }
            } catch(err) {
                console.log(err);
            } finally {
                setIsLoading(false);
            }
        })();
        return () => ignore = true;
    }, [id]);

    const handleQuantity = (type) => {
        if (type === 'dec') {
            quantity > 100 && setQuantity(quantity - 100)
        } else {
            quantity < 10000 && setQuantity(quantity + 100)
        }
    };

    const handleAddToCart = () => {
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
        : (<Wrapper>
            <ImgContainer>
                <Image src={product.img} />
            </ImgContainer>
            <InfoContainer>
                <MainInfo>
                    <TopInfo>
                        <Title>{t(product.title)}</Title>
                        <Price>{product.price} {t("currency")} {t("per_kg")}</Price>
                    </TopInfo>
                        <Desc>{product.desc[localStorage.getItem("i18nextLng")]}</Desc>
                        <FilterContainer>
                            <Filter>
                                <FilterTitle>{t("choose_color")}</FilterTitle>
                                {product.color?.map((color) => (
                                    <FilterColor color={color} key={color} onClick={() => setColor(color)}/>                            
                                ))}
                            </Filter>
                            <Filter>
                                <SelectedColor>{t("selected_color")} {t(color)}</SelectedColor>
                                <FilterColor color={color} />
                            </Filter>
                        </FilterContainer>
                </MainInfo>
                <AddContainer>
                    <AmountContainer>
                        <RemoveIcon onClick={() => handleQuantity('dec') } style={{ color: 'red' }} />
                        <Amount>{quantity} {t("kg")}</Amount>
                        <AddIcon onClick={() => handleQuantity('inc') } style={{ color: 'green' }} />
                    </AmountContainer>
                <AddToCartButton onClick={handleAddToCart}>{t("add_to_cart")}</AddToCartButton>
                </AddContainer>
                <BuyNowButton onClick={handleBuy}>{t("buy_now")}</BuyNowButton>
            </InfoContainer>
        </Wrapper>)}
      <Newsletter />
      <Footer />
    </Container>
  )
}

export default memo(Product)
