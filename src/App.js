import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { createContext, useEffect, useReducer } from 'react';
import cookie from 'react-cookies';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import './App.css';
import Cart from './components/cart/Cart';
import Rating from './components/rating/Rating';
import OrderCustomer from './components/order/OrderCustomer';
import Home from './components/home/Home';
import Login from './components/login/Login';
import Product from './components/product/Product';
import Profile from './components/profile/Profile';
import ProfileCustomer from './components/profile/ProfileCustomer';
import ProfileShipper from './components/profile/ProfileShipper';
import ProfileSupplier from './components/profile/ProfileSupplier';
import ProductDetail from './components/product/ProductDetail';
import Register from './components/register/Register';
import Footer from './layout/footer/Footer';
import Header from './layout/header/Header';
import MyCartReducer from './reducer/MyCartReducer';
import { UserProvider } from './store/contexts/UserContext';

export const MyCartContext = createContext();

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
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/profile/customer" element={<ProfileCustomer />} />
                  <Route path="/profile/supplier" element={<ProfileSupplier />} />
                  <Route path="/profile/shipper" element={<ProfileShipper />} />
                  <Route path="/product" element={<Product />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/list-order" element={<OrderCustomer />} />
                  <Route path="/rating" element={<Rating />} />
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
