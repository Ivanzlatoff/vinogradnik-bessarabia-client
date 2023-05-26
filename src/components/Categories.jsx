import { categories_en, categories_ua, categories_ru } from '../data';
import styled from 'styled-components';
import CategoryItem from './CategoryItem';
import { mobile } from '../responsive';
import { memo } from 'react';


const Container = styled.div`
  padding: 20px;
  display: flex;
  flex-wrap: wrap;  
  justify-content: space-between;
  ${mobile({
    flexDirection: 'column'
  })}
`;

const Categories = () => {
  const lang = localStorage.getItem("i18nextLng");
  const categories = lang === 'ua' 
    ? categories_ua 
    : lang === 'ru'
      ? categories_ru
      : categories_en
  
      return (
    <Container>
      {categories.map(item => (<CategoryItem item={item} key={item.id} />))}
    </Container>
  )
}

export default memo(Categories);
