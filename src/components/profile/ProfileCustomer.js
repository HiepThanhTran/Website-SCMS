import { useState } from 'react';
import { Col, Container, Form, Row } from 'react-bootstrap';
import { useUser } from '../../store/contexts/UserContext';

const ProfileCustomer = () => {
   const [user, dispatch] = useUser();
   const [profileCustomer, setProfileCustomer] = useState({});

   return (
      <Container className="profile-container">
         <div className="shadow-lg p-3 mb-3 bg-body rounded gap-3">
            <Row>
               <Col sm={12}>
                  <Row>
                     <Col sm={4}>
                        <Form.Group className="mb-3">
                           <Form.Label>Họ</Form.Label>
                           <Form.Control type="text" />
                        </Form.Group>
                     </Col>

                     <Col sm={4}>
                        <Form.Group className="mb-3">
                           <Form.Label>Tên đệm</Form.Label>
                           <Form.Control type="text" />
                        </Form.Group>
                     </Col>

                     <Col sm={4}>
                        <Form.Group className="mb-3">
                           <Form.Label>Tên</Form.Label>
                           <Form.Control type="text" />
                        </Form.Group>
                     </Col>
                  </Row>

                  <Form.Group className="mb-3">
                     <Form.Label>Địa chỉ</Form.Label>
                     <Form.Control type="text" />
                  </Form.Group>

                  <Row>
                     <Col sm={4}>
                        <Form.Group className="mb-3">
                           <Form.Label>Số điện thoại</Form.Label>
                           <Form.Control type="tel" />
                        </Form.Group>
                     </Col>

                     <Col sm={4}>
                        <Form.Group className="mb-3">
                           <Form.Label>Giới tính</Form.Label>
                           <Form.Control type="text" />
                        </Form.Group>
                     </Col>

                     <Col sm={4}>
                        <Form.Group className="mb-3">
                           <Form.Label>Ngày sinh</Form.Label>
                           <Form.Control type="date" />
                        </Form.Group>
                     </Col>
                  </Row>
               </Col>
            </Row>
         </div>
      </Container>
   );
};

export default ProfileCustomer;
