import styled from 'styled-components';
import Announcement from '../components/Announcement';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { mobile, mobileLarge, tabletMiddle, tabletSmall } from '../responsive';
import { useSelector } from 'react-redux';
import StripeCheckout from 'react-stripe-checkout';
import { useEffect, useState } from 'react';
import { publicRequest } from '../requestMethods';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { increaseProduct, decreaseProduct, deleteProduct, clearCart } from '../redux/cartRedux';
import ClearIcon from '@mui/icons-material/Clear';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { memo } from 'react';


const KEY = process.env.REACT_APP_STRIPE;

const Container = styled.div`
    
`;

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
    margin-bottom: 20px;
    ${mobile({ 
        flexDirection: 'column',
    })}
`;

const TopButton = styled.button`
    width: 100%;
    padding: 10px;
    font-weight: 300;
    font-size: 20px;
    cursor: pointer;
    border: 1px solid black;
    background-color: ${props => props.type === 'filled' ? 'black' : 'transparent'};
    color: ${props => props.type === 'filled' ? 'white' : 'black'};
    ${tabletSmall({
        backgroundColor: props => props.type === 'filled' ? 'black' : 'transparent',
        color: props => props.type === 'filled' ? 'white' : 'black',
        fontSize: '14px'
    })};
    ${mobile({ 
        marginTop: '10px',
        width: '80vw'
    })}
`;

const TopTexts = styled.div`
    ${tabletSmall({ 
        display: 'flex',
        flexDirection: 'column',
     })};
    ${mobileLarge({ display: 'none' })}
`;

const TopText = styled.span`
    text-decoration: underline;
    cursor: pointer;
    margin: 0px 10px;
`

const Bottom = styled.div`
    display: flex;
    justify-content: space-between;
    ${tabletSmall({ flexDirection: 'column' })}
`;

const Info = styled.div`
    flex: 3
`;

const ProductContainer = styled.div`

`;

const Product = styled.div`
    display: flex;
    justify-content: space-between;
    position: relative;
    ${tabletMiddle({ flexDirection: 'column' })}
`;

const ProductDetails = styled.div`
    flex: 2;
    display: flex;
    ${mobile({
        flexDirection: 'column'
    })}
`;

const Image = styled.img`
    width: 200px;
    ${mobile({
        width: '76vw',
        marginLeft: '20px'
    })}
`;

const Details = styled.div`
    display: flex;
    padding: 20px;
    flex-direction: column;
    justify-content: space-around;
`;

const ProductName = styled.span``;

const UnitPrice = styled.span``;

const ProductId = styled.span``;

const ProductColorBlock = styled.span`
    display: flex;
`;

const ProductColor = styled.div`
    width: 20px;
    height: 20px;
    border-radius: 50%;
    margin-right: 10px;
    background-color: #${props => props.color.toLowerCase() === 'red' 
                            ? '6f2da8'
                            : props.color.toLowerCase() === 'white'
                            ? 'A6BE47'
                            : 'white'
                        };
`;

const PriceDetails = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    ${tabletMiddle({ 
        flexDirection: 'row',   
        alignItems: 'start',
        justifyContent: 'center',
        marginTop: '10px'
    })};
`;

const ProductAmountContainer = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 20px;
`;

const ProductAmount = styled.div`
    font-size: 24px;
    margin: 5px;
    ${mobile({ margin: '5px 15px' })}
`;

const ProductPrice = styled.div`
    font-size: 30px;
    font-weight: 200;
    ${tabletMiddle({ 
        marginLeft: '20px'
    })};
    ${mobile({ marginBottom: '20px' })}
`;

const Hr = styled.hr`
    background-color: #eee;
    border: none;
    height: 1px;
`;

const Summary = styled.div`
    flex: 1;
    border: 0.5px solid lightgray;
    border-radius: 10px;
    padding: 20px;
    height: 60%;
`;

const SummaryTitle = styled.h1`
    font-weight: 200;
`;

const SummaryItem = styled.div`
    margin: 30px 0px;
    display: flex;
    justify-content: space-between;
    font-weight: ${props => props.type === 'total' && '500'};
    font-size: ${props => props.type === 'total' && '24px'};
`;

const SummaryItemText = styled.span`
    margin: 0 10px;
`;

const SummaryButton = styled.button`
    width: 100%;
    padding: 10px;
    background-color: black;
    color: white;
    font-weight: 200;
    font-size: 20px;
    cursor: pointer;
