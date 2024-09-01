import { useState } from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import { useUser } from '../../store/contexts/UserContext';
import { authAPI, endpoints } from '../../configs/APIs';
import Swal from 'sweetalert2';
import { statusCode } from '../../utils/Constatns';
import { UpdateUserAction } from '../../store/actions/UserAction';
import Loading from '../../layout/loading/Loading';

const ProfileShipper = () => {
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
                           />
                        </Form.Group>
                     </Col>

                     <Col sm={6}>
                        <Form.Group className="mb-3">
                           <Form.Label>Rating</Form.Label>
                           <Form.Control
                              type="tel"
                              name="phone"
                              disabled
                           />
                        </Form.Group>
                     </Col>
                  </Row>

                  <Form.Group className="mb-3">
                     <Form.Label>Thông tin liên hệ</Form.Label>
                     <Form.Control
                        type="tel"
                        name="contactInfo"
                     />
                  </Form.Group>

                  <div className="text-center mt-3">
                     <Button
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

export default ProfileShipper;
