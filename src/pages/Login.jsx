import styled from "styled-components";
import { mobile, mobileLarge, tablet, tabletSmall } from "../responsive";
import { useState } from "react";
import { login } from "../redux/apiCalls";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import bcrypt from 'bcryptjs';

const Container = styled.div`
    width: 100vw;
    height: 100vh;
    background-image:  linear-gradient(
        rgba(255, 255, 255, 0.5), 
        rgba(255, 255, 255, 0.5)
        ),
        url("https://firebasestorage.googleapis.com/v0/b/shop-80015.appspot.com/o/grape-icon.png?alt=media&token=edb90e89-ed75-4e1d-b172-d92fdaba92bb");
    background-repeat: no-repeat;
    background-size: contain;
    background-position: 50% 0;
    background-color: lightgray;
    display: flex;
    align-items: center;
    justify-content: center;
    ${tablet({
        backgroundSize: 'cover'
    })}
`;

const Wrapper = styled.div`
    width: 25%;
    padding: 20px;
    background-color: lightgray;
    opacity: 0.9;
    ${tablet({
        width: '50%',
        textAlign: 'center',       
    })};
    ${tabletSmall({
        width: '75%'
    })};
`;
const Form = styled.form`
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    ${mobile({
        justifyContent: 'center',
    })}
`;

const Title = styled.h1`
    font-size: 24px;
    font-weight: 300;
`;

const Guest = styled.h4`
    font-size: 16px;
    fonr-weight: 900;
`;

const Input = styled.input`
    width: 100%;
    margin: 10px 0;
    padding: 10px;
`;

const Button = styled.button`
    width: 100%;
    border: none;
    padding: 15px 20px;
    background-color: teal;
    color: white;
    cursor: pointer;
    margin-bottom: 10px;
    &:hover {
        background-color: #4e8773;
    }
    &:disabled {
        cursor: not-allowed;
    };
    ${mobileLarge({
        padding: '10px',
    })}
`;

const Error = styled.span`
    color: red;
`;

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const { isFetching, error } = useSelector((state) => state.user);
    const { register, handleSubmit, formState: { errors } } = useForm();
    const salt = bcrypt.genSaltSync(10);

    const onSubmit = (data, e) => {
        e.preventDefault();
        const hashedPassword = bcrypt.hashSync(password, salt)
        login(dispatch, { username, hashedPassword });
    };  

    const { t } = useTranslation(["login"]);

  return (
    <Container>
      <Wrapper>
        <Title>{t("sign_in")}</Title>
        <Link to="/">
            <Guest>{t("as_guest")}</Guest>
        </Link>
        <Form onSubmit={handleSubmit(onSubmit)}>
            <Input 
                {...register('username', { 
                    required: 'This is required',
                })}  
                id="username"               
                placeholder={t("username")} 
                onChange={(e)=>setUsername(e.target.value)}
            />
            {errors.username && <p style={{ color: 'red' }}>{t("check_username")}</p>}
            <Input 
                {...register('password', { 
                    required: 'This is required',
                })} 
                placeholder={t("password")} 
                type='password'
                autoComplete="current-password"
                onChange={(e)=>setPassword(e.target.value)}
            />
            {errors.password && <p style={{ color: 'red' }}>{t("check_password")}</p>}
            <Button type="submit" disabled={isFetching || errors.length > 0 || !username || !password}>{t("login")}</Button>
            {error && <Error>{t("wrong")}</Error>}
            <Link
                style={{
                    margin: "5px 0px",
                    fontSize: "12px",
                    textDecoration: "underline",
                    cursor: "pointer",
                }}
            >
                {t("not_remember_password")}
            </Link>
            <Link 
                style={{
                    margin: "5px 0px",
                    fontSize: "12px",
                    textDecoration: "underline",
                    cursor: "pointer",
                }}
                to="/register"
            >
                {t("create_new")}
            </Link>
        </Form>
      </Wrapper>
    </Container>
  )
}

export default Login
