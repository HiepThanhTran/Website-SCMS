import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { createContext, useEffect, useReducer } from 'react';
import cookie from 'react-cookies';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import './App.css';
import Cart from './components/cart/Cart';
import Home from './components/home/Home';
import Login from './components/login/Login';
import Product from './components/product/Product';
import ProductDetail from './components/product/ProductDetail';
import Account from './components/profile/Account';
import Profile from './components/profile/Profile';
import Register from './components/register/Register';
import Footer from './layout/footer/Footer';
import Header from './layout/header/Header';
import MyCartReducer from './reducer/MyCartReducer';
import { UserProvider } from './store/contexts/UserContext';

export const MyCartContext = createContext();

export const routeUrl = {
   HOME: '/',
   LOGIN: '/login',
   REGISTER: '/register',
   ACCOUNT: (username) => `/users/${username}`,
   PROFILE: (username) => `/users/${username}/profile`,

   CART: '/cart',
   PRODUCT: '/product',
   PRODUCT_DETAIL: (productId) => `/product/${productId}`,
};

function App() {
   const [cartCounter, cartDispatch] = useReducer(MyCartReducer, cookie.load('cartCounter') || 0);

   useEffect(() => {
      cookie.save('cartCounter', cartCounter);
   }, [cartCounter]);

   return (
      <UserProvider>
         <MyCartContext.Provider value={[cartCounter, cartDispatch]}>
            <BrowserRouter>
               <Header />
               <Routes>
                  <Route path={routeUrl.HOME} element={<Home />} />
                  <Route path={routeUrl.LOGIN} element={<Login />} />
                  <Route path={routeUrl.REGISTER} element={<Register />} />
                  <Route path={routeUrl.ACCOUNT(':username')} element={<Account />} />
                  <Route path={routeUrl.PROFILE(':username')} element={<Profile />} />
                  <Route path={routeUrl.PRODUCT} element={<Product />} />
                  <Route path={routeUrl.PRODUCT_DETAIL(':productId')} element={<ProductDetail />} />
                  <Route path={routeUrl.CART} element={<Cart />} />
               </Routes>
               <ConditionalFooter />
            </BrowserRouter>
         </MyCartContext.Provider>
      </UserProvider>
   );
}

function ConditionalFooter() {
   const location = useLocation();
   const hideFooter = location.pathname === routeUrl.LOGIN || location.pathname === routeUrl.REGISTER;

   return hideFooter ? null : <Footer />;
}

export default App;
