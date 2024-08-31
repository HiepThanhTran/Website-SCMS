import { useState } from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { authAPI, endpoints } from '../../configs/APIs';
import Loading from '../../layout/loading/Loading';
import { LogoutAction, UpdateUserAction } from '../../store/actions/UserAction';
import { useUser } from '../../store/contexts/UserContext';
import { defaultImage, rolesName, statusCode } from '../../utils/Constatns';
import './Profile.css';

const Profile = () => {
   const [user, dispatch] = useUser();
   const [profile, setProfile] = useState(user?.data);
   const [previewAvatar, setPreviewAvatar] = useState(null);
   const [confirmPassword, setConfirmPassword] = useState('');
   const [loading, setLoading] = useState(false);
   const [showPassword, setShowPassword] = useState(false);
   const navigate = useNavigate();
   const handleConfirmAccount = async () => {
      setLoading(true);
      try {
         const res = await authAPI().post(endpoints.confirm);

         if (res.status === statusCode.HTTP_200_OK) {
            Swal.fire({
               title: 'Xác thực thành công',
               text: 'Tài khoản của bạn đã được xác nhận.',
               icon: 'success',
               confirmButtonText: 'Đóng',
               customClass: {
                  confirmButton: 'swal2-confirm',
               },
            }).then(() => {
               dispatch(
                  UpdateUserAction({
                     data: {
                        ...user?.data,
                        isConfirm: true,
                     },
                     profile: user?.profile,
                  }),
               );
            });
         }
      } catch (error) {
         Swal.fire({
            title: 'Xác thực thất bại',
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
      } finally {
         setLoading(false);
      }
   };

   const handleUpdateProfile = async (e) => {
      e.preventDefault();

      const formData = new FormData();
      if (profile?.email !== user?.data?.email) {
         formData.append('email', profile?.email);
         console.log(formData);
      }
      if (profile?.username !== user?.data?.username) {
         formData.append('username', profile?.username);
      }
      if (profile?.avatar !== user?.data?.avatar) {
         formData.append('avatar', profile?.avatar);
      }

      if (profile?.password) {
         if (profile?.password !== confirmPassword) {
            Swal.fire({
               title: 'Lỗi',
               text: 'Mật khẩu xác nhận không khớp!',
               icon: 'error',
               confirmButtonText: 'Đóng',
               customClass: {
                  confirmButton: 'swal2-confirm',
               },
            });
            return;
         }

         formData.append('password', profile?.password);
      }

      setLoading(true);
      try {
         const res = await authAPI().post(endpoints.updateProfileUser, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
         });

         if (res.status === statusCode.HTTP_200_OK) {
            Swal.fire({
               title: 'Cập nhật thành công',
               text: 'Hồ sơ của bạn đã được cập nhật.',
               icon: 'success',
               confirmButtonText: 'Đóng',
               customClass: {
                  confirmButton: 'swal2-confirm',
               },
            }).then(() => {
               if (profile?.username !== user?.data?.username || profile?.password) {
                  dispatch(LogoutAction());
                  navigate('/');
               } else {
                  dispatch(
                     UpdateUserAction({
                        data: res.data,
                        profile: user?.profile,
                     }),
                  );
               }
            });
         }
      } catch (error) {
         Swal.fire({
            title: 'Cập nhật thất bại',
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
      } finally {
         setLoading(false);
      }
   };

   const handleAvatarChange = (e) => {
      const file = e.target.files[0];
      if (file) {
         setPreviewAvatar(URL.createObjectURL(file));
         processUpdateProfile('avatar', file);
      }
   };

   const processUpdateProfile = (field, value) => {
      setProfile({ ...profile, [field]: value });
   };

   if (loading) {
      return <Loading />;
   }

   return (
      <Container className="profile-container">
         <div className="shadow-lg p-3 mb-3 bg-body rounded gap-3">
            <Row>
               <Col sm={3}>
                  <div className="d-flex flex-column align-items-center justify-content-center">
                     <img
                        className="rounded-circle shadow"
                        src={previewAvatar || user?.data?.avatar || defaultImage.USER_AVATAR}
                        alt="Avatar người dùng"
                        style={{
                           width: 190,
                           height: 190,
                           objectFit: 'cover',
                        }}
                        onError={(e) => {
                           console.error("Error loading image", e.target.src);
                           e.target.src = defaultImage.USER_AVATAR;
                        }}
                     />
                     <label htmlFor="avatar" type="button" className="btn btn-secondary mt-3">
                        Chọn ảnh
                     </label>
                     <Form.Control
                        id="avatar"
                        type="file"
                        style={{ display: 'none' }}
                        accept=".jpg,.jpeg,.png"
                        onChange={handleAvatarChange}
                     />
                  </div>
               </Col>

               <Col sm={9}>
                  <div className="profile-content">
                     <h3 className="text-white p-3 product-content__title">Thông tin tài khoản</h3>
                  </div>

                  {!user?.data?.isConfirm && (
                     <Button
                        className="mb-3"
                        variant="success"
                        onClick={handleConfirmAccount}
                        style={{
                           backgroundColor: 'var(--primary-color)',
                           border: 'none',
                           color: 'white',
                           fontWeight: 500,
                        }}
                        disabled={loading}
                     >
                        Xác nhận tài khoản
                     </Button>
                  )}

                  <Form className="profile-input">
                     <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                           type="email"
                           value={profile?.email}
                           onChange={(e) => processUpdateProfile('email', e.target.value)}
                        />
                     </Form.Group>

                     <Form.Group className="mb-3">
                        <Form.Label>Username</Form.Label>
                        <Form.Control
                           type="text"
                           name="username"
                           value={profile?.username}
                           onChange={(e) => processUpdateProfile('username', e.target.value)}
                        />
                     </Form.Group>

                     <Row className="position-relative">
                        <Col md={6}>
                           <Form.Group className="mb-3 position-relative">
                              <Form.Label>Mật khẩu mới</Form.Label>
                              <Form.Control
                                 type={showPassword ? 'text' : 'password'}
                                 placeholder="Mật khẩu"
                                 name="password"
                                 value={profile?.password}
                                 onChange={(e) => processUpdateProfile('password', e.target.value)}
                              />
                              <Button
                                 variant="link"
                                 className="password-toggle-profile"
                                 onClick={() => setShowPassword(!showPassword)}
                              >
                                 {showPassword ? (
                                    <FaEyeSlash style={{ color: 'var(--primary-color)' }} />
                                 ) : (
                                    <FaEye style={{ color: 'var(--primary-color)' }} />
                                 )}
                              </Button>
                           </Form.Group>
                        </Col>

                        <Col md={6}>
                           <Form.Group className="mb-3 position-relative">
                              <Form.Label>Xác nhận mật khẩu</Form.Label>
                              <Form.Control
                                 type={showPassword ? 'text' : 'password'}
                                 placeholder="Xác nhận mật khẩu"
                                 value={confirmPassword}
                                 onChange={(e) => setConfirmPassword(e.target.value)}
                              />
                              <Button
                                 variant="link"
                                 className="password-toggle-profile"
                                 onClick={() => setShowPassword(!showPassword)}
                              >
                                 {showPassword ? (
                                    <FaEyeSlash style={{ color: 'var(--primary-color)' }} />
                                 ) : (
                                    <FaEye style={{ color: 'var(--primary-color)' }} />
                                 )}
                              </Button>
                           </Form.Group>
                        </Col>

                        <Form.Group className="mb-3">
                           <Form.Label>Vai trò</Form.Label>
                           <Form.Control type="text" value={rolesName[profile?.role]} disabled />
                        </Form.Group>

                        <Form.Group className="mb-3">
                           <Form.Label>Trạng thái xác thực</Form.Label>
                           <Form.Control
                              type="text"
                              value={profile?.isConfirm ? 'Đã xác thực' : 'Chưa xác thực'}
                              disabled
                           />
                        </Form.Group>

                        <div className="text-center">
                           <Button
                              onClick={handleUpdateProfile}
                              variant="primary"
                              style={{
                                 backgroundColor: 'var(--primary-color)',
                                 border: 'none',
                                 color: 'white',
                                 fontWeight: 500,
                              }}
                           >
                              Cập nhật hồ sơ
                           </Button>
                        </div>
                     </Row>
                  </Form>
               </Col>
            </Row>
         </div>
      </Container>
   );
};

export default Profile;
