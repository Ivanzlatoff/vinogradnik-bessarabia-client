import { useState } from "react";
import { useSelector } from "react-redux";
import "./contact.css";
import { useForm } from "react-hook-form";
import { publicRequest } from "../../requestMethods";
import { Link } from "react-router-dom";
import Navbar from "../Navbar";
import { useTranslation } from "react-i18next";


const Contact = () => {
  const [ inputs, setInputs ] = useState({});
  const user = useSelector(state => state.user.currentUser);
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [isFetching, setIsFetching] = useState(false);
  const [messageReceived, setMessageReceived ] = useState(false);
  const { t } = useTranslation(["contact"])

  const handleChange = (e) => {
    setInputs(prev => {
      return {...prev, [e.target.name]: e.target.value}
    })
  };

  const onSubmit = async (data) => {
    setIsFetching(true)
    try {
      const res = await publicRequest.post("./notifications", {
        userId: user?._id,
        username: user?.username,
        email: inputs['email'],
        isAdmin: user?.isAdmin,
        title: inputs['personTitle'],
        firstName: inputs['firstName'],
        lastName: inputs['lastName'],
        telephone: inputs['telephone'],
        subject: inputs['subject'],
        message: inputs['message'],
      });
      if (res.data) {
        setIsFetching(false)
        setMessageReceived(true)
      }
      setInputs({});
    } catch(err) {
      console.log(err)
      setIsFetching(false)
    }
  };

  let content

  const lang = localStorage.getItem("i18nextLng");
  const english = lang === 'en'

  if (!messageReceived) {
    content = 
      <form className="contactForm" onSubmit={handleSubmit(onSubmit)}>
        <h1 className="messageTitle">{t("get_in_touch")}</h1>
        <div className="formField">
          <label htmlFor="personTitle">{t("title")}</label>
          <select 
            {...register('personTitle', {
              required: 'This is required'
            })}
            name="personTitle" 
            onChange={handleChange}
            defaultValue={'default'}
          >
            <option value="default" disabled>{t("choose_here")}</option>
            <option value="Mr">{t("mr")}</option>
            <option value="Mrs">{t("mrs")}</option>
            {english && <option value="Miss">{t("miss")}</option>}
            {english && <option value="Ms">{t("ms")}</option>}
          </select>
          {errors.personTitle && <p style={{ color: 'red' }}>{t("please_check_the_title")}</p>}
        </div>
        <div className="formField">
          <label htmlFor="firstName">{t("first_name")}</label>
          <input 
            {...register('firstName', { 
              maxLength: 20,
              required: 'This is required'
            })}
            name="firstName"
            value={inputs['firstName']}
            type="text" 
            id="firstName" 
            placeholder={t("john")} 
            onChange={handleChange} 
          />
          {errors.firstName && <p style={{ color: 'red' }}>{t("please_check_the_first_name")}</p>}
        </div>
        <div className="formField">
          <label htmlFor="lastName">{t("last_name")}</label>
          <input 
            {...register('lastName', { 
              maxLength: 20,
              required: 'This is required'
            })}
            name="lastName"
            value={inputs['lastName']}
            type="text" 
            id="lastName" 
            placeholder={t("doe")} 
            onChange={handleChange} 
          />
          {errors.lastName && <p style={{ color: 'red' }}>{t("please_check_the_last_name")}</p>}
        </div>
        <div className="formField">
          <label htmlFor="telephone">{t("your_telephone_number")}</label>
          <input 
            {...register('telephone', {
              pattern: /^[+]?(8|38)?(-|\s)?0(50|55|63|66|67|68|91|92|93|96|97|98|99)(-|\s)?((\d{3}(-|\s)?\d{2}(-|\s)?\d{2}(-|\s)?)|(\d{2}(-|\s)?\d{3}(-|\s)?\d{2}(-|\s)?)|(\d{2}(-|\s)?\d{2}(-|\s)?\d{3}(-|\s)?))$/
            })}
            name="telephone"
            value={inputs['telephone']}
            type="tel"
            id="telephone"
            placeholder="+38-098-1234567"
            inputMode="numeric"
            autoComplete="tel"
            onChange={handleChange}
          />
          {errors.telephone && <p style={{ color: 'red' }}>{t("please_check_your_telephone_number")} {`${errors.telephone}`}</p>}
        </div>
        <div className="formField">
            <label htmlFor="email">{t("email")}</label>
            <input 
              {...register('email', {
                required: 'This is required',
                pattern: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
              })}
              name="email"
              value={inputs['email']}
              placeholder={t("email_example")}
              onChange={handleChange}
            />
            {errors.email && <p style={{ color: 'red' }}>{t("please_check_your_email")} {`${errors.email}`}</p>}
        </div>
        <div className="formField">
          <label htmlFor="subject">{t("subject")}</label>
          <input 
            {...register('subject', {
              required: 'This is required'
            })}
            name="subject"
            type="text" 
            id="subject" 
            placeholder={t("subject")} 
            onChange={handleChange} 
          />
          {errors.subject && <p style={{ color: 'red' }}>{t("please_enter_the_subject")}</p>}
        </div>
        <div className="formField">
          <label htmlFor="message">{t("your_message")}:</label>
          <textarea 
            {...register('message', {
              required: 'This is required'
            })}
            name="message" 
            type="text" 
            placeholder={t("start_typing")} 
            onChange={handleChange} 
          />
          {errors.message && <p style={{ color: 'red' }}>{t("please_enter_your_message")}</p>}
        </div>
        <button type='submit' disabled={isFetching}>{t("submit")}</button>
      </form>
  } else {
    content = 
      <div className="msgSent">
        <h1>{t("thanks_for_your_message")}</h1>
        <Link to="/" className="homeLink">
          <button className="homeButton">
            {t("got_to_home_page")}
          </button>
        </Link>
      </div>
  }

  return (
    <>
      <Navbar />
      <div className="container">
        {content}
      </div>
    </>
  )
}

export default Contact
