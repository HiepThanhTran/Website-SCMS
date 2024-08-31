import { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import cookie from 'react-cookies';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import APIs, { authAPI, endpoints } from '../../configs/APIs';
import { LoginAction } from '../../store/actions/UserAction';
import { useUser } from '../../store/contexts/UserContext';
import { roles } from '../../utils/Constatns';
import './Login.css';

const Login = () => {
   const [user, dispatch] = useUser();
   const [username, setUsername] = useState('');
   const [password, setPassword] = useState('');
   const [showPassword, setShowPassword] = useState(false);
   const [q] = useSearchParams();
   const nav = useNavigate();

   const login = async (e) => {
      e.preventDefault();

      try {
         const res = await APIs.post(endpoints.login, { username, password });
         cookie.save('token', res.data);

         const currentUser = await authAPI().get(endpoints.profileUser);
         let payload = { data: currentUser.data };

         switch (currentUser?.data?.role) {
            case roles.CUSTOMER:
               const profileCustomer = await authAPI().get(endpoints.profileCustomer);
               payload = { ...payload, profile: profileCustomer.data };
               break;
            case roles.SUPPLIER:
               const profileSupplier = await authAPI().get(endpoints.profileSupplier);
               payload = { ...payload, profile: profileSupplier.data };
               break;
            case roles.DISTRIBUTOR:
               break;
            case roles.MANUFACTURER:
               break;
            case roles.SHIPPER:
               const profileShipper = await authAPI().get(endpoints.profileShipper);
               payload = { ...payload, profile: profileShipper.data };
               break;
            default:
               throw new Error('Invalid');
         }

         dispatch(LoginAction(payload));
         cookie.save('user', payload);

         let next = q.get('next') || '/';
         nav(next);
      } catch (error) {
         Swal.fire({
            title: 'Đăng nhập thất bại',
            text:
               error?.response?.data.map((data) => data.message).join('\n') ||
               'Hệ thống đang bận, vui lòng thử lại sau',
            icon: 'error',
            confirmButtonText: 'Đóng',
            customClass: {
               confirmButton: 'swal2-confirm',
            },
         });
         console.error(error);
         console.error(error?.response);
      }
   };

   return (
      <div className="login-page">
         <div className="login-container">
            <h2 className="text-center mb-3 login-title">Đăng nhập</h2>
            <Form onSubmit={login} className="login-form">
               <Form.Group className="mb-3">
                  <Form.Control
                     value={username}
                     onChange={(e) => setUsername(e.target.value)}
                     type="text"
                     placeholder="Tên đăng nhập"
                     required
                  />
               </Form.Group>
               <Form.Group className="mb-3 position-relative">
                  <Form.Control
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                     type={showPassword ? 'text' : 'password'}
                     placeholder="Mật khẩu"
                     required
                  />
                  <Button variant="link" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                     {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </Button>
               </Form.Group>
               <Form.Group className="mb-3">
                  <Button
                     variant="primary"
                     type="submit"
                     className="w-100"
                     style={{
                        backgroundColor: 'var(--primary-color)',
                        borderColor: 'var(--primary-color)',
                        fontWeight: '500',
                     }}
                  >
                     Đăng nhập
                  </Button>
               </Form.Group>
            </Form>
         </div>
      </div>
   );
};

export default Login;
