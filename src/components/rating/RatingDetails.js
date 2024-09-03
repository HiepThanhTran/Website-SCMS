import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col, Button, Modal } from "react-bootstrap";
import { CSSTransition } from "react-transition-group";
import APIs, { endpoints } from '../../configs/APIs';
import Loading from '../../layout/loading/Loading';
import { defaultImage } from '../../utils/Constatns';
import './Rating.css';

const RatingDetails = () => {
    const { supplierId } = useParams();
    const [supplier, setSupplier] = useState(null);
    const [ratings, setRatings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [visibleRatingsCount, setVisibleRatingsCount] = useState(10);
    const [showAllRatings, setShowAllRatings] = useState(false);
    const [selectedRating, setSelectedRating] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const loadSupplierDetail = useCallback(async () => {
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

    const handleShowMore = () => {
        setVisibleRatingsCount(ratings.length);
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

    const renderStars = (rating) => {
        const stars = [];
        for (let i = 0; i < 5; i++) {
            stars.push(
                <i 
                    key={i}
                    className={`bx bxs-star ${i < rating ? 'filled' : ''}`} 
                    style={{ color: i < rating ? '#FFD700' : '#ddd' }} 
                />
            );
        }
        return stars;
    };

    if (loading || !supplier) {
        return <Loading />;
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
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {ratings.length > 10 && (
                                <div className="rating-user__actions d-flex justify-content-center">
                                    {showAllRatings ? (
                                        <Button variant="primary" onClick={handleShowLess}>Thu gọn</Button>
                                    ) : (
                                        <Button variant="primary" onClick={handleShowMore}>Xem thêm</Button>
                                    )}
                                </div>
                            )}
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
                        <div className="rating-modal-content">
                            <img src={selectedRating.user.avatar || defaultImage.USER_AVATAR} alt="User Avatar" />
                            <h2>Username: {selectedRating.user.username}</h2>
                            <p>Nội dung: {selectedRating.content}</p>
                            <p>Đánh giá: {renderStars(selectedRating.rating)}</p>
                        </div>
                    )}
                </Modal.Body>
            </Modal>
        </Container>
    );
};

export default RatingDetails;