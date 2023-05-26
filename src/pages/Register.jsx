import { useState } from 'react';
import styled from "styled-components";
import { mobileLarge, tablet, tabletSmall } from "../responsive";
import { Link, useNavigate } from 'react-router-dom';
import { publicRequest } from '../requestMethods';
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from 'react-hot-toast';


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
    width: 40%;
    padding: 20px;
    background-color: lightgray;
    opacity: 0.9;
    text-align: center;
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
    flex-direction: column;
    justify-content: center;
`;

const Title = styled.h1`
    font-size: 24ps;
    font-weight: 300;
`;

const Input = styled.input`
    flex: 1;
    min-width: 40%;
    margin: 20px 10px 0 0;
    padding: 10px;
`;

const Agrrement = styled.span`
    font-size: 12px;
    margin: 20px 0px;
`;

const Button = styled.button`
    width: 100%;
    border: none;
    padding: 15px 20px;
    background-color: teal;
    color: white;
    cursor: pointer;
    &:hover {
        background-color: #4e8773;
    };
    &:disabled {
        cursor: not-allowed;
    };
    ${mobileLarge({
        padding: '10px',
    })}
`;

const Div = styled.div`
    margin-top: 15px;
`;

const Guest = styled.h4`
    font-size: 16px;
    fonr-weight: 900;
`;

const Register = () => {
    const [name, setName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { t } = useTranslation("register");
    const match = password === passwordConfirm;
    const navigate = useNavigate();
    
    const onSubmit = async (data) => {
        try {
            const res = await publicRequest.post("/auth/register", {
                username,
                email,
                password,
            });
            if (res.status === 201 ) {
                setName('');
                setLastName('');
                setEmail('');
                setUsername('');
                setPassword('');
                setPasswordConfirm('');
                toast.success(`${t("registration_confirmation")}`);
                navigate('/login');
            };
        } catch(err) {
            toast.error(err.response.data.error);
        }
    };

  return (
    <Container>
      <Wrapper>
        <Title>{t("create_account")}</Title>
        <Link to="/">
            <Guest>{t("as_guest")}</Guest>
        </Link>
        <Form onSubmit={handleSubmit(onSubmit)}>
            <Input
                {...register('name', { maxLength: 20 })} 
                type="text"
                name='name'
                value={name}
                placeholder={t("name_placeholder")}
                onChange={(e) => setName(e.target.value)}
            />
            {errors.name && <p style={{ color: 'red' }}>{t("first_name_check")}</p>}
            <Input
                {...register('lastName', { maxLength: 20 })} 
                type="text"
                name='lastName'
                value={lastName}
                placeholder={t("lastname_placeholder")}
                onChange={(e) => setLastName(e.target.value)} 
            />
            {errors.lastName && <p style={{ color: 'red' }}>{t("check_lastname")}</p>}
            <Input
                {...register('email', 
                { 
                    required: 'This is required',
                    pattern: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ 
                })} 
                name='email'
                value={email}
                placeholder={t("email_placeholder")}
                onChange={(e) => setEmail(e.target.value)} 
            />
            {errors.email && <p style={{ color: 'red' }}>{t("check_email")}</p>}
            <Input
                {...register('username', { 
                    required: 'This is required',
                })} 
                type="text"
                name='username'
                value={username}
                placeholder={t("username_placeholder")}
                onChange={(e) => setUsername(e.target.value)} 
            />
            {errors.username && <p style={{ color: 'red' }}>{t("check_username")}</p>}
            <Input
                {...register('password', { 
                    required: 'This is required',
                    pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,15}$/
                })} 
                type="password"
                name='password'
                value={password}
                placeholder={t("password_placeholder")}
                onChange={(e) => setPassword(e.target.value)} 
            />
            {errors.password && <p style={{ color: 'red' }}>{t("check_password")}</p>}
            <Input
                {...register('passwordConfirm', {
                    required: 'This is required',
                    pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,15}$/
                })} 
                type="password"
                name='passwordConfirm'
                value={passwordConfirm}
                placeholder={t("confirm_password_placeholder")}
                onChange={(e) => setPasswordConfirm(e.target.value)} 
            />
            {match
                ? password && <Div style={{ color: 'green' }}>{t("passwords_match")}</Div>
                : password && <Div style={{ color: 'red' }}>{t("passwords_not_match")}</Div>}
            <Agrrement>
                {t("agreement")} <b>{t("privacy_policy")}</b>
            </Agrrement>
            <Button type='submit' disabled={!email || !username || !password || !passwordConfirm || errors.length > 0 || !match}>{t("create")}</Button>
        </Form>
            <Div>
                {t("have_account")}
                <Link 
                    to="/login" 
                    style={{ marginLeft: 10 }}
                >
                    {t("sign_in")}
                </Link>
            </Div>
      </Wrapper>
    </Container>
  )
}

export default Register
