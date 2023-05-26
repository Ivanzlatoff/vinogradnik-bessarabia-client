import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import { clearCart } from '../redux/cartRedux';
import { useDispatch, useSelector } from 'react-redux';
import { runFireworks } from '../lib/utils';
import styled from 'styled-components';
import { publicRequest } from "../requestMethods";
import { useTranslation } from "react-i18next";
import { memo } from 'react';


const Container = styled.div`
  background-color: white;
  min-height: 60vh;
`;

const Wrapper = styled.div`
  width: 1000px;
  margin: auto;
  margin-top: 160px;
  background-color: #dcdcdc;
  padding: 50px;
  border-radius: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const Icon = styled.p`
   color: green;
   font-size: 40px; 
`;

const ThankYou = styled.h2`
  text-transform: capitalize;
  margin-top: 15px 0px;
  font-weight: 900;
  font-size: 40px;
  color:#324d67;
`;

const EmailMsg = styled.p`
  font-size: 16px;
  font-weight: 600;
  text-align: center;
`;

const Desc = styled.p`
  font-size: 16px;
  font-weight: 600;
  text-align: center;
  margin: 10px;
  margin-top: 30px;
`;

const EmailTo = styled.a`
  margin-left: 5px;
  color: #f02d34;
`;

const Button = styled.button`
    padding: 10px;
    font-weight: 600;
    cursor: pointer;
    background-color: black;
    color: white;
    margin-top: 10px;
`;

const Success = () => {
  const location = useLocation();
  const data = location.state.stripeData;
  const cart = location.state.cart;
  const email = location.state.email;
  const currentUser = useSelector((state) => state.user.currentUser);
  const [orderId, setOrderId] = useState(null);
  const dispatch = useDispatch();
  const { t } = useTranslation(["success"]);
    
    useEffect(() => {
      data && (async () => {
        try {
          const res = await publicRequest.post("/orders", {
              userId: currentUser?._id,
              products: cart.products.map((item) => ({
                productId: item._id,
                quantity: item.quantity,
                title: item.title,
                color: item.color,
                price: item.price
            })),
            amount: cart.totalPrice,
            address: data.billing_details.address,
            email
          });
          setOrderId(res.data._id);
        } catch(err) {
          console.log(err);
        };
      })();
      localStorage.clear();
      dispatch(
        clearCart()
      );
      runFireworks();
    }, [cart, data, currentUser, dispatch, email]);

  return (
    <Container>
      <Wrapper>
          <Icon>
            <ShoppingCartCheckoutIcon />
          </Icon>
          <ThankYou>{t("thank_you")}</ThankYou>
          <EmailMsg>{t("check_email")}</EmailMsg>
          <Desc>
              {t("questions")}
              <EmailTo href="mailto:ivanzlatoff@gmail.com">
                ivanzlatoff@gmail.com
              </EmailTo>  
          </Desc>
          {orderId
            ? `${t("order_created")} ${orderId.slice(-6)}`
            : `${t("preparing")}`}
          <Link to="/">
              <Button>
                  {t("go_home")}
              </Button>
          </Link>
      </Wrapper>
    </Container>
  )
}

export default memo(Success)
