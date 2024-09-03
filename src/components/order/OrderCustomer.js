import React, { useEffect, useState } from 'react';
import { Col, Container, Row, Card, Modal, Button } from 'react-bootstrap';
import { authAPI, endpoints } from '../../configs/APIs';
import { statusOrderName } from '../../utils/Constatns';
import Loading from '../../layout/loading/Loading';
import "./Order.css";

const OrderCustomer = () => {
    const [orders, setOrders] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [currentOrder, setCurrentOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    const loadOrders = async () => {
        try {
            const res = await authAPI().get(endpoints.orders);
            const data = res.data;
            setOrders(data);
        } catch (error) {
            console.error(error);
        } finally {
            setTimeout(() => {
                setLoading(false);
            }, 1000);
        } 
    };

    useEffect(() => {
        loadOrders();
    }, []);

    const handleCardClick = (order) => {
        setCurrentOrder(order);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    return (
        <Container className='order-container'>
            {loading ? (
                <Loading />
            ) : (
                <>
                    <div className='shadow-lg p-3 mb-3 bg-body rounded gap-3'>
                        <h1 className='order__title mt-4 mb-4'>Đơn hàng của bạn</h1>
                        <Row>
                            {orders.map((order) => (
                                <Col sm={12} md={4} key={order.orderNumber} className='mb-3'>
                                    <Card className='order__card' onClick={() => handleCardClick(order)}>
                                        <Card.Body>
                                            <Card.Title className='order__title--number'>Mã đơn hàng: {order.orderNumber}</Card.Title>
                                            <Card.Text className='order__title--content'>Ngày đặt hàng: {order.orderDate}</Card.Text>
                                            <Card.Text className='order__title--content'>Thời gian giao hàng: {order.expectedDelivery || 'Chưa cập nhật'}</Card.Text>
                                            <Card.Text className='order__title--content'>Trạng thái: {statusOrderName[order.status] || 'Trạng thái không xác định'}</Card.Text>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </div>

                    {/* Modal */}
                    <Modal show={showModal} onHide={handleCloseModal} className="custom-modal">
                        <Modal.Header closeButton>
                            <Modal.Title>Chi tiết đơn hàng</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {currentOrder && (
                                <>
                                    <p><strong>Mã đơn hàng:</strong> {currentOrder.orderNumber}</p>
                                    <p><strong>Ngày đặt hàng:</strong> {currentOrder.orderDate}</p>
                                    <p><strong>Thời gian giao hàng:</strong> {currentOrder.expectedDelivery || 'Chưa cập nhật'}</p>
                                    <p><strong>Trạng thái:</strong> {statusOrderName[currentOrder.status] || 'Trạng thái không xác định'}</p>
                                    <hr />
                                    <h5>Danh sách sản phẩm:</h5>
                                    {currentOrder.orderDetailsSet.length > 0 ? (
                                        <ul>
                                            {currentOrder.orderDetailsSet.map((detail) => (
                                                <li key={detail.id}>
                                                    <p><strong>Sản phẩm:</strong> {detail.product.name}</p>
                                                    <p><strong>Mô tả:</strong> {detail.product.description}</p>
                                                    <p><strong>Số lượng:</strong> {detail.quantity}</p>
                                                    <p><strong>Giá mỗi đơn vị:</strong> {detail.unitPrice.toLocaleString()} VND</p>
                                                    <hr />
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p>Không có sản phẩm nào.</p>
                                    )}
                                </>
                            )}
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleCloseModal}>
                                Đóng
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </>
            )}
        </Container>
    );
}

export default OrderCustomer;