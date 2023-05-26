import styled from 'styled-components';
import Announcement from '../components/Announcement';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { mobile, mobileLarge, tablet, tabletMiddle, tabletSmall } from '../responsive';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { deleteProduct, clearWishlist } from '../redux/wishlistRedux';
import ClearIcon from '@mui/icons-material/Clear';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { memo } from 'react';


const Container = styled.div``;

const Wrapper = styled.div`
    padding: 20px;
    ${mobile({ padding: '10px' })};
`;

const Title = styled.h1`
    font-weight: 300;
    text-align: center;
`;

const Top = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px;
    ${tabletSmall({
        flexDirection: 'column'
    })}
`;

const TopLeft = styled.div`
    flex: 1;
    ${tabletSmall({
        marginBottom: '10px'
    })}
`;

const TopRight = styled.div`
    flex: 1;
    ${tabletSmall({
        marginTop: '10px'
    })}
`;

const TopButton = styled.button`
    width: 100%;
    padding: 10px;
    font-weight: 300;
    font-size: 20px;
    cursor: pointer;
    border: 1px solid black;
    background-color: ${props => props.type === 'filled' ? 'pink' : 'transparent'};
    color: ${props => props.type === 'filled' ? 'white' : 'black'}
`;

const TopTexts = styled.div`
    flex: 1;
    text-align: center;
    ${mobile({ display: 'none' })}
`;

const TopText = styled.span`
    text-decoration: underline;
    cursor: pointer;
    margin: 0px 10px;
`

const Bottom = styled.div`
    display: flex;
    justify-content: space-between;
`;

const Info = styled.div`
    flex: 3
`;

const ProductContainer = styled.div`
    position: relative;
`;

const Product = styled.div`
    display: flex;
    justify-content: space-between;
    ${mobileLarge({ flexDirection: 'column' })}
`;

const ProductDetails = styled.div`
    flex: 3;
    display: flex;
    padding: 20px;
    margin: 20px;
    -webkit-box-shadow: 0px 0px 15px -10px rgba(0, 0, 0, 0.75);
    box-shadow: 0px 0px 15px -10px rgba(0, 0, 0, 0.75);
`;

const Image = styled.img`
    width: 200px;
    ${tabletSmall({
        width: '150px',
        height: '100%',
        objectFit: 'cover'
    })};
    ${mobile({
        width: '100px',
    })}
`;

const Details = styled.div`
    display: flex;
    padding: 20px;
    flex-direction: column;
    justify-content: flex-start;
`;

const ProductName = styled.span``;

const UnitPrice = styled.span``;


const Desc = styled.p`
    flex: 5;
    margin: 20px;
    padding: 20px;
    -webkit-box-shadow: 0px 0px 15px -10px rgba(0, 0, 0, 0.75);
    box-shadow: 0px 0px 15px -10px rgba(0, 0, 0, 0.75);
    ${tablet({
        flex: '4'
    })};
    ${tabletMiddle({
        flex: '3'
    })};
    ${tabletSmall({
        flex: '2'
    })}
`;

const Hr = styled.hr`
    background-color: #eee;
    border: none;
    height: 1px;
`;

const Wishlist = () => {
    const cart = useSelector(state => state.cart);
    const wishlist = useSelector(state => state.wishlist);
    const dispatch = useDispatch();
    const { t } = useTranslation(["wishlist"]);

    const handleDelete = (product) => {
        dispatch(
            deleteProduct({ ...product })
        );
        toast.error(`${t(product.title)} ${t("removed")}`);
    };

    const handleClearWishlist = () => {
        dispatch(
            clearWishlist()
        );
        toast.error(t("clear_wishlist"));
    }

  return (
    <Container>
      <Announcement />
      <Navbar />
      <Wrapper>
        <Title>{t("your_wishlist1")}</Title>
        <Top>
            <TopLeft>
                <Link to="/">
                    <TopButton>{t("continue_shopping")}</TopButton>
                </Link>
            </TopLeft>
            <TopTexts>
                <Link to="/cart">
                    <TopText>{t("shopping_bag")} ({cart.quantity})</TopText>
                </Link>
                <TopText>{t("your_wishlist2")} ({wishlist.quantity})</TopText>
            </TopTexts>
            <TopRight>
                {wishlist.products.length > 0 &&
                    <TopButton 
                        type='filled' 
                        onClick={() => handleClearWishlist()}
                    >
                        {t("empty_wishlist")}
                    </TopButton>}
            </TopRight>
        </Top>
        <Bottom>
            <Info>
                {wishlist.products?.map(product => ( 
                    <ProductContainer key={product._id}> 
                        <Product>
                            <ProductDetails>
                                <Link to={`/product/${product._id}`}>
                                    <Image src={product.img} />
                                </Link>
                                <Details>
                                    <ProductName><b>{t("product")}: </b>{t(product.title)}</ProductName>
                                    <UnitPrice><b>{t("price")}: </b>{product.price} {t("uah")} {t("per_kg")}</UnitPrice>
                                </Details>
                            </ProductDetails>
                            <Desc>{product.desc[localStorage.getItem("i18nextLng")]}</Desc>
                            <ClearIcon 
                                style={{ 
                                    color: 'grey', 
                                    marginRight: '10',
                                    cursor: 'pointer',
                                    position: 'absolute',
                                    top: '20px',
                                    right: '-15px',
                                    "hover": {
                                        transform: 'scale(1.1)',
                                        color: 'red',
                                    }
                                }} 
                                onClick={() => handleDelete(product)}

                            />
                        </Product>
                        <Hr />
                    </ProductContainer> )
                    ) 
                }
            </Info>
        </Bottom>
      </Wrapper>
      <Footer />
    </Container>
  )
}

export default memo(Wishlist)
