import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate 
} from "react-router-dom";
import './App.css';
import Home from './pages/Home';
import ProductList from './pages/ProductList';
import Product from './pages/Product';
import Register from './pages/Register';
import Login from './pages/Login';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import Search from './pages/Search';
import Success from './pages/Success';
import { Toaster } from 'react-hot-toast';
import { useSelector } from "react-redux";
import React, { Suspense } from 'react';
import Contact from "./components/contact/Contact";
import ScrollToTop from "./components/ScrollToTop";


const App = () => {
  const user = useSelector(state => state.user.currentUser);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Router>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/products/:category" element={<ProductList />} />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/product_search/:type" element={<Search />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/success" element={<Success />} />
          <Route path="/login" element={user ? <Navigate  to="/" /> : <Login />} />
          <Route path="/register" element={user ? <Navigate  to="/" /> : <Register />} />
          <Route path="/logout" element={<Navigate to="/" />} />
          <Route path="/contact_us" element={<Contact />} />
        </Routes>
        <Toaster />
        <ScrollToTop />
      </Router>
    </Suspense>    
  );
};

export default App;
