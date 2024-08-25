import { useContext } from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { MyUserContext } from "../../App";
import "./Header.css";

const Header = () => {
  const [user] = useContext(MyUserContext);

  return (
    <Navbar expand="lg" className="navbar-custom fixed-top">
      <Container>
        <Navbar.Brand as={NavLink} to="/" className="navbar-custom__logo">
          F&H Logistic
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto mx-auto navbar-custom__menu">
            <Nav.Link as={NavLink} exact to="/" className="navbar-custom__menu--item">Trang chủ</Nav.Link>
            <Nav.Link as={NavLink} to="/product" className="navbar-custom__menu--item">Đặt hàng</Nav.Link>
            <Nav.Link as={NavLink} to="/order-details" className="navbar-custom__menu--item">Chi tiết đơn hàng</Nav.Link>
          </Nav>
          
          <Nav className="navbar-custom__menu">
            {user === null ? (
              <>
                <Nav.Link as={NavLink} to="/login" className="navbar-custom__menu--item">Đăng nhập</Nav.Link>
                <Nav.Link as={NavLink} to="/register" className="navbar-custom__menu--item">Đăng ký</Nav.Link>
              </>
            ) : (
              <>
                <NavLink className="nav-link" to="/profile">
                  Xin chào, {user?.username || "Nguyen Van A"}
                </NavLink>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;