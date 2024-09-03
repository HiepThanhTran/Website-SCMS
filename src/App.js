import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import ChatBot from 'react-chatbotify';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import './App.css';
import WrappedCart from './components/cart/Cart';
import Home from './components/home/Home';
import Login from './components/login/Login';
import Order from './components/order/Order';
import OrderSupplier from './components/order/OrderSupplier';
import Product from './components/product/Product';
import ProductDetails from './components/product/ProductDetails';
import Account from './components/profile/Account';
import Profile from './components/profile/Profile';
import Rating from './components/rating/Rating';
import RatingDetails from './components/rating/RatingDetails';
import Register from './components/register/Register';
import { ChatBotFlow, ChatBoxSettings } from './configs/ChatBotConfigs';
import Footer from './layout/footer/Footer';
import Header from './layout/header/Header';
import { CartProvider } from './store/contexts/CartContext';
import { UserProvider } from './store/contexts/UserContext';

export const routeUrl = {
   HOME: '/',
   LOGIN: '/login',
   REGISTER: '/register',
   ACCOUNT: '/users',
   PROFILE: '/users/profile',
   ORDER_CUSTOMER: '/orders-customer',
   CART: '/cart',

   ORDER_SUPPLIER: '/orders-supplier',

   PRODUCT: '/products',
   PRODUCT_DETAILS: (productId) => `/products/${productId}`,
   RATING: '/ratings',
   RATING_DETAILS: (supplierId) => `/ratings/${supplierId}`,
};

function App() {
   return (
      <UserProvider>
         <CartProvider>
            <BrowserRouter>
               <ChatBot flow={ChatBotFlow} settings={ChatBoxSettings} />
               <Header />
               <Routes>
                  <Route path={routeUrl.HOME} element={<Home />} />
                  <Route path={routeUrl.LOGIN} element={<Login />} />
                  <Route path={routeUrl.REGISTER} element={<Register />} />
                  <Route path={routeUrl.ACCOUNT} element={<Account />} />
                  <Route path={routeUrl.PROFILE} element={<Profile />} />
                  <Route path={routeUrl.ORDER_CUSTOMER} element={<Order />} />
                  <Route path={routeUrl.CART} element={<WrappedCart />} />
                  <Route path={routeUrl.PRODUCT} element={<Product />} />
                  <Route path={routeUrl.PRODUCT_DETAILS(':productId')} element={<ProductDetails />} />
                  <Route path={routeUrl.RATING} element={<Rating />} />
                  <Route path={routeUrl.RATING_DETAILS(':supplierId')} element={<RatingDetails />} />
                  <Route path={routeUrl.ORDER_SUPPLIER} element={<OrderSupplier />} />
               </Routes>
               <ConditionalFooter />
            </BrowserRouter>
         </CartProvider>
      </UserProvider>
   );
}

function ConditionalFooter() {
   const location = useLocation();
   const hideFooter =
      location.pathname === routeUrl.LOGIN ||
      location.pathname === routeUrl.REGISTER ||
      location.pathname === routeUrl.CART;

   return hideFooter ? null : <Footer />;
}

export default App;
