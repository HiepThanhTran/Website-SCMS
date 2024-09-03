import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col, Button, Modal, Form, Toast } from "react-bootstrap";
import { CSSTransition } from "react-transition-group";
import APIs, { authAPI, endpoints } from '../../configs/APIs';
import Loading from '../../layout/loading/Loading';
import { defaultImage, criteriaName, statusCode } from '../../utils/Constatns';
import './Rating.css';
import Swal from "sweetalert2";

const RatingDetails = () => {
    const { supplierId } = useParams();
    const [supplier, setSupplier] = useState(null);
    const [ratings, setRatings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [visibleRatingsCount, setVisibleRatingsCount] = useState(10);
    const [showAllRatings, setShowAllRatings] = useState(false);
    const [selectedRating, setSelectedRating] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isAddRatingModalVisible, setIsAddRatingModalVisible] = useState(false);
    const [ratingValue, setRatingValue] = useState(1);
    const [criteriaValue, setCriteriaValue] = useState("");
    const [contentValue, setContentValue] = useState("");

    console.log(typeof ratingValue);

    const loadSupplierDetail = useCallback(async () => {
        setLoading(true);
        try {
            const res = await APIs.get(endpoints.getSupplier(supplierId));
            setSupplier(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setTimeout(() => {
                setLoading(false);
            }, 1000);
        }
    }, [supplierId]);

    const loadRatings = useCallback(async () => {
        try {
            const res = await APIs.get(endpoints.getRatingsOfSupplier(supplierId));
            setRatings(res.data);
        } catch (error) {
            console.error(error);
        }
    }, [supplierId]);

    useEffect(() => {
        loadSupplierDetail();
    }, [loadSupplierDetail]);

    useEffect(() => {
        loadRatings();
    }, [loadRatings]);

    useEffect(() => {
        const firstCriteria = Object.keys(criteriaName)[0];
        if (firstCriteria) {
            setCriteriaValue(firstCriteria);
        }
    }, []);

    const handleShowMore = () => {
        setVisibleRatingsCount(prevCount => {
            const newCount = prevCount + 10;
            return newCount >= ratings.length ? ratings.length : newCount;
        });
        setShowAllRatings(true);
    };

    const handleShowLess = () => {
        setVisibleRatingsCount(10);
        setShowAllRatings(false);
    };

    const handleShowModal = (rating) => {
        setSelectedRating(rating);
        setIsModalVisible(true);
    };

    const handleCloseModal = () => {
        setIsModalVisible(false);
        setSelectedRating(null);
    };

    const handleShowAddRatingModal = () => setIsAddRatingModalVisible(true);
    const handleCloseAddRatingModal = () => setIsAddRatingModalVisible(false);

    const handleRatingChange = (event) => {
        const value = Number(event.target.value);
        setRatingValue(value < 1 ? 1 : value);
    };

    const handleContentChange = (event) => {
        setContentValue(event.target.value);
    };

    const renderStars = (rating) => {
        const stars = [];
        for (let i = 0; i < 5; i++) {
            stars.push(
                <i
                    key={i}
                    className={`bx bxs-star ${i < rating ? 'filled' : ''}`}
                    style={{ color: i < rating ? 'var(--primary-color)' : '#ddd' }}
                />
            );
        }
        return stars;
    };

    if (loading) {
        return <Loading />;
    }

    if (!supplier) {
        return <Loading />;
    }

    const addRating = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('criteria', criteriaValue);
        formData.append('content', contentValue);
        formData.append('rating', ratingValue);

        try {
            let res = await authAPI().post(endpoints.addRatingForSupplier(supplierId), formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            console.log(res.status);

            if (res.status === statusCode.HTTP_200_OK) {
                Toast.fire({
                    icon: 'success',
                    title: 'Gửi đánh giá thành công',
                    text: 'Hồ sơ của bạn đã được cập nhật.',
                });
            }
        } catch (error) {
            const errorMessage = error.response?.data?.[0]?.message || 'Đã xảy ra lỗi không xác định';

            Swal.fire({
                icon: 'error',
                title: 'Gửi đánh giá thất bại',
                text: errorMessage,
            });
        }
    }

    return (
        <Container className="rating-details-container">
            <div className="shadow-lg p-3 mb-3 bg-body rounded gap-3">
                <Row>
                    <Col sm={12}>
                        <h1 className="rating-details-title mb-4 mt-3">Đánh giá của người dùng</h1>
                        <CSSTransition
                            in={!loading}
                            timeout={1000}
                            classNames="fade"
                            unmountOnExit
                        >
                            <Container className="container-rating">
                                <div className="rating-details-card">
                                    <div className="rating-details-card__content">
                                        <i className='bx bxs-id-card'></i>
                                        <h1 className="rating-details-card__name">Tên nhà cung cấp: {supplier.name}</h1>
                                    </div>

                                    <div className="rating-details-card__content">
                                        <i className='bx bxs-phone'></i>
                                        <h1 className="rating-details-card__name">Số điện thoại: {supplier.phone}</h1>
                                    </div>

                                    <div className="rating-details-card__content">
                                        <i className='bx bx-current-location'></i>
                                        <h1 className="rating-details-card__name">Địa chỉ: {supplier.address}</h1>
                                    </div>

                                    <div className="rating-details-card__content">
                                        <i className='bx bxs-contact'></i>
                                        <h1 className="rating-details-card__name">Thông tin liên hệ: {supplier.contactInfo}</h1>
                                    </div>
                                </div>
                            </Container>
                        </CSSTransition>

                        <div className="rating-user">
                            <h1 className="rating-user__total">Tổng số bình luận: {ratings.length}</h1>

                            <div className="add-rating-user">
                                <i className='bx bxs-message-add' onClick={handleShowAddRatingModal}></i>
                            </div>

                            <div className="rating-user__list">
                                {ratings.slice(0, visibleRatingsCount).map((rating, index) => (
                                    <div
                                        key={index}
                                        className="rating-user__item"
                                        onClick={() => handleShowModal(rating)}
                                    >
                                        <div className="rating-user__image">
                                            <img src={rating.user.avatar || defaultImage.USER_AVATAR} alt="User Avatar" />
                                        </div>

                                        <div className="rating-user__content">
                                            <h1>Username: {rating.user.username}</h1>
                                            <h1>Nội dung: {rating.content}</h1>
                                            <h1>Đánh giá: {renderStars(rating.rating)}</h1>
                                            <h1>Tiêu chí: {criteriaName[rating.criteria]}</h1>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="rating-user__actions d-flex justify-content-center">
                                {ratings.length > 10 && (
                                    <>
                                        {visibleRatingsCount < ratings.length && (
                                            <Button
                                                className="btn-rating-details"
                                                style={{
                                                    backgroundColor: 'var(--primary-color)',
                                                    border: 'none',
                                                    fontWeight: 500,
                                                    width: '100px'
                                                }}
                                                onClick={handleShowMore}>Xem thêm</Button>
                                        )}
                                        {visibleRatingsCount > 10 && (
                                            <Button
                                                className="btn-rating-details"
                                                style={{
                                                    backgroundColor: 'var(--primary-color)',
                                                    border: 'none',
                                                    fontWeight: 500,
                                                    width: '100px',
                                                    marginLeft: '20px'
                                                }}
                                                onClick={handleShowLess}>Thu gọn</Button>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>

            {/* Rating Detail Modal */}
            <Modal show={isModalVisible} onHide={handleCloseModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Chi tiết đánh giá</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedRating && (
                        <Form>
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}>
                                <img
                                    style={{
                                        width: '100px',
                                        height: '100px',
                                    }}
                                    src={selectedRating.user.avatar || defaultImage.USER_AVATAR}
                                    alt="User Avatar" />
                            </div>
                            <Form.Group className="mb-3">
                                <Form.Label>Username</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={selectedRating.user.username || ''}
                                    readOnly
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    value={selectedRating.user.email || ''}
                                    readOnly
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Nội dung</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    value={selectedRating.content || ''}
                                    readOnly
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Đánh giá</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={selectedRating.rating}
                                    readOnly
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Tiêu chí</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={criteriaName[selectedRating.criteria] || selectedRating.criteria || ''}
                                    readOnly
                                />
                            </Form.Group>
                        </Form>
                    )}
                </Modal.Body>
            </Modal>

            {/* Add Rating Modal */}
            <Modal
                style={{ height: '520px', marginTop: '100px' }}
                show={isAddRatingModalVisible}
                onHide={handleCloseAddRatingModal}
                centered
                scrollable
            >
                <Modal.Header closeButton>
                    <Modal.Title>Thêm đánh giá</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Tiêu chí</Form.Label>
                            <Form.Control
                                as="select"
                                value={criteriaValue}
                                onChange={(e) => setCriteriaValue(e.target.value)}
                            >
                                {Object.entries(criteriaName).map(([key, value]) => (
                                    <option key={key} value={key}>{value}</option>
                                ))}
                            </Form.Control>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Nội dung</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={contentValue}
                                onChange={handleContentChange}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Đánh giá</Form.Label>
                            <Form.Control
                                type="number"
                                min="1"
                                value={ratingValue}
                                onChange={handleRatingChange}
                            />
                        </Form.Group>

                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <Button
                                style={{
                                    backgroundColor: 'var(--primary-color)',
                                    border: 'none',
                                    fontWeight: 500,
                                    width: '120px'
                                }}
                                onClick={addRating}
                                variant="primary"
                            >
                                Gửi đánh giá
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </Container>
    );
};

export default RatingDetails;