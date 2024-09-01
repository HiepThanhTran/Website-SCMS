import { useState } from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import { useUser } from '../../store/contexts/UserContext';
import { authAPI, endpoints } from '../../configs/APIs';
import Swal from 'sweetalert2';
import { statusCode } from '../../utils/Constatns';
import { UpdateUserAction } from '../../store/actions/UserAction';
import Loading from '../../layout/loading/Loading';

const ProfileSupplier = () => {
   const [user, dispatch] = useUser();
   const [profileSupplier, setProfileSupplier] = useState(user?.profile);
   const [loading, setLoading] = useState(false);

   const processUpdateProfileSupplier = (field, value) => {
      setProfileSupplier({ ...profileSupplier, [field]: value });
   };

   const handleUpdateSupplier = async (e) => {
      e.preventDefault();

      const formData = new FormData();
      if (profileSupplier?.name !== user?.profile?.name) {
         formData.append('name', profileSupplier?.name);
      }
      if (profileSupplier?.phone !== user?.profile?.phone) {
         formData.append('phone', profileSupplier?.phone);
      }
      if (profileSupplier?.address !== user?.profile?.address) {
         formData.append('address', profileSupplier?.address);
      }
      if (profileSupplier?.contactInfo !== user?.profile?.contactInfo) {
         formData.append('contactInfo', profileSupplier?.contactInfo);
      }

      setLoading(true);
      try {
         const res = await authAPI().post(endpoints.updateProfileSupplier, formData, {
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

   return (
      <Container className="profile-container">
         <div className="shadow-lg p-3 mb-3 bg-body rounded gap-3">
            <Row>
               <Col sm={12}>
                  <div className="profile-content">
                     <h3 className="text-white p-3 product-content__title">Thông tin cá nhân</h3>
                  </div>
                  <Row>
                     <Col sm={6}>
                        <Form.Group className="mb-3">
                           <Form.Label>Tên</Form.Label>
                           <Form.Control
                              type="text"
                              name="name"
                              value={profileSupplier?.name}
                              onChange={(e) => processUpdateProfileSupplier('name', e.target.value)}
                           />
                        </Form.Group>
                     </Col>

                     <Col sm={6}>
                        <Form.Group className="mb-3">
                           <Form.Label>Số điện thoại</Form.Label>
                           <Form.Control
                              type="tel"
                              name="phone"
                              value={profileSupplier?.phone}
                              onChange={(e) => processUpdateProfileSupplier('phone', e.target.value)}
                           />
                        </Form.Group>
                     </Col>
                  </Row>

                  <Form.Group className="mb-3">
                     <Form.Label>Địa chỉ</Form.Label>
                     <Form.Control
                        type="text"
                        name="address"
                        value={profileSupplier?.address}
                        onChange={(e) => processUpdateProfileSupplier('address', e.target.value)}
                     />
                  </Form.Group>

                  <Form.Group className="mb-3">
                     <Form.Label>Thông tin liên hệ</Form.Label>
                     <Form.Control
                        type="tel"
                        name="contactInfo"
                        value={profileSupplier?.contactInfo}
                        onChange={(e) => processUpdateProfileSupplier('contactInfo', e.target.value)}
                     />
                  </Form.Group>

                  <div className="text-center mt-3">
                     <Button
                        onClick={handleUpdateSupplier}
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
   )
};

export default ProfileSupplier;
