import { useContext } from "react";
import { Badge, Container, Nav, Navbar } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import { MyCartContext, MyUserContext } from "../../App";
import "./Header.css";

const Header = () => {
	const [user, dispatch] = useContext(MyUserContext);
	const navigate = useNavigate();
	const [cartCounter] = useContext(MyCartContext);
	const logout = () => {
		dispatch({
			type: "logout",
		});
		navigate("/");
	};

	const getProfileLink = () => {
		switch (user?.role) {
			case "Khách hàng":
				return "/profilecustomer";
			case "Nhà cung cấp":
				return "/profilesupplier";
			case "Nhà vận chuyển":
				return "/profileshipper";
		}
	};

	return (
		<Navbar expand="lg" className="navbar-custom fixed-top">
			<Container>
				<Navbar.Brand
					as={NavLink}
					to="/"
					className="navbar-custom__logo">
					F&H Logistic
				</Navbar.Brand>
				<Navbar.Toggle aria-controls="basic-navbar-nav" />

				<Navbar.Collapse id="basic-navbar-nav">
					<Nav className="me-auto mx-auto navbar-custom__menu">
						<Nav.Link
							as={NavLink}
							exact
							to="/"
							className="navbar-custom__menu--item">
							Trang chủ
						</Nav.Link>
						<Nav.Link
							as={NavLink}
							to="/product"
							className="navbar-custom__menu--item">
							Đặt hàng
						</Nav.Link>
						<Nav.Link
							as={NavLink}
							to="/order-details"
							className="navbar-custom__menu--item">
							Chi tiết đơn hàng
						</Nav.Link>
					</Nav>

					<Nav className="navbar-custom__menu">
						{user === null ? (
							<>
								<Nav.Link
									as={NavLink}
									to="/login"
									className="navbar-custom__menu--item">
									Đăng nhập
								</Nav.Link>
								<Nav.Link
									as={NavLink}
									to="/register"
									className="navbar-custom__menu--item">
									Đăng ký
								</Nav.Link>
							</>
						) : (
							<div className="name-user-wrapper">
								<NavLink className="nav-link name-user" to="/profile">
									Xin chào, {user?.username || "Nguyen Van A"}
								</NavLink>
								<div className="user-dropdown">
									<NavLink className="dropdown-item" to="/profile">Thông tin chung</NavLink>
									<NavLink className="dropdown-item" to={getProfileLink()}>Cá nhân</NavLink>
									<button className="dropdown-item" onClick={logout}>Đăng xuất</button>
								</div>
								{/* <NavLink className="nav-link text-danger" to="/cart">
									&#128722;<Badge className="bg-danger">{cartCounter}</Badge>
								</NavLink> */}
							</div>
						)}
					</Nav>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	);
};

export default Header;