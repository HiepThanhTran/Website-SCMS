import { Link, useLocation } from "react-router-dom";
import "./Header.css";
import { Navbar, Container, Nav } from "react-bootstrap";

const Header = () => {
    const location = useLocation();

    return (
        <Navbar expand="lg" className="navbar-custom">
            <Container>
                <Link to="/" className="navbar-brand navbar-custom__logo">F&H Logistic</Link>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto navbar-custom__menu">
                        <Link 
                            to="/" 
                            className={`nav-link navbar-custom__menu--item ${location.pathname === "/" ? "active" : ""}`}
                        >
                            Trang chủ
                        </Link>
                        <Link 
                            to="/about" 
                            className={`nav-link navbar-custom__menu--item ${location.pathname === "/about" ? "active" : ""}`}
                        >
                            Giới thiệu
                        </Link>
                        <Link 
                            to="/order" 
                            className={`nav-link navbar-custom__menu--item ${location.pathname === "/order" ? "active" : ""}`}
                        >
                            Đặt hàng
                        </Link>
                        <Link 
                            to="/tracking" 
                            className={`nav-link navbar-custom__menu--item ${location.pathname === "/tracking" ? "active" : ""}`}
                        >
                            Theo dõi đơn hàng
                        </Link>
                        <Link 
                            to="/login" 
                            className={`nav-link navbar-custom__menu--item ${location.pathname === "/login" ? "active" : ""}`}
                        >
                            Đăng nhập
                        </Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default Header;