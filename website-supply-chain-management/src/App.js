import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./layout/header/Header";
import Footer from "./layout/footer/Footer";
import Home from "./components/home/Home";
import Order from "./components/order/Order"
import "bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/order" element={<Order/>} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;