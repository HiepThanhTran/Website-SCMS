import { Container, Row, Col, Form } from "react-bootstrap";
import { useState, useEffect } from "react";
import cookie from "react-cookies";
import { useParams } from "react-router-dom";
import APIs, { endpoints } from '../../configs/APIs';
import { defaultImage } from '../../utils/Constatns';
import { useUser } from '../../store/contexts/UserContext';
import "./Product.css";

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        const loadProductDetail = async () => {
            try {
                const res = await APIs.get(endpoints.getProduct(id));
                setProduct(res.data);
            } catch (err) {
                console.error(err);
            }
        };

        loadProductDetail();
    }, [id]);

    const handleQuantityChange = (e) => {
        const value = parseInt(e.target.value, 10);
        if (!isNaN(value) && value > 0) {
            setQuantity(value);
        }
    };

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
                                            alt={product.name || "Product Image"}
                                            className="img-fluid"
                                        />
                                    </div>
                                </Col>

                                <Col sm={6}>
                                    <div className="product-detail__content">
                                        <h1 className="product-detail__content--name">{product.name}</h1>
                                        <p className="product-detail__content--description">Mô tả sản phẩm: {product.description}</p>
                                        <p className="product-detail__content--price">Giá: {product.price} VNĐ</p>

                                        <div className="product-detail__quantity">
                                            <h1 className="product-detail__quantity--title">Số lượng:</h1>

                                            <Form.Group className="mb-3">
                                                <Form.Control
                                                    type="text"
                                                    name="lastName"
                                                    value={quantity}
                                                    onChange={handleQuantityChange}
                                                    style={{ width: "200px" }}
                                                />
                                            </Form.Group>
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

export default ProductDetail;