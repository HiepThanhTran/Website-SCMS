import { useState } from "react";
import { Alert, Card, Button, Row, Col, Container } from "react-bootstrap";
import cookie from "react-cookies";
import "./Cart.css";

const Cart = () => {
    const [cart, setCart] = useState(cookie.load("cart") || null);

    return (
        <Container>
            <div className="shadow-lg p-3 mb-3 bg-body rounded gap-3">
                <Row>
                    <Col sm={12}>
                        <div className="cart-container">
                            <h1>Giỏ hàng của bạn</h1>

                            {cart === null ? (
                                <Alert variant="warning">Không có sản phẩm</Alert>
                            ) : (
                                <Row className="g-3">
                                    {Object.values(cart).map((c) => (
                                        <Col key={c.id} xs={12} sm={6} md={4} lg={3} className="h-100">
                                            <Card className="h-100" style={{ width: "100%" }}>
                                                <Card.Body>
                                                    <Card.Title>{c.name}</Card.Title>
                                                    <Card.Text>
                                                        <strong>ID:</strong> {c.id}
                                                    </Card.Text>
                                                    <Card.Text>
                                                        <strong>Đơn giá:</strong> {c.price}
                                                    </Card.Text>
                                                    <Card.Text>
                                                        <strong>Số lượng:</strong> {c.quantity}
                                                    </Card.Text>
                                                    <Button variant="danger">
                                                        X
                                                    </Button>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    ))}
                                </Row>
                            )}
                        </div>
                    </Col>
                </Row>
            </div>

        </Container>
    );
}

export default Cart;