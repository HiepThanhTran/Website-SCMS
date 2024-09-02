import { useEffect, useState } from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { routeUrl } from '../../App';
import { authAPI, endpoints } from '../../configs/APIs';
import { useCart } from '../../store/contexts/CartContext';
import { UPDATE_CART } from '../../store/reducers/CartReducer';
import { defaultImage, statusCode } from '../../utils/Constatns';
import './Cart.css';

const Cart = () => {
   const [cart, dispatch] = useCart();
   const [quantities, setQuantities] = useState({});

   const navigate = useNavigate();

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
      const Toast = Swal.mixin({
         toast: true,
         position: 'top-end',
         showConfirmButton: false,
         timer: 3000,
         timerProgressBar: true,
         didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
         },
      });

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

   return (
      <Container fluid className="cart-container" style={Object.entries(cart).length < 1 ? { minHeight: '100vh' } : {}}>
         <Row>
            <Col sm={9}>
               <div className="shadow-lg mb-3 bg-body rounded gap-3">
                  <div style={{ height: '46px', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '28px' }}>
                     <h2 style={{ color: 'var(--primary-color)' }}>
                        Giỏ hàng của bạn - {Object.entries(cart).length} sản phẩm
                     </h2>
                  </div>
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
                                 <Row>
                                    <Col sm={8}>
                                       <h1 className="cart-card__content__name">{c?.product?.name}</h1>
                                       <p className="cart-card__content__description">{c?.product?.description}</p>
                                    </Col>
                                    <Col sm={4}>
                                       <div className="d-flex align-items-center">
                                          <Button
                                             className="fs-5 me-2"
                                             variant="primary"
                                             onClick={() => updateQuantity(c?.product?.id, -1)}
                                          >
                                             <i class="bx bx-minus"></i>
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
                                                style={{ width: '120px' }}
                                                type="number"
                                                value={quantities[c?.product?.id]}
                                             />
                                          </Form.Group>
                                          <Button
                                             className="fs-5 ms-2"
                                             variant="primary"
                                             onClick={() => updateQuantity(c?.product?.id, 1)}
                                          >
                                             <i class="bx bx-plus"></i>
                                          </Button>
                                       </div>
                                    </Col>
                                 </Row>
                                 <Button
                                    className="fs-5"
                                    variant="danger"
                                    onClick={() => removeProduct(c?.product?.id)}
                                 >
                                    <i class="bx bxs-trash-alt"></i>
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
                     <div className='sumary-title'>
                        Tổng đơn hàng
                     </div>

                     <div className='summary-content'>
                        <div className='summary-item '>
                           <h3 className='summary-item__title'>Sản phẩm</h3>
                           <span className='summary-item__value'>1 sản phẩm</span>
                        </div>

                        <div className='summary-item '>
                           <h3 className='summary-item__title'>Ship</h3>
                           <span className='summary-item__value'>Miễn phí</span>
                        </div>
                     </div>

                     <div className='summary-item '>
                        <h3 className='summary-item__title'>Tổng</h3>
                        <span className='summary-item__value'>1.000.000 VNĐ</span>
                     </div>

                     <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: '100%' }}>
                        <Button className='summary-button'>
                           Thanh toán
                        </Button>
                     </div>
                  </div>
               </Container>
            </Col>
         </Row>
      </Container>
   );
};

export default Cart;
