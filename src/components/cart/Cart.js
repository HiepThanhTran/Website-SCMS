import { useState, useContext } from "react";
import { Button, Row, Col, Container } from "react-bootstrap";
import cookie from "react-cookies";
import { defaultImage } from '../../utils/Constatns';
import "./Cart.css";
import APIs, { authAPI, endpoints } from '../../configs/APIs';
import { MyCartContext } from "../../App";

const Cart = () => {
    const [cart, setCart] = useState(cookie.load("cart") || []);

    const removeProduct = async (productId) => {
        try {
            await authAPI().delete(endpoints.removeProductFromCart(productId));
            const updatedCart = cart.filter(item => item.id !== productId);
            setCart(updatedCart);
            cookie.save("cart", updatedCart, { path: '/' });
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Container className="cart-container">
            <div className="shadow-lg p-3 mb-3 bg-body rounded gap-3">
                <Row>
                    <h1>Giỏ hàng của bạn</h1>
                    <Col sm={12}>
                        {Object.values(cart).map((c) => (
                            <Row key={c.id} className="mb-3">
                                <div className="cart-card">
                                    <Col sm={3}>
                                        <div className="cart-card__image">
                                            <img
                                                src={c.image ? c.image : defaultImage.PRODUCT_IMAGE}
                                                alt={c.name || 'Product Image'}
                                                className="img-fluid"
                                            />
                                        </div>
                                    </Col>

                                    <Col sm={7}>
                                        <div className="cart-card__content">
                                            <h1 className="cart-card__content__name">{c.name}</h1>
                                            <p className="cart-card__content__description">{c.description}</p>
                                            <p className="cart-card__content__quantity">Số lượng: {c.quantity}</p>
                                        </div>
                                    </Col>

                                    <Col sm={2}>
                                        <Button onClick={() => removeProduct(c.id)}>Xóa</Button>
                                        <Button>Cập nhập</Button>
                                    </Col>
                                </div>
                            </Row>
                        ))}
                    </Col>
                </Row>
            </div>
        </Container>
    );
};

export default Cart;