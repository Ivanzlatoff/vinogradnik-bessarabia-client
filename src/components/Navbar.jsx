import { useState, useEffect, memo } from 'react';
import styled from 'styled-components';
import SearchIcon from '@mui/icons-material/Search';
import Badge from '@mui/material/Badge';
import { ShoppingCartOutlined, Favorite, Home } from '@mui/icons-material/';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from "../redux/apiCalls";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import { getRefreshToken, userRequest } from '../requestMethods';
import { mobile, mobileLarge, tabletMiddle, tablet, tabletLarge, tabletSmall } from '../responsive';
import { fetchCart } from "../redux/cartRedux";
import { fetchWishlist } from "../redux/wishlistRedux";
import { cartStatuses, wishlistStatuses } from '../constants';


const Container = styled.div`
    position: sticky;
    background-color: white;
    top: 0;
    z-index: 999;
    ${mobileLarge({
        backgroundColor: '#b0c24a',
        borderRadius: '10px',
        width: '96vw',
        margin: '5px auto 10px',
    })}
`;

const Wrapper = styled.div`
    padding: 10px 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    ${mobileLarge({
        padding: '4px 8px'
    })}
`;

const Left = styled.div`
    flex: 3;
    display: flex;
    align-items: center;
`;



const Center = styled.div`
    flex: 3;
    display: flex;
    text-align: center;
    justify-content: center;
`;

const LogoImg = styled.h1`
    font-weight: 300;
    display: flex;
    margin: 0;
    align-items: center;
    justify-content: center;
    ${tabletLarge({
        fontSize: '30px'
    })};
    ${tablet({
        fontSize: '20px'
    })};
    ${tabletMiddle({
        fontSize: '18px'
    })};
    ${mobile({
        display: 'none'
    })}
`;

const LogoText = styled.h1`
    color: red;
    font-weight: 300;
    display: flex;
    margin: 0;
    align-items: center;
    justify-content: center;
    ${tabletLarge({
        fontSize: '30px'
    })};
    ${tablet({
        fontSize: '20px'
    })};
    ${tabletMiddle({
        fontSize: '18px'
    })};
    ${mobileLarge({
        display: 'none'
    })}
`;

const Right = styled.div`
    flex: 2;
    display: flex;
    align-items: center;
    justify-content: flex-end;
`;

const Language = styled.select`
    font-size: 16px;
    cursor: pointer;
    padding: 10px;
    margin-right: 10px;
    ${tabletLarge({
        fontSize: '14px'
    })};
    ${tablet({
        fontSize: '12px',
        padding: '5px'
    })};
    ${mobile({
        fontSize: '12px',
        padding: '2px',
        marginRight: '2px'
    })};
`;

const SearchContainer = styled.div`
    display flex;
    align-items: center;
    margin-left: 15px;
    margin-right: 15px;
    border: 1px solid gray;
    background-color: teal;
    ${tabletSmall({
        display: 'none'
    })}
`;

const Input = styled.input`
    border: none;
    padding: 10px;
    font-size: 16px;
    ${tabletLarge({
        fontSize: '14px',
    })};
    ${tablet({
        fontSize: '12px',
        padding: '5px'
    })};
  ::placeholder,
  ::-webkit-input-placeholder {
    color: ${props => props.theme === 'dark' ? '#b9b5ba' : '#b1b1ba'};
  }
  :-ms-input-placeholder {
     color: ${props => props.theme === 'dark' ? '#b9b5ba' : '#b1b1ba'};
  }
`;

const MenuItem = styled.div`
    font-size: 16px;
    cursor: pointer;
    margin-left: 25px;
    ${tabletLarge({
        fontSize: '14px'
    })};
    ${tablet({
        fontSize: '13px'
    })};
    ${tabletMiddle({
        fontSize: '12px',
        marginLeft: '10px'
    })};
`;

const Img = styled.img`
    width: 50px;
    height: 50px;
`;

