import { useContext } from 'react';
import { Badge, Container, Nav, Navbar } from 'react-bootstrap';
import { NavLink, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { MyCartContext } from '../../App';
import { LogoutAction } from '../../store/actions/UserAction';
import { useUser } from '../../store/contexts/UserContext';
import { roles } from '../../utils/Constatns';
import './Header.css';

const Header = () => {
   const [user, dispatch] = useUser();
   const [cartCounter] = useContext(MyCartContext);
   const navigate = useNavigate();

   const logout = () => {
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
            dispatch(LogoutAction());
            navigate('/');
         }
      });
   };

   const getProfileLink = () => {
      switch (user?.data?.role) {
         case roles.CUSTOMER:
            return '/profile/customer';
         case roles.SUPPLIER:
            return '/profile/supplier';
         case roles.DISTRIBUTOR:
            return null;
         case roles.MANUFACTURER:
            return null;
         case roles.SHIPPER:
            return '/profile/shipper';
         default:
            return null;
      }
   };

   return (
      <Navbar expand="lg" className="navbar-custom fixed-top">
         <Container>
            <Navbar.Brand as={NavLink} to="/" className="navbar-custom__logo">
               F&H Logistic
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />

            <Navbar.Collapse id="basic-navbar-nav">
               <Nav className="me-auto mx-auto navbar-custom__menu">
                  <Nav.Link as={NavLink} exact to="/" className="navbar-custom__menu--item">
                     Trang chủ
                  </Nav.Link>
                  <Nav.Link as={NavLink} to="/product" className="navbar-custom__menu--item">
                     Đặt hàng
                  </Nav.Link>
                  <Nav.Link as={NavLink} to="/order-details" className="navbar-custom__menu--item">
                     Chi tiết đơn hàng
                  </Nav.Link>
               </Nav>

               <Nav className="navbar-custom__menu">
                  {user?.data === null ? (
                     <>
                        <Nav.Link as={NavLink} to="/login" className="navbar-custom__menu--item">
                           Đăng nhập
                        </Nav.Link>
                        <Nav.Link as={NavLink} to="/register" className="navbar-custom__menu--item">
                           Đăng ký
                        </Nav.Link>
                     </>
                  ) : (
                     <div className="name-user-wrapper">
                        <NavLink className="nav-link name-user" to="/profile">
                           Xin chào, {user?.data?.username || 'Nguyen Van A'}
                        </NavLink>
                        <div className="user-dropdown p-2">
                           <NavLink className="dropdown-item" to="/profile">
                              Tài khoản
                           </NavLink>
                           <NavLink className="dropdown-item" to={getProfileLink()}>
                              Hồ sơ cá nhân
                           </NavLink>
                           <NavLink className="dropdown-item" to="/cart">
                              Giỏ hàng &#128722;<Badge className="bg-danger">{cartCounter}</Badge>
                           </NavLink>
                           <button className="dropdown-item" onClick={logout}>
                              Đăng xuất
                           </button>
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
