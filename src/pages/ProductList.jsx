import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import Navbar from '../components/Navbar';
import Announcement from '../components/Announcement';
import Products from '../components/Products';
import Newsletter from '../components/Newsletter';
import Footer from '../components/Footer';
import { mobile, tabletSmall, mobileLarge, tabletMiddle } from '../responsive';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { memo } from 'react';
import { categories_en, categories_ua, categories_ru } from '../data';


const Container = styled.div``

const TitleWrapper = styled.div`
    display: flex;
    justify-content: center;
    ${tabletSmall({ marginTop: '10px' })}
`

const Title = styled.h1`
    margin: 20px;
	box-shadow: ${props => props.isActive && '0px 0px 0px 2px #9fb4f2'};
	background-color: #${props => props.isActive && 'A6BE47'};
	border-radius:10px;
    padding: 2px 20px;
	border: ${props => props.isActive && '1px solid navy'};
    cursor: pointer;
    &:hover{
        background-color: #e9f5f5;
        transform: scale(1.1);
    };
  ${tabletMiddle({ 
    fontSize: '36px',
    margin: '0px',
    padding: '1px 10px'
  })}
  ${tabletSmall({ 
    fontSize: '30px',
    margin: '0px',
    padding: '1px 10px'
  })}
  ${mobileLarge({ 
    fontSize: '16px',
    margin: '0px',
    padding: '1px 10px'
  })}
  ${mobile({ 
    fontSize: '16px',
    margin: '0px',
    padding: '1px 10px'
  })}
`

const FilterContainer = styled.div`
    display: flex;
    justify-content: space-between;
    ${mobile({
        display: 'flex',
        flexDirection: 'column',
    })}
`
const Filter = styled.div`
    margin: 20px;
    ${mobile({ margin: '0 20px', display: 'flex', flexDirection: 'column'})};
    ${tabletMiddle({
        display: 'flex',
        flexDirection: 'column',
    })}
`

const FilterText = styled.span`
    font-size: 20px;
    font-weight: 600;
    margin-right: 20px;
    ${mobile({ margin: '0'})};
`

const Select = styled.select`
    padding: 10px;
    margin-right: 20px;
    ${mobile({ margin: '10px 0'})};
    ${tabletMiddle({
        marginTop: '10px'
    })}
`

const Option = styled.option`

`;

const ProductList = () => {
    const location = useLocation();
    const category = location.pathname.split("/")[2];
    const [filters, setFilters] = useState({});
    const [sort, setSort] = useState('newest');
    const { t } = useTranslation("productList");

    const lang = localStorage.getItem("i18nextLng");
    const categories = lang === 'ua' 
        ? categories_ua 
        : lang === 'ru'
        ? categories_ru
        : categories_en

    const handleFilters = (e) => {
        const value = e.target.value;
        value === "all" 
            ? setFilters({})
            : setFilters({
                ...filters,
                [e.target.name]: value.toLowerCase()
            });
    };

  return (
    <Container>
      <Navbar />
      <Announcement />
      <TitleWrapper>
        {categories.map(item => 
            <Link 
                to={`/products/${item.category}`} 
                style={{ 
                    textDecoration: 'none',
                    color: 'black'
                }}
                key={item.id}
            >
                <Title 
                    isActive={item.category === category}
                    >
                    {item.title}
                </Title>
            </Link>)}
      </TitleWrapper>
      <FilterContainer>
        <Filter>
            <FilterText>{t("filter_products")} </FilterText>
            <Select name='color' onChange={handleFilters} defaultValue='Color'>
                <Option disabled>
                    {t("color")}
                </Option>
                <Option value="red">{t("red")}</Option>
                <Option value="white">{t("white")}</Option>
                <Option value="all">{t("all")}</Option>
            </Select>
            <Select name='type' onChange={handleFilters} defaultValue='Type'>
                <Option disabled>
                    {t("type")}
                </Option>
                <Option value="isabella">{t("isabella")}</Option>
                <Option value="odessky cherny">{t("odesskiy_cherniy")}</Option>
                <Option value="merlot">{t("merlot")}</Option>
                <Option value="cabernet sauvignon">{t("kabernet")}</Option>
                <Option value="all">{t("all")}</Option>
            </Select>
        </Filter>
        <Filter>
            <FilterText>{t("sort_products")} </FilterText>
            <Select onChange={(e) => setSort(e.target.value)} defaultValue='newest'>
                <Option value='newest'>{t("newest")}</Option>
                <Option value='asc'>{t("price")} ({t("asc")})</Option>
                <Option value='desc'>{t("price")} ({t("desc")})</Option>
            </Select>
        </Filter>
      </FilterContainer>
      <Products category={category} filters={filters} sort={sort}/>
      <Newsletter />
      <Footer />
    </Container>
  )
}

export default memo(ProductList)
