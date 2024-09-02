import { Container, Nav, Navbar } from 'react-bootstrap';
import { NavLink, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { routeUrl } from '../../App';
import { useCart } from '../../store/contexts/CartContext';
import { useUser } from '../../store/contexts/UserContext';
import { UPDATE_CART } from '../../store/reducers/CartReducer';
import { LOGOUT } from '../../store/reducers/UserReducer';
import './Header.css';

const Header = () => {
   const [user, userDispatch] = useUser();
   const [cart, cartDispatch] = useCart();

   const navigate = useNavigate();

   const handleLogout = () => {
      Swal.fire({
         title: 'Xác nhận đăng xuất',
         text: 'Bạn chắc chắn muốn đăng xuất?',
         icon: 'warning',
         showCancelButton: true,
         confirmButtonText: 'Có',
         cancelButtonText: 'Không',
         reverseButtons: true,
         customClass: {
            confirmButton: 'swal2-confirm',
         },
      }).then((result) => {
         if (result.isConfirmed) {
            userDispatch({ type: LOGOUT });
            cartDispatch({ type: UPDATE_CART, payload: {} });
            navigate('/');
         }
      });
   };

   return (
      <Navbar expand="lg" className="navbar-custom fixed-top">
         <Container>
            <Navbar.Brand as={NavLink} to={routeUrl.HOME} className="navbar-custom__logo">
               F&H Logistic
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />

            <Navbar.Collapse id="basic-navbar-nav">
               <Nav className="me-auto mx-auto navbar-custom__menu">
                  <Nav.Link as={NavLink} exact to={routeUrl.HOME} className="navbar-custom__menu--item">
                     Trang chủ
                  </Nav.Link>
                  <Nav.Link as={NavLink} to={routeUrl.PRODUCT} className="navbar-custom__menu--item">
                     Sản phẩm
                  </Nav.Link>
                  <Nav.Link as={NavLink} to="/rating" className="navbar-custom__menu--item">
                     Đánh giá nhà cung cấp
                  </Nav.Link>
               </Nav>

               <Nav className="navbar-custom__menu">
                  {user?.data === null ? (
                     <>
                        <Nav.Link as={NavLink} to={routeUrl.LOGIN} className="navbar-custom__menu--item">
                           Đăng nhập
                        </Nav.Link>
                        <Nav.Link as={NavLink} to={routeUrl.REGISTER} className="navbar-custom__menu--item">
                           Đăng ký
                        </Nav.Link>
                     </>
                  ) : (
                     <div className="name-user-wrapper">
                        <div className="name-user-container">
                           <div style={{ cursor: 'pointer' }} className="nav-link name-user">
                              Xin chào, {user?.data?.username || 'USERNAME TEST'}
                              <div className="user-dropdown p-2">
                                 <NavLink className="dropdown-item" to={routeUrl.ACCOUNT}>
                                    Tài khoản
                                 </NavLink>
                                 <NavLink className="dropdown-item" to={routeUrl.PROFILE}>
                                    Hồ sơ cá nhân
                                 </NavLink>
                                 <NavLink className="dropdown-item" to="/list-order">
                                    Đơn hàng
                                 </NavLink>
                                 <button className="dropdown-item" onClick={logout}>
                                    Đăng xuất
                                 </button>
                              </div>
                           </div>
                        </div>

                        <div className="cart-user">
                           <NavLink className="nav-link text-danger user-cart" to="/cart">
                              <i className="bx bxs-cart-alt user-cart__icon">
                                 <span className="user-cart__quantity">
                                    {Object.values(cart).reduce((total, item) => total + item.quantity, 0)}
                                 </span>
                              </i>
                           </NavLink>
                        </div>
                     </div>
                  )}
               </Nav>
            </Navbar.Collapse>
         </Container>
      </Navbar>
   );
};

export default Header;
