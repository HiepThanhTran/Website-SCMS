import { useState } from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import { useUser } from '../../store/contexts/UserContext';
import { authAPI, endpoints } from '../../configs/APIs';
import Swal from 'sweetalert2';
import { statusCode } from '../../utils/Constatns';
import { UpdateUserAction } from '../../store/actions/UserAction';
import Loading from '../../layout/loading/Loading';

const ProfileCustomer = () => {
   const [user, dispatch] = useUser();
   const [profileCustomer, setProfileCustomer] = useState(user?.profile);
   const [loading, setLoading] = useState(false);
   const processUpdateProfileCustomer = (field, value) => {
      setProfileCustomer({ ...profileCustomer, [field]: value });
   };

   const handleUpdateProfileCustomer = async (e) => {
      e.preventDefault();

      const formData = new FormData();
      if (profileCustomer?.lastName !== user?.profile?.lastName) {
         formData.append('lastName', profileCustomer?.lastName);
      }
      if (profileCustomer?.middleName !== user?.profile?.middleName) {
         formData.append('middleName', profileCustomer?.middleName);
      }
      if (profileCustomer?.firstName !== user?.profile?.firstName) {
         formData.append('firstName', profileCustomer?.firstName);
      }
      if (profileCustomer?.address !== user?.profile?.address) {
         formData.append('address', profileCustomer?.address);
      }
      if (profileCustomer?.phone !== user?.profile?.phone) {
         formData.append('phone', profileCustomer?.phone);
      }
      if (profileCustomer?.gender !== user?.profile?.gender) {
         formData.append('gender', profileCustomer?.gender);
      }
      if (profileCustomer?.dateOfBirth !== user?.profile?.dateOfBirth) {
         formData.append('dateOfBirth', profileCustomer?.dateOfBirth);
      }

      setLoading(true);
      try {
         const res = await authAPI().post(endpoints.updateProfileCustomer, formData, {
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
               dispatch(
                  UpdateUserAction({
                     data: user?.data,
                     profile: res.data
                  }),
               );
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

   if (loading) {
      return <Loading />;
   }

   return (
      <Container className="profile-container">
         <div className="shadow-lg p-3 mb-3 bg-body rounded gap-3">
            <Row>
               <Col sm={12}>
                  <div className="profile-content">
                     <h3 className="text-white p-3 product-content__title">Thông tin cá nhân</h3>
                  </div>
                  <Row>
                     <Col sm={4}>
                        <Form.Group className="mb-3">
                           <Form.Label>Họ</Form.Label>
                           <Form.Control
                              type="text"
                              name="lastName"
                              value={profileCustomer?.lastName}
                              onChange={(e) => processUpdateProfileCustomer('lastName', e.target.value)}
                           />
                        </Form.Group>
                     </Col>

                     <Col sm={4}>
                        <Form.Group className="mb-3">
                           <Form.Label>Tên đệm</Form.Label>
                           <Form.Control
                              type="text"
                              name="middleName"
                              value={profileCustomer?.middleName}
                              onChange={(e) => processUpdateProfileCustomer('middleName', e.target.value)}
                           />
                        </Form.Group>
                     </Col>

                     <Col sm={4}>
                        <Form.Group className="mb-3">
                           <Form.Label>Tên</Form.Label>
                           <Form.Control
                              type="text"
                              name="firstName"
                              value={profileCustomer?.firstName}
                              onChange={(e) => processUpdateProfileCustomer('firstName', e.target.value)}
                           />
                        </Form.Group>
                     </Col>
                  </Row>

                  <Form.Group className="mb-3">
                     <Form.Label>Địa chỉ</Form.Label>
                     <Form.Control
                        type="text"
                        name="address"
                        value={profileCustomer?.address}
                        onChange={(e) => processUpdateProfileCustomer('address', e.target.value)}
                     />
                  </Form.Group>

                  <Row>
                     <Col sm={4}>
                        <Form.Group className="mb-3">
                           <Form.Label>Số điện thoại</Form.Label>
                           <Form.Control
                              type="tel"
                              name="phone"
                              value={profileCustomer?.phone}
                              onChange={(e) => processUpdateProfileCustomer('phone', e.target.value)}
                           />
                        </Form.Group>
                     </Col>

                     <Col sm={4}>
                        <Form.Group className="mb-3">
                           <Form.Label>Giới tính</Form.Label>
                           <Form.Select
                              name="gender"
                              value={profileCustomer?.gender ? 'true' : 'false'}
                              onChange={(e) => processUpdateProfileCustomer('gender', e.target.value === 'true')}
                           >
                              <option value="true">Nam</option>
                              <option value="false">Nữ</option>
                           </Form.Select>
                        </Form.Group>
                     </Col>

                     <Col sm={4}>
                        <Form.Group className="mb-3">
                           <Form.Label>Ngày sinh</Form.Label>
                           <Form.Control
                              type="date"
                              name="dateOfBirth"
                              value={profileCustomer?.dateOfBirth}
                              onChange={(e) => processUpdateProfileCustomer('dateOfBirth', e.target.value)}
                           />
                        </Form.Group>
                     </Col>
                  </Row>

                  <div className="text-center mt-3">
                     <Button
                        onClick={handleUpdateProfileCustomer}
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
               </Col>
            </Row>
         </div>
      </Container>
   );
};

export default ProfileCustomer;