import { useState } from 'react';
import validator from "validator";
import SendIcon from '@mui/icons-material/Send';
import styled from 'styled-components';
import { mobile, mobileLarge, tablet, tabletSmall } from '../responsive';
import { publicRequest } from '../requestMethods';
import { toast } from 'react-hot-toast';
import { useTranslation } from "react-i18next";
import { memo } from 'react';


const Container = styled.div`
  height: 30vh;
  background-color: #fcf5f5;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  ${mobile({
    padding: '20px',
    height: '40vh'
  })}
`;

const Title = styled.h1`
  font-size: 70px;
  margin-bottom: 20px;
  ${tablet({
    fontSize: '60px'
  })};
  ${tabletSmall({
    fontSize: '36px'
  })}
  ${mobile({
    fontSize: '32px',
    marginBottom: '10px'
  })}
`;

const Description = styled.div`
  font-size: 24px;
  font-weight: 300;
  margin-bottom: 20px;
  text-align: center;
  ${mobile({ 
    marginBottom: '10px',
    fontSize: '24px',
  })}
`;

const InputContainer = styled.div`
  width: 50%;
  height: 50px;
  background-color: white;
  display: flex;
  justify-content: space-between;
  border: 1px solid lightgray;
  ${mobileLarge({ 
    width: "80%",
    height: '40px'
  })}
`;

const Input = styled.input`
  border: none;
  flex: 8;
  padding-left: 20px;
`;

const Button = styled.button`
  flex: 1;
  border: none;
  background-color: teal;
  color: white
`;

const Newsletter = () => {
  const [message, setMessage] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const { t } = useTranslation(["newsletter"])

  const validateEmail = (e) => {
    const email = e.target.value;

    if (validator.isEmail(email)) {
      setMessage("Email looks good!");
      setEmailAddress(email)
    } else {
      setMessage("Please, enter valid Email!");
    }
  };

  const handleClick = async () => {
    if (!emailAddress) return;
    try {
        await publicRequest.post("/newsletter", {email: emailAddress})
        toast.success(`${emailAddress} successfully added to our newsletter, thank you!`);
        setEmailAddress('');
    } catch(err) {
      console.log(err)
    }
  }
  return (
    <Container>
      <Title>{t("newsletter")}</Title>
      <Description className='desc'>{t("desc")}</Description>
      <InputContainer>
        <Input 
          placeholder={t("email_placeholder")}
          name='email'
          onChange={(e) => validateEmail(e)}
          value={emailAddress}
        />
        <Button onClick={() => handleClick()}>
            <SendIcon />
        </Button>
      </InputContainer>
      <h4>
        {message}
      </h4>
    </Container>
  )
}

export default memo(Newsletter);
