import "bootstrap";
import Profile from "./components/profile/Profile";
import ProfileCustomer from "./components/profile/ProfileCustomer";
import ProfileSupplier from "./components/profile/ProfileSupplier";
import ProfileShipper from "./components/profile/ProfileShipper";
import Product from "./components/product/Product";
import Cart from "./components/cart/Cart";
import "bootstrap/dist/css/bootstrap.min.css";
import { createContext, useReducer, useEffect } from "react";
import cookie from "react-cookies";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import Home from "./components/home/Home";
import Login from "./components/login/Login";
import Register from "./components/register/Register";
import Footer from "./layout/footer/Footer";
import Header from "./layout/header/Header";
import MyUserReducer from "./reducer/MyUserReducer";
import MyCartReducer from "./reducer/MyCartReducer";

export const MyUserContext = createContext();
export const MyCartContext = createContext();

function App() {
	const [user, dispatch] = useReducer(
		MyUserReducer,
		cookie.load("user") || null
	);

	const [cartCounter, cartDispatch] = useReducer(
		MyCartReducer,
		cookie.load("cartCounter") || 0
	);

	useEffect(() => {
		cookie.save("cartCounter", cartCounter);
	}, [cartCounter]);

	return (
		<BrowserRouter>
			<MyUserContext.Provider value={[user, dispatch]}>
				<MyCartContext.Provider value={[cartCounter, cartDispatch]}>
					<Header />
					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="/login" element={<Login />} />
						<Route path="/register" element={<Register />} />
						<Route path="/profile" element={<Profile />} />
						<Route path="/profilecustomer" element={<ProfileCustomer />} />
						<Route path="/profilesupplier" element={<ProfileSupplier />} />
						<Route path="/profileshipper" element={<ProfileShipper />} />
						<Route path="/product" element={<Product />} />
						<Route path="/cart" element={<Cart />} />
					</Routes>
					<ConditionalFooter />
				</MyCartContext.Provider>
			</MyUserContext.Provider>

		</BrowserRouter>
	);
}

function ConditionalFooter() {
	const location = useLocation();
	const hideFooter = location.pathname === "/login";

	return hideFooter ? null : <Footer />;
}

export default App;