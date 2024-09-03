import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import './App.css';
import Cart from './components/cart/Cart';
import Rating from './components/rating/Rating';
import RatingDetails from './components/rating/RatingDetails';
import OrderCustomer from './components/order/OrderCustomer';
import Home from './components/home/Home';
import Login from './components/login/Login';
import OrderCustomer from './components/order/OrderCustomer';
import Product from './components/product/Product';
import ProductDetails from './components/product/ProductDetails';
import Account from './components/profile/Account';
import Profile from './components/profile/Profile';
import Rating from './components/rating/Rating';
import Register from './components/register/Register';
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

   CART: '/cart',
   PRODUCT: '/product',
   PRODUCT_DETAILS: (productId) => `/product/${productId}`,
   ORDER: '/list-order',
   RATING: '/rating',
   RATING_DETAILS: (supplierId) => `/rating/${supplierId}`,
};

function App() {
   return (
      <UserProvider>
         <CartProvider>
            <BrowserRouter>
               <Header />
               <Routes>
                  <Route path={routeUrl.HOME} element={<Home />} />
                  <Route path={routeUrl.LOGIN} element={<Login />} />
                  <Route path={routeUrl.REGISTER} element={<Register />} />
                  <Route path={routeUrl.ACCOUNT} element={<Account />} />
                  <Route path={routeUrl.PROFILE} element={<Profile />} />
                  <Route path={routeUrl.PRODUCT} element={<Product />} />
                  <Route path={routeUrl.PRODUCT_DETAILS(':productId')} element={<ProductDetails />} />
                  <Route path={routeUrl.CART} element={<Cart />} />
                  <Route path={routeUrl.ORDER} element={<OrderCustomer />} />
                  <Route path={routeUrl.RATING} element={<Rating />} />
                  <Route path={routeUrl.RATING_DETAILS(':supplierId')} element={<RatingDetails />} />
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
