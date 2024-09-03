import { useCallback, useEffect, useState } from 'react';
import { Button, Col, Container, Form, Modal, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { routeUrl } from '../../App';
import { authAPI, endpoints } from '../../configs/APIs';
import { useCart } from '../../store/contexts/CartContext';
import { UPDATE_CART } from '../../store/reducers/CartReducer';
import { defaultImage, statusCode } from '../../utils/Constatns';
import Toast from '../../utils/Utils';
import { useUser } from '../../store/contexts/UserContext';
import { CardElement, Elements, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import './Cart.css';

const stripePromise = loadStripe('pk_test_51O41qGBy1BulLKF8k8qu0rqhO2HoDtOLogY9Yh757QmeFJvjTrj5o96LDJpJ4GWR6CNtEWe6K8aO0SrdV5P5UdfZ00mPyk9MSy');

const Cart = () => {
   const [user,] = useUser();
   const [cart, dispatch] = useCart();
   const [quantities, setQuantities] = useState({});
   const [showModal, setShowModal] = useState(false);
   const [formData, setFormData] = useState({ email: '', phone: '', address: '' });
   const [paymentMethod, setPaymentMethod] = useState('');
   const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('cash');
   const navigate = useNavigate();
   const stripe = useStripe();
   const elements = useElements();

   const tax = 0.01;
   const totalAmount = Object.values(cart).reduce((total, item) => total + item.quantity * item.unitPrice, 0);
   const totalWithFee = totalAmount + totalAmount * tax;

   const formattedCurrency = useCallback(
      (data) =>
         data.toLocaleString('vi-VN', {
            style: 'currency',
            currency: 'VND',
         }),
      [],
   );

   useEffect(() => {
      if (Object.entries(cart).length < 1) {
         Swal.fire({
            title: 'Thông báo',
            text: 'Không có sản phẩm nào trong giỏ hàng.',
            icon: 'info',
            confirmButtonText: 'Đóng',
            customClass: {
               confirmButton: 'swal2-confirm',
            },
         }).then((result) => {
            if (result.isConfirmed) {
               navigate(routeUrl.PRODUCT);
            }
         });
      } else {
         const initialQuantity = Object.keys(cart).reduce((acc, productId) => {
            acc[productId] = cart[productId].quantity;
            return acc;
         }, {});
         setQuantities(initialQuantity);
      }
   }, [cart, navigate]);

   const updateQuantity = async (productId, action) => {
      if (quantities[productId] + action === 0) {
         removeProduct(productId);
         return;
      }

      Swal.fire({
         title: 'Đang cập nhật...',
         text: 'Vui lòng đợi một chút.',
         allowOutsideClick: false,
         showConfirmButton: false,
         didOpen: () => {
            Swal.showLoading();
         },
      });

      try {
         const res = await authAPI().patch(endpoints.updateProductInCart(productId), {
            quantity: quantities[productId] + action,
         });

         if (res.status === statusCode.HTTP_200_OK) {
            const updatedCart = {
               ...cart,
               [productId]: {
                  ...cart[productId],
                  quantity: quantities[productId] + action,
               },
            };

            dispatch({
               type: UPDATE_CART,
               payload: updatedCart,
            });

            Swal.close();
         }
      } catch (error) {
         Swal.showValidationMessage(`Cập nhật sản phẩm thất bại: ${error.message}`);
         throw error;
      }
   };

   const removeProduct = (productId) => {
      Swal.fire({
         title: 'Xác nhận xóa sản phẩm',
         text: 'Bạn chắc chắn muốn sản phẩm này ra khỏi giỏ hàng?',
         icon: 'warning',
         showCancelButton: true,
         confirmButtonText: 'Có',
         cancelButtonText: 'Không',
         showLoaderOnConfirm: true,
         allowOutsideClick: () => !Swal.isLoading(),
         customClass: {
            confirmButton: 'swal2-confirm',
         },
         preConfirm: async () => {
            try {
               const res = await authAPI().delete(endpoints.removeProductFromCart(productId));

               if (res.status === statusCode.HTTP_204_NO_CONTENT) {
                  const updatedCart = { ...cart };

                  delete updatedCart[productId];
                  dispatch({
                     type: UPDATE_CART,
                     payload: updatedCart,
                  });

                  Toast.fire({
                     icon: 'success',
                     title: 'Thành công!',
                     text: 'Xóa sản phẩm khỏi giỏ hàng thành công.',
                  });
               }
            } catch (error) {
               Swal.showValidationMessage(`Xóa sản phẩm thất bại: ${error.message}`);
               throw error;
            }
         },
      });
   };

   const handleShowModal = () => setShowModal(true);
   const handleCloseModal = () => setShowModal(false);

   const handleFormChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
   };

   const handlePaymentMethodChange = (e) => {
      setSelectedPaymentMethod(e.target.value);
   };

   return (
      <Container fluid className="cart-container" style={Object.entries(cart).length < 1 ? { minHeight: '100vh' } : {}}>
         <Row>
            <Col sm={9}>
               <div className="shadow-lg mb-3 bg-body rounded gap-3">
                  <div
                     style={{
                        height: '46px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingTop: '28px',
                     }}
                  >
                     <h2>
                        Giỏ hàng của bạn - {Object.entries(cart).length} sản phẩm
                     </h2>
                  </div>
                  <hr />
                  {Object.values(cart).map((c, index) => (
                     <>
                        <div key={index} className="cart-card mt-3">
                           <Col sm={3}>
                              <div className="cart-card__image">
                                 <img
                                    className="img-fluid"
                                    src={c?.product?.image ?? defaultImage.PRODUCT_IMAGE}
                                    alt={c?.product?.name || 'Product Image'}
                                 />
                              </div>
                           </Col>

                           <Col sm={9}>
                              <div className="cart-card__content">
                                 <Row className="align-items-end">
                                    <Col sm={4}>
                                       <h1 className="cart-card__content__name">{c?.product?.name}</h1>
                                       <p className="cart-card__content__description">{c?.product?.description}</p>
                                    </Col>
                                    <Col sm={4}>
                                       <h4 style={{ color: 'var(--primary-color)' }}>
                                          {formattedCurrency(c?.quantity * c?.unitPrice)}
                                       </h4>
                                    </Col>
                                    <Col sm={4}>
                                       <div className="d-flex align-items-center">
                                          <Button
                                             style={{
                                                background: 'var(--primary-color)',
                                                border: 'none',
                                             }}
                                             className="fs-5 me-2 btn-cart"
                                             variant="primary"
                                             onClick={() => updateQuantity(c?.product?.id, -1)}
                                          >
                                             <i className="bx bx-minus"></i>
                                          </Button>
                                          <Form.Group style={{ position: 'relative' }} controlId={`quantity-${index}`}>
                                             <Form.Label
                                                style={{
                                                   position: 'absolute',
                                                   left: '50%',
                                                   background: '#fff',
                                                   transform: 'translate(-50%, -50%)',
                                                   fontSize: '0.9rem',
                                                }}
                                             >
                                                Số lượng
                                             </Form.Label>
                                             <Form.Control
                                                disabled
                                                style={{ width: '120px', textAlign: 'center' }}
                                                type="number"
                                                value={quantities[c?.product?.id]}
                                             />
                                          </Form.Group>
                                          <Button
                                             style={{
                                                background: 'var(--primary-color)',
                                                border: 'none',
                                             }}
                                             className="fs-5 ms-2 btn-cart"
                                             variant="primary"
                                             onClick={() => updateQuantity(c?.product?.id, 1)}
                                          >
                                             <i className="bx bx-plus"></i>
                                          </Button>
                                       </div>
                                    </Col>
                                 </Row>
                                 <Button
                                    className="fs-5"
                                    variant="danger"
                                    onClick={() => removeProduct(c?.product?.id)}
                                 >
                                    <i className="bx bxs-trash-alt"></i>
                                 </Button>
                              </div>
                           </Col>
                        </div>
                        {index < Object.entries(cart).length - 1 ? <hr /> : null}
                     </>
                  ))}
               </div>
            </Col>
            <Col sm={3}>
               <Container>
                  <div className="shadow-lg p-3 mb-3 bg-body rounded gap-3">
                     <div className="sumary-title">Tổng đơn hàng</div>

                     <div className="summary-content">
                        <div className="summary-item ">
                           <h3 className="summary-item__title">Tổng</h3>
                           <span className="summary-item__value">{formattedCurrency(totalAmount)}</span>
                        </div>
                        <div className="summary-item ">
                           <h3 className="summary-item__title">Số lượng</h3>
                           <span className="summary-item__value">
                              {Object.values(cart).reduce((total, item) => total + item.quantity, 0)}
                           </span>
                        </div>
                        <div className="summary-item ">
                           <h3 className="summary-item__title">Thuế</h3>
                           <span className="summary-item__value">{tax * 100} %</span>
                        </div>
                     </div>

                     <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                        <Button onClick={handleShowModal} className="summary-button">Đặt hàng</Button>
                     </div>
                  </div>
               </Container>
            </Col>
         </Row>

         {/* Modal Form */}
         <Modal show={showModal} onHide={handleCloseModal}>
            <Modal.Header closeButton>
               <Modal.Title>Thông tin thanh toán</Modal.Title>
            </Modal.Header>
            <Modal.Body>
               <Form>
                  <Form.Group className="mb-3">
                     <Form.Label>Tên</Form.Label>
                     <Form.Control
                        type="text"
                        name="username"
                        value={user?.data?.username}
                        readOnly
                     />
                  </Form.Group>
                  <Form.Group className="mb-3">
                     <Form.Label>Email</Form.Label>
                     <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleFormChange}
                     />
                  </Form.Group>
                  <Form.Group className="mb-3">
                     <Form.Label>Số điện thoại</Form.Label>
                     <Form.Control
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleFormChange}
                     />
                  </Form.Group>
                  <Form.Group className="mb-3">
                     <Form.Label>Địa chỉ</Form.Label>
                     <Form.Control
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleFormChange}
                     />
                  </Form.Group>
                  <Form.Group className="mb-3">
                     <Form.Label>Hình thức thanh toán</Form.Label>
                     <div className="custom-radio">
                        <Form.Check
                           type="radio"
                           label="Thanh toán tiền mặt"
                           value="cash"
                           checked={selectedPaymentMethod === 'cash'}
                           onChange={handlePaymentMethodChange}
                           custom
                        />
                        <Form.Check
                           type="radio"
                           label="Thanh toán online"
                           value="online"
                           checked={selectedPaymentMethod === 'online'}
                           onChange={handlePaymentMethodChange}
                           custom
                        />
                     </div>
                  </Form.Group>
                  <div className={`payment-method-transition ${selectedPaymentMethod === 'online' ? 'fade-in' : 'fade-out'}`}>
                     {selectedPaymentMethod === 'online' && (
                        <Form.Group className="mb-3">
                           <Form.Label>Thẻ tín dụng</Form.Label>
                           <CardElement className="stripe-card-element" />
                        </Form.Group>
                     )}
                  </div>
               </Form>
            </Modal.Body>
            <Modal.Footer>
               <Button variant="secondary" onClick={handleCloseModal}>
                  Hủy
               </Button>
               <Button 
                  className="btn-confirm">
                  Xác nhận
               </Button>
            </Modal.Footer>
         </Modal>

      </Container>
   );
};

const WrappedCart = () => (
   <Elements stripe={stripePromise}>
      <Cart />
   </Elements>
);

export default WrappedCart;