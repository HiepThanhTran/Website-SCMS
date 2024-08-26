import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { createContext, useReducer } from "react";
import cookie from "react-cookies";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import Home from "./components/home/Home";
import Login from "./components/login/Login";
import Product from "./components/product/Product";
import Profile from "./components/profile/Profile";
import Register from "./components/register/Register";
import Footer from "./layout/footer/Footer";
import Header from "./layout/header/Header";
import MyUserReducer from "./reducer/MyUserReducer";

export const MyUserContext = createContext();

function App() {
	const [user, dispatch] = useReducer(
		MyUserReducer,
		cookie.load("user") || null
	);

	return (
		<MyUserContext.Provider value={[user, dispatch]}>
			<BrowserRouter>
				<Header />
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/login" element={<Login />} />
					<Route path="/register" element={<Register />} />
					<Route path="/profile" element={<Profile />} />
					<Route path="/product" element={<Product />} />
				</Routes>
				<ConditionalFooter />
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
