import { useContext } from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";
import { MyUserContext } from "../../App";
import "./Header.css";

const Header = () => {
  //const nav = useNavigate();
  const [user] = useContext(MyUserContext);
  // const logout = () => {
  //   dispatch({
  //     type: "logout",
  //   });
  //   nav("/");
  // };
  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand href="/">React-Bootstrap</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto mx-auto">
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="/profile">Test Navigate to Profile</Nav.Link>
            <Nav.Link href="/">Link 2</Nav.Link>
          </Nav>
          <Nav>
            {user === null ? (
              <>
                <Nav.Link href="/login">Login</Nav.Link>
                <Nav.Link href="/register">Register</Nav.Link>
              </>
            ) : (
              <>
                <Link className="nav-link">
                  Xin chào, {user?.username || "Nguyen Van A"}
                </Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