const Navbar = () => {
    const cartQuantity = useSelector(state => state.cart.quantity);
    const cartId = useSelector(state => state.cart.id);
    const cartProducts = useSelector(state => state.cart.products);
    const createdAt = useSelector(state => state.cart.createdAt);
    const wishlistQuantity = useSelector(state => state.wishlist.quantity);
    const wishlistId = useSelector(state => state.wishlist.id);
    const wishlistProducts = useSelector(state => state.wishlist.products);
    const user = useSelector(state => state.user.currentUser);
    const userId = user?._id;
    const cartStatus = useSelector(state => state.cart.status);
    const wishlistStatus = useSelector(state => state.wishlist.status);
    const dispatch = useDispatch();
    const [search, setSearch] = useState('');
    const navigate = useNavigate();
    const { i18n, t } = useTranslation(["navbar"]);

    useEffect(() => {
        if (localStorage.getItem("i18nextLng")?.length > 2) {
            i18next.changeLanguage("ua");
        }
    }, []);

    useEffect(() => {
        let ignore = false;
        if (userId && cartStatus === cartStatuses.IDLE) {
            !ignore && dispatch(fetchCart(userId));
        }

        return () => ignore = true;
    }, [userId, cartStatus, dispatch]);

    useEffect(() => {
        let ignore = false;
        if (userId && wishlistStatus === wishlistStatuses.IDLE) {
            !ignore && dispatch(fetchWishlist(userId));
        }

        return () => ignore = true;
    }, [userId, wishlistStatus, dispatch]);

    const handleClick = async (e) => {
        e.preventDefault();
        try { 
            if (cartQuantity && !cartId) {
                await userRequest.post('/carts', {
                    userId: user._id, 
                    products: cartProducts,
                    createdAt: new Date(),
                    updatedAt: new Date()                   
                });            
            } else if (cartQuantity && cartId) {
                await userRequest.put(`/carts/${cartId}`, {
                    userId: user._id, 
                    products: cartProducts,
                    createdAt,
                    updatedAt: new Date()                   
                });
            } else if (!cartQuantity && cartId) {
                await userRequest.delete(`/carts/${cartId}`)
            }
        } catch(err) {
            console.log(err);
        }
        try {
            if (wishlistQuantity && !wishlistId) {
                await userRequest.post('/wishlists', {
                    userId: user._id, 
                    products: wishlistProducts,
                    createdAt: new Date(),
                    updatedAt: new Date()                   
                });            
            } else if (wishlistQuantity && wishlistId) {
                await userRequest.put(`/wishlists/${wishlistId}`, {
                    userId: user._id, 
                    products: wishlistProducts,
                    createdAt,
                    updatedAt: new Date()                   
                });
            } else if (!wishlistQuantity && wishlistId) {
                await userRequest.delete(`/wishlists/${wishlistId}`)
            }
        } catch(err) {
            console.log(err);
        };
        const refreshTokenId = getRefreshToken().refreshTokenId;
        logout(dispatch, { refreshTokenId });
        navigate("/");
    };

    const handleSearch = (e) => {
        // e.preventDefault()
        setSearch(e.target.value)
    };

    const handleSearchClick = () => {
        search && navigate(`/product_search/${search}`)
    };

    const handleLanguage = (e) => {
        i18n.changeLanguage(e.target.value)
    };


  return (
    <Container>
        <Wrapper>
            <Left>
                <Link 
                    to="/" 
                    style={{ 
                        textDecoration: 'none',
                        marginRight: '10px',
                        marginLeft: '-5px'
                    }}
                >
                    <Home color="action" fontSize='large'/>
                </Link>
                <Language 
                    onChange={handleLanguage} 
                    value={localStorage.getItem("i18nextLng")}
                >
                    <option className='languageOption' value="ua">Українська</option>
                    <option className='languageOption' value="en">English</option>
                    <option className='languageOption' value="ru">Русский</option>
                </Language>
                <SearchContainer>
                    <Input className='searchInput' placeholder={t("search")} onChange={handleSearch} /> 
                    <SearchIcon style={{ color: 'white', fontSize: '26px', cursor: 'pointer' }} onClick={handleSearchClick} />
                </SearchContainer>
            </Left>
            <Center>
                <LogoImg>
                    <Link to="/" style={{ textDecoration: 'none' }}>
                        <Img src='https://firebasestorage.googleapis.com/v0/b/vb-react-ecommerce-app.appspot.com/o/grape-icon.png?alt=media&token=1a844197-58a8-4d95-b5a1-de50ff6f73c6' alt='logo' />
                    </Link>
                </LogoImg>
                <LogoText>
                   <Link to="/" style={{ textDecoration: 'none' }}>
                        {t("logo")} 
                    </Link>
                </LogoText>    
            </Center>
            <Right>
                {user 
                    ? <MenuItem onClick={(e) => handleClick(e)}>{t("logout")}</MenuItem>
                    :
                    <>
                        <Link to="/register">
                            <MenuItem>{t("register")}</MenuItem> 
                        </Link>
                        <Link to="/login">
                            <MenuItem>{t("login")}</MenuItem>
                        </Link>
                    </>
                }
                <Link to="/wishlist">
                    <MenuItem>
                        <Badge 
                            badgeContent={wishlistQuantity} 
                            color="primary"
                        >
                            <Favorite color="action" />
                        </Badge>
                    </MenuItem>
                </Link>
                <Link to="/cart">
                    <MenuItem>
                        <Badge 
                            badgeContent={cartQuantity} 
                            color="primary"
                        >
                            <ShoppingCartOutlined color="action" />
                        </Badge>
                    </MenuItem>
                </Link>
            </Right>
        </Wrapper>
    </Container>
  )
}

export default memo(Navbar);
