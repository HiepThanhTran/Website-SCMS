import { NavLink } from "react-router-dom";
import "./Header.css";
import { Navbar, Container, Nav } from "react-bootstrap";

const Header = () => {
    return (
        <Navbar expand="lg" className="navbar-custom fixed-top">
            <Container>
                <NavLink to="/" className="navbar-brand navbar-custom__logo">F&H Logistic</NavLink>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto navbar-custom__menu">
                        <NavLink exact to="/" activeClassName="active" className="nav-link navbar-custom__menu--item">Trang chủ</NavLink>
                        <NavLink to="/order" activeClassName="active" className="nav-link navbar-custom__menu--item">Đặt hàng</NavLink>
                        <NavLink to="/tracking" activeClassName="active" className="nav-link navbar-custom__menu--item">Theo dõi đơn hàng</NavLink>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default Header;