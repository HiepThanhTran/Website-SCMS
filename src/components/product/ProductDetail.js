import { useCallback, useEffect, useState } from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import cookie from 'react-cookies';
import { useParams } from 'react-router-dom';
import APIs, { authAPI, endpoints } from '../../configs/APIs';
import { useCart } from '../../store/contexts/CartContext';
import { defaultImage } from '../../utils/Constatns';
import './Product.css';

const ProductDetails = () => {
   const [cart, dispatch] = useCart();
   const [product, setProduct] = useState(null);
   const [quantity, setQuantity] = useState(1);

   const { id } = useParams();

   const loadProductDetail = useCallback(async () => {
      try {
         const res = await APIs.get(endpoints.getProduct(id));

         setProduct(res.data);
      } catch (error) {
         console.error(error);
      }
   }, [id]);

   useEffect(() => {
      loadProductDetail();
   }, [loadProductDetail]);

   const handleQuantityChange = (e) => {
      const value = parseInt(e.target.value, 10);
      if (!isNaN(value) && value > 0) {
         setQuantity(value);
      }
   };

   const handleAddToCart = async () => {
      try {
         const response = await authAPI().post(endpoints.addProductToCart, {
            productId: id,
            quantity: quantity,
         });

         console.log('Thêm sản phẩm vào giỏ hàng thành công:', response.data);
         alert('Sản phẩm đã được thêm vào giỏ hàng!');

         let cart = cookie.load('cart') || {};
         if (cart[id]) {
            cart[id].quantity += quantity;
         } else {
            cart[id] = {
               image: product.image,
               name: product.name,
               description: product.description,
               price: product.price,
               quantity: quantity,
            };
         }
         cookie.save('cart', cart);
         dispatch({ type: 'update' });
      } catch (error) {
         console.error('Lỗi khi thêm sản phẩm vào giỏ hàng:', error);
         alert('Có lỗi xảy ra, vui lòng thử lại.');
      }
   };

   if (!product) {
      return <div>Loading...</div>;
   }

   return (
      <Container className="product-detail-container">
         <div className="shadow-lg p-3 mb-3 bg-body rounded gap-3">
            <Row>
               <Col sm={12}>
                  <div className="product-detail">
                     <Row>
                        <Col sm={6}>
                           <div className="product-detail__image">
                              <img
                                 src={product.image || defaultImage.PRODUCT_IMAGE}
                                 alt={product.name || 'Hình ảnh sản phẩm'}
                                 className="img-fluid"
                              />
                           </div>
                        </Col>

                        <Col sm={6}>
                           <div className="product-detail__content">
                              <h1 className="product-detail__content--name">{product.name}</h1>
                              <p className="product-detail__content--description">
                                 Mô tả sản phẩm: {product.description}
                              </p>
                              <p className="product-detail__content--price">Giá: {product.price} VNĐ</p>

                              <div className="product-detail__quantity">
                                 <h1 className="product-detail__quantity--title">Số lượng:</h1>

                                 <Form.Group className="mb-3">
                                    <Form.Control
                                       type="text"
                                       name="lastName"
                                       value={quantity}
                                       onChange={handleQuantityChange}
                                       style={{ width: '150px', textAlign: 'center' }}
                                    />
                                 </Form.Group>
                              </div>

                              <div className="product-detail__button">
                                 <Button onClick={handleAddToCart}>Đặt hàng</Button>
                              </div>
                           </div>
                        </Col>
                     </Row>
                  </div>
               </Col>
            </Row>
         </div>
      </Container>
   );
};

export default ProductDetails;
