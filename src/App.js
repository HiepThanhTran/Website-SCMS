import "bootstrap";
import Profile from "./components/profile/Profile";
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

	// Theo dõi sự thay đổi của cartCounter và lưu nó vào cookie
	useEffect(() => {
		cookie.save("cartCounter", cartCounter);
	}, [cartCounter]);

	return (
		<MyUserContext.Provider value={[user, dispatch]}>
			<BrowserRouter>
				<MyCartContext.Provider value={[cartCounter, cartDispatch]}>
					<Header />
					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="/login" element={<Login />} />
						<Route path="/register" element={<Register />} />
						<Route path="/profile" element={<Profile />} />
						<Route path="/product" element={<Product />} />
						<Route path="/cart" element={<Cart />} />
					</Routes>
					<ConditionalFooter />
				</MyCartContext.Provider>
			</BrowserRouter>
		</MyUserContext.Provider>
	);
}

function ConditionalFooter() {
	const location = useLocation();
	const hideFooter = location.pathname === "/login";

	return hideFooter ? null : <Footer />;
}

export default App;