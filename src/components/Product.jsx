import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import FavoriteIcon from '@mui/icons-material/Favorite';
import DoNotDisturbOutlinedIcon from '@mui/icons-material/DoNotDisturbOutlined';
import { addProduct, deleteProduct } from '../redux/wishlistRedux';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { memo } from 'react';


const Info = styled.div`
  opacity: 0;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background-color: rgba(0,0,0,0.2);
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.5s ease;
  cursor: pointer;
`

const Container = styled.div`
  flex: 1;
  margin: 5px;
  min-width: 280px;
  height: 350px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5fbfd;
  position: relative;

  &:hover ${Info}{
    opacity: 1;
  }
`

const Circle = styled.div`
  width: 330px;
  height: 330px;
  border-radius: 50%;
  background-color: white;
  position: absolute;
`

const Image = styled.img`
  height: 75%;
  width: 75%;
  object-fit: cover;
  z-index: 2;
`

const Icon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 10px;
  transition: all 0.5s ease;
  &:hover{
    background-color: #e9f5f5;
    transform: scale(1.1);
  }
`;

const Title = styled.h3`
  position: absolute;
  top: -10px;
  z-index: 3;
`;


const Product = ({item}) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const dispatch = useDispatch();
  const wishlist = useSelector(state => state.wishlist);
  const { t } = useTranslation(["product"])

  useEffect(() => {
    for (let i=0; i < wishlist.products.length; i++) {
      if (wishlist.products[i]._id === item._id) {
        setIsFavorite(true);
      }
    }

  }, [item, wishlist]);

  const handleClick = () => {
      setIsFavorite(!isFavorite)
      !isFavorite
        ? dispatch(addProduct({ ...item }))
        : dispatch(deleteProduct({ ...item }))
  };

  return (
    <Container>
      <Title>{t(item.title)} - {item.price} {t("currency").toLowerCase()}/{t("kg")}</Title>
      <Circle />
      <Image src={item.img}/>
      <Info>
        {item.inStock && <Icon>
                          <Link to="/cart">
                            <ShoppingCartOutlinedIcon />
                          </Link>
                        </Icon>}
        <Icon>
          {item.inStock 
            ? <Link to={`/product/${item._id}`}>
                <SearchOutlinedIcon />
              </Link>
            : <DoNotDisturbOutlinedIcon style={{ color: "red" }}/>}
        </Icon>
        <Icon>
          {!isFavorite 
            ? <FavoriteBorderOutlinedIcon onClick={() => handleClick()} />
            : <FavoriteIcon style={{ color: "red" }} onClick={() => handleClick()}/>}
        </Icon>
      </Info>
    </Container>
  )
}

export default memo(Product);
