import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./layout/header/Header";
import Footer from "./layout/Footer";
import Home from "./components/Home";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./App.css";

function App() {
  return (
      <BrowserRouter>
        <Header />
        <Routes>
            <Route path="/home" element={<Home />} />
        </Routes>
        <Footer />
      </BrowserRouter>
  );
}

export default App;