import { useState, useEffect } from "react";
import { Button, Row, Col, Container, Form } from "react-bootstrap";
import cookie from "react-cookies";
import { defaultImage } from '../../utils/Constatns';
import "./Cart.css";
import { authAPI, endpoints } from '../../configs/APIs';

const Cart = () => {
    const [cart, setCart] = useState(cookie.load("cart") || {});
    const [quantity, setQuantity] = useState({});

    useEffect(() => {
        const initialQuantity = Object.keys(cart).reduce((acc, productId) => {
            acc[productId] = cart[productId].quantity;
            return acc;
        }, {});
        setQuantity(initialQuantity);
    }, [cart]);

    const removeProduct = async (productId) => {
        try {
            await authAPI().delete(endpoints.removeProductFromCart(productId));
            const updatedCart = { ...cart };
            delete updatedCart[productId];
            setCart(updatedCart);
            cookie.save("cart", updatedCart, { path: '/' });
        } catch (error) {
            console.error(error);
        }
    };

    const handleQuantityChange = (productId, newQuantity) => {
        setQuantity(prevQuantity => ({
            ...prevQuantity,
            [productId]: newQuantity
        }));
    };

    const updateQuantity = async (productId) => {
        try {
            await authAPI().put(endpoints.updateProductQuantity(productId), {
                quantity: quantity[productId]
            });
            const updatedCart = { ...cart, [productId]: { ...cart[productId], quantity: quantity[productId] } };
            setCart(updatedCart);
            cookie.save("cart", updatedCart, { path: '/' });
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Row>
            <Col sm={9}>
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
                                                    <Form.Group controlId={`quantity-${c.id}`}>
                                                        <Form.Label>Số lượng</Form.Label>
                                                        <Form.Control
                                                            style={{ width: "150px" }}
                                                            type="number"
                                                            value={quantity[c.id] || c.quantity}
                                                            onChange={(e) => handleQuantityChange(c.id, e.target.value)}
                                                        />
                                                    </Form.Group>
                                                </div>
                                            </Col>

                                            <Col sm={2}>
                                                <Button style={{ width: "100px", marginRight: "10px", backgroundColor: "var(--primary-color)", border: "none" }} onClick={() => removeProduct(c.id)}>Xóa</Button>
                                                <Button style={{ width: "100px", backgroundColor: "var(--primary-color)", border: "none" }} onClick={() => updateQuantity(c.id)}>Cập nhật</Button>
                                            </Col>
                                        </div>
                                    </Row>
                                ))}
                            </Col>
                        </Row>
                    </div>
                </Container>
            </Col>

            <Col sm={3}>
                <Container className="cart-container">
                    <div className="shadow-lg p-3 mb-3 bg-body rounded gap-3">
                        <h1 className="sumary-title mb-4">Tổng đơn hàng</h1>
                        <div className="summary-content">
                            <div className="summary-item">
                                <h2 className="summary-item__title">Sản phẩm</h2>
                                <p className="summary-item__value">1 sản phẩm</p>
                            </div>
                            <div className="summary-item">
                                <h2 className="summary-item__title">Ship</h2>
                                <p className="summary-item__value">Miễn phí</p>
                            </div>
                        </div>

                        <div className="summary-item">
                            <h2 className="summary-item__title">Tổng tiền</h2>
                            <p className="summary-item__value">
                                1.000.000 VNĐ
                            </p>
                        </div>

                        <div
                            className="summary-button"
                            style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <Button className="sumary-button">
                                Thanh toán
                            </Button>
                        </div>

                    </div>
                </Container>
            </Col>

        </Row>
    );
};

export default Cart;