`;

const Cart = () => {
    const cart = useSelector(state => state.cart);
    const wishlist = useSelector(state => state.wishlist);
    const [stripeToken, setStripeToken] = useState(null);
    const [email, setEmail] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { t } = useTranslation(["cart"]);
    const totalWeight = cart.products.reduce((previousValue, currentValue) => previousValue + currentValue.quantity, 0);
    const shippingDiscount = -500;
    const estimatedShippingCost = Math.max(Math.round(totalWeight * 1.1), 500);
    const grandTotal = cart.totalPrice + estimatedShippingCost + shippingDiscount;
    const lang = localStorage.getItem("i18nextLng");

    const onEmailAddress = (emailAddress) => {
        setEmail(emailAddress);
    }

    const onToken = (token) => {
        setStripeToken(token);
        setEmail(token.email)
    };

    useEffect(() => {
        stripeToken && cart.totalPrice >= 1 &&
        (async () => {
            try {
                const res = await publicRequest.post('/checkout/payment', {
                    tokenId: stripeToken.id,
                    amount: grandTotal * 100,
                    email,
                    cart
                });
                navigate('/success', {state: { 
                    stripeData: res.data,
                    cart,
                    email
                }});
            } catch(err) {
                console.log(err);
            }
        })();
    }, [stripeToken, cart, navigate, grandTotal, email])

    const handleQuantity = (type, product) => {
        if (type === 'inc') {
            dispatch(
                increaseProduct({ ...product })
            );
        } else if (type === 'dec') {
            dispatch(
                decreaseProduct({ ...product })
            );
        }
    };

    const handleDelete = (product) => {
        dispatch(
            deleteProduct({ ...product })
        );
        toast.error(`${t(product.title)} ${t("of")} ${t(product.color)} ${t("removed")}`);
    };

    const handleClearCart = () => {
        dispatch(
            clearCart()
        );
        toast.error(t("clear_cart"));
    };

    const stripeCheckout =  <StripeCheckout
                                label={t("proceed_to_payment")}
                                name={t("stripe_name")}
                                image="https://firebasestorage.googleapis.com/v0/b/shop-80015.appspot.com/o/grape-icon.png?alt=media&token=edb90e89-ed75-4e1d-b172-d92fdaba92bb"
                                billingAddress
                                shippingAddress
                                description={`${t("stripe_desc")} ${grandTotal} ${t("currency")}`}
                                amount={grandTotal*100}
                                currency="UAH"
                                token={onToken}
                                emailAddress={onEmailAddress}
                                stripeKey={KEY}
                                panelLabel={t("pay")}
                                locale={lang}
                                bitcoin
                            >
                                <SummaryButton>{t("checkout")}</SummaryButton>
                            </StripeCheckout>

  return (
    <Container>
        <Announcement />
        <Navbar />
            <Wrapper>
                <Title>{t("your_cart")}</Title>
                <Top>
                    <Link to="/">
                        <TopButton>{t("continue_shopping")}</TopButton>
                    </Link>
                    <TopTexts>
                        <TopText>{t("shopping_bag")} ({cart.quantity})</TopText>
                        <Link to="/wishlist">
                            <TopText>{t("your_wishlist")} ({wishlist.quantity})</TopText>
                        </Link>
                    </TopTexts>
                    {cart.products.length > 0 && stripeCheckout}
                </Top>
                <Bottom>
                    <Info>
                        {cart.products?.map((product, index) => ( 
                            <ProductContainer key={product._id+product.color}> 
                                <Product>
                                    <ProductDetails>
                                        <Image src={product.img} />
                                        <Details>
                                            <ProductName><b>{t("product")}: </b>{t(product.title)}</ProductName>
                                            <UnitPrice><b>{t("price")}: </b>{product.price} {t("currency")} {t("per_kg")}</UnitPrice>
                                            <ProductId><b>{t("productCode")} </b>{product._id.slice(-6).toUpperCase()}</ProductId>
                                            <ProductColorBlock>
                                                <ProductColor color={product.color}/> {t(product.color)}
                                            </ProductColorBlock>
                                        </Details>
                                    </ProductDetails>
                                    <PriceDetails>
                                        <ProductAmountContainer>
                                            <RemoveIcon onClick={() => handleQuantity('dec', product) } style={{ color: 'red' }} />
                                            <ProductAmount>{product.quantity} {t("kg")}</ProductAmount>
                                            <AddIcon onClick={() => handleQuantity('inc', product, index) } style={{ color: 'green' }} />
                                        </ProductAmountContainer>
                                        <ProductPrice>{product.price * product.quantity} {t("currency")}</ProductPrice>
                                    </PriceDetails>
                                    <ClearIcon 
                                        style={{ 
                                            color: 'grey', 
                                            marginRight: '10',
                                            cursor: 'pointer',
                                            position: 'absolute',
                                            top: '2px',
                                            right: '2px',
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
                    {cart.products.length > 0 &&
                    <Summary>
                        <SummaryTitle>{t("order_summary")}</SummaryTitle>
                        <SummaryItem>
                            <SummaryItemText>{t("subtotal")}</SummaryItemText>
                            <SummaryItemText>{cart.totalPrice} {t("currency")}</SummaryItemText>
                        </SummaryItem>
                        <SummaryItem>
                            <SummaryItemText>{t("est_shipping")}</SummaryItemText>
                            <SummaryItemText>{estimatedShippingCost} {t("currency")}</SummaryItemText>
                        </SummaryItem>
                        <SummaryItem>
                            <SummaryItemText>{t("shipping_discount")}</SummaryItemText>
                            <SummaryItemText>{shippingDiscount} {t("currency")}</SummaryItemText>
                        </SummaryItem>
                        <SummaryItem type='total'>
                            <SummaryItemText>{t("total")}</SummaryItemText>
                            <SummaryItemText>{grandTotal} {t("currency")}</SummaryItemText>
                        </SummaryItem>
                            {stripeCheckout}
                            <TopButton 
                                type='filled' 
                                style={{ backgroundColor: 'orange', width: '100%', marginTop: '20px'}}
                                onClick={() => handleClearCart()}
                            >
                                {t("empty_cart")}
                            </TopButton>
                    </Summary>}
                </Bottom>
            </Wrapper>
        <Footer />
    </Container>
  )
}

export default memo(Cart);
