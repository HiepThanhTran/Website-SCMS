import { Container, Row, Col, Card, Modal, Button, Form } from "react-bootstrap";
import { authAPI, endpoints } from '../../configs/APIs';
import Loading from '../../layout/loading/Loading';
import { statusOrderName, statusOrder } from '../../utils/Constatns';
import { useEffect, useState } from "react";
import { typeOrder, typeOrderName } from "../../utils/Constatns";
import Swal from 'sweetalert2';

const OrderSupplier = () => {
    const [loading, setLoading] = useState(true);
    const [orderSupplier, setOrderSupplier] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [currentOrderSupplier, setCurrentOrderSupplier] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState('');
    const [filterType, setFilterType] = useState('');
    const [filterStatus, setFilterStatus] = useState('');

    const loadOrdersSupplier = async () => {
        try {
            const res = await authAPI().get(endpoints.orders);
            const data = res.data;
            setOrderSupplier(data);
            setFilteredOrders(data);
        } catch (error) {
            console.error(error);
        } finally {
            setTimeout(() => {
                setLoading(false);
            }, 1000);
        }
    };

    useEffect(() => {
        loadOrdersSupplier();
    }, []);

    useEffect(() => {
        const filtered = orderSupplier.filter(order => 
            (filterType ? order.type === filterType : true) &&
            (filterStatus ? order.status === filterStatus : true)
        );
        setFilteredOrders(filtered);
    }, [filterType, filterStatus, orderSupplier]);

    const handleCardClick = (order) => {
        setCurrentOrderSupplier(order);
        setSelectedStatus(order.status);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleStatusChange = (e) => {
        setSelectedStatus(e.target.value);
    };

    const handleFilterTypeChange = (e) => {
        setFilterType(e.target.value);
    };

    const handleFilterStatusChange = (e) => {
        setFilterStatus(e.target.value);
    };

    const updateOrderStatus = async () => {
        try {
            const url = endpoints.updateStatusOrder(currentOrderSupplier.orderNumber);
            
            await authAPI().patch(url, { status: selectedStatus });
            
            Swal.fire({
                icon: 'success',
                title: 'Cập nhật thành công',
                text: 'Trạng thái đơn hàng đã được cập nhật thành công',
            });

            loadOrdersSupplier();
            handleCloseModal();
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: 'Không thể cập nhật trạng thái đơn hàng',
            });
        }
    };

    if (loading) return <Loading />;

    return (
        <Container className="order-supplier-container">
            <div className="shadow-lg p-3 mb-3 bg-body rounded gap-3">
                <h1 className="order-supplier__title mb-5 mt-4">Xử lý đơn hàng</h1>
                <Row className="mb-3">
                    <Col md={6}>
                        <Form.Group controlId="filterType">
                            <Form.Label
                                style={{
                                    fontSize: "1.125rem",
                                    color: 'var(--text-color)',
                                    fontWeight: '500'
                                }}
                            >
                                Lọc theo loại</Form.Label>
                            <Form.Control as="select" value={filterType} onChange={handleFilterTypeChange}>
                                <option value="">Tất cả loại</option>
                                {Object.entries(typeOrderName).map(([key, value]) => (
                                    <option key={key} value={key}>
                                        {value}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group controlId="filterStatus">
                            <Form.Label
                                 style={{
                                    fontSize: "1.125rem",
                                    color: 'var(--text-color)',
                                    fontWeight: '500'
                                }}
                            >
                                Lọc theo trạng thái</Form.Label>
                            <Form.Control as="select" value={filterStatus} onChange={handleFilterStatusChange}>
                                <option value="">Tất cả trạng thái</option>
                                {Object.entries(statusOrderName).map(([key, value]) => (
                                    <option key={key} value={key}>
                                        {value}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    {filteredOrders.map((order) => (
                        <Col sm={12} md={4} key={order.orderNumber} className="mb-3">
                            <Card className="order__card" onClick={() => handleCardClick(order)}>
                                <Card.Body>
                                    <Card.Title className="order__title--number text-nowrap">
                                        Đơn hàng:
                                        <br />
                                        {order.orderNumber}
                                    </Card.Title>
                                    <Card.Text className="order__title--content">Ngày đặt hàng: {order.orderDate}</Card.Text>
                                    <Card.Text className="order__title--content">
                                        Thời gian giao hàng: {order.expectedDelivery || 'Chưa cập nhật'}
                                    </Card.Text>
                                    <Card.Text className="order__title--content">
                                        Loại: {typeOrderName[order.type] || 'Trạng thái không xác định'}
                                    </Card.Text>
                                    <Card.Text className="order__title--content">
                                        Trạng thái: {statusOrderName[order.status] || 'Trạng thái không xác định'}
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </div>

            <Modal show={showModal} onHide={handleCloseModal} className="custom-modal">
                <Modal.Header closeButton>
                    <Modal.Title>Chi tiết đơn hàng</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {currentOrderSupplier && (
                        <>
                            <p>
                                <strong>Mã đơn hàng:</strong> {currentOrderSupplier.orderNumber}
                            </p>
                            <p>
                                <strong>Ngày đặt hàng:</strong> {currentOrderSupplier.orderDate}
                            </p>
                            <p>
                                <strong>Thời gian giao hàng:</strong> {currentOrderSupplier.expectedDelivery || 'Chưa cập nhật'}
                            </p>
                            <p>
                                <strong>Loại:</strong>{' '}
                                {typeOrderName[currentOrderSupplier.type] || 'Trạng thái không xác định'}
                            </p>
                            <Form.Group controlId="formOrderStatus">
                                <Form.Label>Trạng thái đơn hàng</Form.Label>
                                <Form.Control
                                    as="select"
                                    value={selectedStatus}
                                    onChange={handleStatusChange}
                                >
                                    {Object.entries(statusOrderName).map(([key, value]) => (
                                        <option key={key} value={key}>
                                            {value}
                                        </option>
                                    ))}
                                </Form.Control>
                            </Form.Group>
                            <hr />
                            <h5>Danh sách sản phẩm:</h5>
                            {currentOrderSupplier.orderDetailsSet.length > 0 ? (
                                <ul>
                                    {currentOrderSupplier.orderDetailsSet.map((detail) => (
                                        <li key={detail.id}>
                                            <p>
                                                <strong>Sản phẩm:</strong> {detail.product.name}
                                            </p>
                                            <p>
                                                <strong>Mô tả:</strong> {detail.product.description}
                                            </p>
                                            <p>
                                                <strong>Số lượng:</strong> {detail.quantity}
                                            </p>
                                            <p>
                                                <strong>Giá mỗi đơn vị:</strong> {detail.unitPrice.toLocaleString()} VND
                                            </p>
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
                    <Button variant="primary" onClick={updateOrderStatus}>
                        Cập nhật
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default OrderSupplier;