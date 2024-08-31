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
import Profile from './components/profile/Profile';
import ProfileCustomer from './components/profile/ProfileCustomer';
import ProfileShipper from './components/profile/ProfileShipper';
import ProfileSupplier from './components/profile/ProfileSupplier';
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
   PROFILE: '/profile',
   PROFILE_CUSTOMER: '/profile/customer',
   PROFILE_SUPPLIER: '/profile/supplier',
   PROFILE_SHIPPER: '/profile/shipper',
   PROFILE_DISTRIBUTOR: '/profile/distributor',
   PROFILE_MANUFACTURER: '/profile/manufacturer',
   PRODUCT: '/product',
   CART: '/cart',
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
                  <Route path={routeUrl.LOGIN} element={<Login />} />
                  <Route path={routeUrl.REGISTER} element={<Register />} />
                  <Route path={routeUrl.PROFILE} element={<Profile />} />
                  <Route path={routeUrl.PROFILE_CUSTOMER} element={<ProfileCustomer />} />
                  <Route path={routeUrl.PROFILE_SUPPLIER} element={<ProfileSupplier />} />
                  <Route path={routeUrl.PROFILE_SHIPPER} element={<ProfileShipper />} />
                  <Route path={routeUrl.PRODUCT} element={<Product />} />
                  <Route path={routeUrl.HOME} element={<Home />} />
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
   const hideFooter = location.pathname === '/login';

   return hideFooter ? null : <Footer />;
}

export default App;
