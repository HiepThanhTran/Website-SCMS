import { Navbar, Nav, Container } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import "./Header.css";

const Header = () => {
    return (
        <Navbar expand="lg" className="navbar__custom">
            <Container>
                <Navbar.Brand as={NavLink} to="/" className="me-auto navbar__custom__logo">F&H Logistic</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto navbar__custom__menu">
                        <Nav.Link as={NavLink} to="/home" className="navbar__custom__menu--item" activeClassName="active">Trang chủ</Nav.Link>
                        <Nav.Link as={NavLink} to="/ordertracking" className="navbar__custom__menu--item" activeClassName="active">Theo dõi đơn hàng</Nav.Link>
                        <Nav.Link as={NavLink} to="/login" className="navbar__custom__menu--item" activeClassName="active">Đăng nhập</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default Header;