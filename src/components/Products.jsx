import { useEffect, useState } from 'react';
import styled from 'styled-components';
import Product from './Product';
import axios from 'axios';
import { memo } from 'react';

const Container = styled.div`
  padding: 20px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
`

const Products = ({ category, filters, sort }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    let ignore = false;

    (async () => {
      try {
        const res = await axios.get(
          category 
            ? `https://dark-tan-yak-garb.cyclic.app/api/products?category=${category}` 
            : 'https://dark-tan-yak-garb.cyclic.app/api/products'
          );
        !ignore && setProducts(res.data);
      } catch(err) {
        console.log(err);
      }
    })();

    return () => {
      ignore = true;
    };
  }, [category]);

  useEffect(() => {
    category &&
      setFilteredProducts(
        products.filter((item) => 
          Object.entries(filters).every(([key, value]) => 
            item[key].includes(value),
          )
        )
      );
  }, [products, category, filters]);

  useEffect(() => {
    if (sort === 'Newest') {
      setFilteredProducts((prev) => 
        [...prev].sort((a, b) => a.createdAt - b.createdAt)
      );
    } else if (sort === 'asc') {
      setFilteredProducts((prev) => 
        [...prev].sort((a, b) => a.price - b.price)
      );
    } else {
      setFilteredProducts((prev) =>
        [...prev].sort((a, b) => b.price - a.price)
      )
    }
  }, [sort])

  return (
    <Container>
      {category 
        ? filteredProducts.map(item => (<Product item={item} key={item._id}/>)) 
        : products.map(item => (<Product item={item} key={item._id}/>))}
    </Container>
  )
}

export default memo(Products)
