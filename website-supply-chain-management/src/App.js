import { createContext, useReducer } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Header from "./layout/header/Header";
import Footer from "./layout/footer/Footer";
import Home from "./components/home/Home";
import Order from "./components/order/Order";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import MyUserReducer from "./reducer/MyUserReducer";
import Login from "./components/login/Login";
import cookie from "react-cookies";
import Register from "./components/register/Register";
import Profile from "./components/profile/Profile";

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
          <Route path="/order" element={<Order />} />
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