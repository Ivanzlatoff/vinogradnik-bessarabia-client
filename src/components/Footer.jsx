import styled from "styled-components";
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import PinterestIcon from '@mui/icons-material/Pinterest';
// import PlaceIcon from '@mui/icons-material/Place';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { mobile, mobileLarge, tabletMiddle } from "../responsive";
import { memo } from "react";


const Container = styled.div`
    display: flex;
    ${tabletMiddle({ flexDirection: "column"})}
`;

const Left = styled.div`
    background-color: teal;
    color: #fff;
    display: flex;
    flex: 1;
    flex-direction: column;
    padding: 20px;
    margin: 20px;
    -webkit-box-shadow: 0px 0px 15px -10px rgba(0, 0, 0, 0.75);
    box-shadow: 0px 0px 15px -10px rgba(0, 0, 0, 0.75);
`;

const Logo = styled.h1`

`;

const Desc = styled.p`
    margin: 20px 0px;
    text-align: justify
`;

const SocialContainer = styled.div`
    display: flex;
`;

const SocialIcon = styled.div`
    width: 40px;
    height: 40px;
    border-radius: 50%;
    color: white;
    background-color: #${props => props.color};
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 20px;
`;

const Center = styled.div`
    background-color: teal;
    color: #fff;
    flex: 1;
    padding: 20px;
    margin: 20px;
    -webkit-box-shadow: 0px 0px 15px -10px rgba(0, 0, 0, 0.75);
    box-shadow: 0px 0px 15px -10px rgba(0, 0, 0, 0.75);
`;

const Title = styled.h3`
    margin-bottom: 30px;
`;

const List = styled.ul`
    margin: 0;
    padding: 0;
    list-style: none;
    display: flex;
    flex-wrap: wrap;
    ${mobile({
        flexDirection: 'column'
    })}
`;

const ListItem = styled.li`
    width: 50%;
    margin-bottom: 10px;
`;

const Right = styled.div`
    background-color: teal;
    color: #fff;
    flex: 1;
    padding: 20px;
    ${mobileLarge({
        backgroundColor: '#fff8f8'
    })}
    margin: 20px;
    -webkit-box-shadow: 0px 0px 15px -10px rgba(0, 0, 0, 0.75);
    box-shadow: 0px 0px 15px -10px rgba(0, 0, 0, 0.75);
`;

const ContactItem = styled.div`
    margin-top: 20px;
    display: flex;
    align-items: center
`;

const Payment = styled.img`
    width: 50%;
    margin-top: 20px;
`;


const Footer = () => {
    const { t } = useTranslation(["footer"]);

  return (
    <Container>
      <Left>
        <Logo>{t("logo")}</Logo>
        <Desc>{t("desc")}</Desc>
        <SocialContainer>
            <SocialIcon color='3B5999'>
                <FacebookIcon />
            </SocialIcon>
            <SocialIcon color='E4405F'>
                <InstagramIcon />
            </SocialIcon>
            <SocialIcon color='55ACEE'>
                <TwitterIcon />
            </SocialIcon>
            <SocialIcon color='E60023'>
                <PinterestIcon />
            </SocialIcon>
        </SocialContainer>
      </Left>
      <Center>
        <Title>{t("links")}</Title>
        <List>
            <ListItem>
                <Link to="/" style={{ textDecoration: 'none', color: 'white' }}>
                    {t("home")}
                </Link>
            </ListItem>
            <ListItem>
                <Link to="/cart" style={{ textDecoration: 'none', color: 'white' }}>
                    {t("cart")}
                </Link>
            </ListItem>
            <ListItem>
                <Link to="/" style={{ textDecoration: 'none', color: 'white' }}>
                    {t("products")}
                </Link>
            </ListItem>
            <ListItem>{t("my_account")}</ListItem>
            <ListItem>{t("order_tracking")}</ListItem>
            <ListItem>{t("wishlist")}</ListItem>
            <ListItem>{t("terms")}</ListItem>
        </List>
      </Center>
      <Right>
        <Title>{t("contact")}</Title>
        <Link 
            to="/contact_us"
            style={{
                color: 'white',
            }}
        >
            {t("send_message")}
        </Link>
        {/* <ContactItem><PlaceIcon style={{ marginRight: '10px'}}/>{t("address")}</ContactItem> */}
        <ContactItem><PhoneIcon style={{ marginRight: '10px'}} type="tel"/> +38 (096) 104 07 13</ContactItem>
        <ContactItem><EmailIcon style={{ marginRight: '10px'}}/> ivanzlatoff@gmail.com </ContactItem>
        <Payment src='https://i.ibb.co/Qfvn4z6/payment.png'/>
      </Right>
    </Container>
  )
}

export default memo(Footer)
