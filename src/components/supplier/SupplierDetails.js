import { useCallback, useEffect, useState } from 'react';
import { Button, Col, Container, Form, Modal, Row } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import Swal from 'sweetalert2';
import APIs, { authAPI, endpoints } from '../../configs/APIConfigs';
import Loading from '../../layout/loading/Loading';
import { useUser } from '../../store/contexts/UserContext';
import { criteriaTypesName, criteriaType, defaultImage, statusCode } from '../../utils/Constatns';
import Toast from '../../utils/Utils';
import './Supplier.css';

const SupplierDetails = () => {
   const [user] = useUser();

   const [supplier, setSupplier] = useState(null);
   const [ratings, setRatings] = useState([]);
   const [selectedRating, setSelectedRating] = useState(null);
   const [criteriaValue, setCriteriaValue] = useState(Object.keys(criteriaTypesName)[0]);
   const [contentValue, setContentValue] = useState('');
   const [ratingValue, setRatingValue] = useState(1);
   const [loading, setLoading] = useState(false);
   const [visibleRatingsCount, setVisibleRatingsCount] = useState(10);
   const [isModalVisible, setIsModalVisible] = useState(false);
   const [isAddRatingModalVisible, setIsAddRatingModalVisible] = useState(false);

   const [isEditRatingModalVisible, setIsEditRatingModalVisible] = useState(false);
   const [editContentValue, setEditContentValue] = useState('');
   const [editRatingValue, setEditRatingValue] = useState(1);
   const [editCriteriaValue, setEditCriteriaValue] = useState('');
   const [editRatingId, setEditRatingId] = useState(null);

   const handleShowEditRatingModal = (rating) => {
      setEditContentValue(rating.content);
      setEditRatingValue(rating.rating);
      setEditCriteriaValue(rating.criteria);
      setEditRatingId(rating.id);
      setIsEditRatingModalVisible(true);
   };

   const handleCloseEditRatingModal = () => {
      setIsEditRatingModalVisible(false);
      setEditRatingId(null);
   };

   const { supplierId } = useParams();

   const loadSupplierDetails = useCallback(async () => {
      setLoading(true);
      try {
         const res = await APIs.get(endpoints.getSupplier(supplierId));
         setSupplier(res.data);
      } catch (error) {
         console.error(error);
      } finally {
         setLoading(false);
      }
   }, [supplierId]);

   const loadRatings = useCallback(async () => {
      setLoading(true);
      try {
         const res = await APIs.get(endpoints.getRatingsOfSupplier(supplierId));

         const sortedRatings = res.data.sort((a, b) => b.id - a.id);
         setRatings(sortedRatings);
      } catch (error) {
         console.error(error);
      } finally {
         setLoading(false);
      }
   }, [supplierId]);

   useEffect(() => {
      loadSupplierDetails();
      loadRatings();
   }, [loadSupplierDetails, loadRatings]);

   const handleShowMore = () => {
      setVisibleRatingsCount((prevCount) => {
         const newCount = prevCount + 10;
         return newCount >= ratings.length ? ratings.length : newCount;
      });
   };

   const handleShowLess = () => setVisibleRatingsCount(10);

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
      setRatingValue(value < 1 ? 1 : value > 5 ? 5 : value);
   };

   const handleContentChange = (event) => setContentValue(event.target.value);

   const renderStars = (rating) => {
      const stars = [];
      for (let i = 0; i < 5; i++) {
         stars.push(
            <i
               key={i}
               className={`bx bxs-star ${i < rating ? 'filled' : ''}`}
               style={{ color: i < rating ? 'var(--primary-color)' : '#ddd' }}
            />,
         );
      }
      return stars;
   };

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

         if (res.status === statusCode.HTTP_200_OK) {
            setRatings((prevRatings) => [res.data, ...prevRatings]);

            setCriteriaValue(Object.keys(criteriaTypesName)[0] || '');
            setContentValue('');
            setRatingValue(1);

            handleCloseAddRatingModal();

            Toast.fire({
               icon: 'success',
               title: 'Đánh giá thành công',
               text: 'Bạn đã gửi đánh giá thành công',
            });
         }
      } catch (error) {
         Toast.fire({
            icon: 'error',
            title: 'Gửi đánh giá thất bại',
            text:
               error?.response?.data.map((data) => data.message).join('\n') ||
               'Hệ thống đang bận, vui lòng thử lại sau',
         });
      }
   };

   const updateRating = async (e) => {
      e.preventDefault();

      handleCloseEditRatingModal();
      const formData = new FormData();
      formData.append('criteria', editCriteriaValue);
      formData.append('content', editContentValue);
      formData.append('rating', editRatingValue);
  
      try {
          const res = await authAPI().post(endpoints.detailsRating(editRatingId), formData, {
              headers: { 'Content-Type': 'multipart/form-data' },
          });
  
          if (res.status === statusCode.HTTP_200_OK) {
              setRatings((prevRatings) => 
                  prevRatings.map((rating) =>
                      rating.id === editRatingId ? res.data : rating
                  )
              );
  
              Toast.fire({
                  icon: 'success',
                  title: 'Cập nhật đánh giá thành công',
                  text: 'Bạn đã cập nhật đánh giá thành công',
              });
          }
      } catch (error) {
          Toast.fire({
              icon: 'error',
              title: 'Cập nhật đánh giá thất bại',
              text: 
                  error?.response?.data.map((data) => data.message).join('\n') ||
                  'Hệ thống đang bận, vui lòng thử lại sau',
          });
      }
  };
  
   const deleteRating = async (e, ratingId) => {
      e.stopPropagation();
      e.preventDefault();

      Swal.fire({
         title: 'Xác nhận xóa đánh giá',
         text: 'Bạn chắc chắn muốn xóa đánh giá?',
         icon: 'warning',
         showCancelButton: true,
         confirmButtonText: 'Có',
         cancelButtonText: 'Không',
         customClass: {
            confirmButton: 'swal2-confirm',
         },
      }).then(async (result) => {
         if (result.isConfirmed) {
            try {
               const res = await authAPI().delete(endpoints.detailsRating(ratingId));

               if (res.status === statusCode.HTTP_204_NO_CONTENT) {
                  setRatings((prevRatings) => prevRatings.filter((rating) => rating.id !== ratingId));

                  Toast.fire({
                     icon: 'success',
                     title: 'Xóa đánh giá thành công',
                     text: 'Bạn đã xóa đánh giá thành công',
                  });
               }
            } catch (error) {
               Toast.fire({
                  icon: 'error',
                  title: 'Xóa đánh giá thất bại',
                  text:
                     error?.response?.data.map((data) => data.message).join('\n') ||
                     'Hệ thống đang bận, vui lòng thử lại sau',
               });
            }
         }
      });
   };

   if (!supplier) return <Loading />;

   return (
      <Container className="rating-details-container">
         <div className="shadow-lg p-3 mb-3 bg-body rounded gap-3">
            <Row>
               <Col sm={12}>
                  <h1 className="rating-details-title mb-4 mt-3">CHI TIẾT NHÀ CUNG CẤP</h1>
                  <CSSTransition in={!loading} timeout={1000} classNames="fade" unmountOnExit>
                     <Container className="container-rating">
                        <div className="rating-details-card">
                           <div className="rating-details-card__content">
                              <i className="bx bxs-id-card"></i>
                              <h1 className="rating-details-card__name">Tên nhà cung cấp: {supplier.name}</h1>
                           </div>

                           <div className="rating-details-card__content">
                              <i className="bx bxs-phone"></i>
                              <h1 className="rating-details-card__name">Số điện thoại: {supplier.phone}</h1>
                           </div>

                           <div className="rating-details-card__content">
                              <i className="bx bx-current-location"></i>
                              <h1 className="rating-details-card__name">Địa chỉ: {supplier.address}</h1>
                           </div>

                           <div className="rating-details-card__content">
                              <i className="bx bxs-contact"></i>
                              <h1 className="rating-details-card__name">Thông tin liên hệ: {supplier.contactInfo}</h1>
                           </div>
                        </div>
                     </Container>
                  </CSSTransition>

                  <div className="rating-user">
                     <div className="add-rating-user">
                        <h1 className="rating-user__total">Các đánh giá - {ratings.length} đánh giá</h1>
                        <i className="bx bxs-message-add" onClick={handleShowAddRatingModal}></i>
                     </div>

                     <div className="rating-user__list">
                        {ratings.slice(0, visibleRatingsCount).map((rating, index) => (
                           <div key={index} className="rating-user__item" onClick={() => handleShowModal(rating)}>
                              <div className="rating-user__image">
                                 <img src={rating.user.avatar || defaultImage.USER_AVATAR} alt="User Avatar" />
                              </div>

                              <div className="rating-user__content">
                                 <h1>Người đánh giá: {rating.user.username}</h1>
                                 <p>Ngày đánh giá: {rating.createdAt}</p>
                                 <h1>Tiêu chí: {criteriaTypesName[rating.criteria]}</h1>
                                 <h1>Đánh giá: {renderStars(rating.rating)}</h1>
                                 <h1>Nội dung: {rating.content}</h1>
                              </div>

                              {user?.data?.username === rating.user.username && (
                                 <div className="rating-user__dots">
                                    <div className="rating-user__dots--hover">...</div>
                                    <div className="rating-user__dots--box">
                                       <span
                                          onClick={(e) => {
                                             e.stopPropagation();
                                             handleShowEditRatingModal(rating);
                                          }}
                                          style={{ padding: '12px 12px 4px 12px' }}
                                       >
                                          Chỉnh sửa
                                       </span>
                                       <span
                                          onClick={(e) => deleteRating(e, rating.id)}
                                          style={{ padding: '4px 12px 12px 12px' }}
                                       >
                                          Xóa
                                       </span>
                                    </div>
                                 </div>
                              )}
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
                                       width: '100px',
                                    }}
                                    onClick={handleShowMore}
                                 >
                                    Xem thêm
                                 </Button>
                              )}
                              {visibleRatingsCount > 10 && (
                                 <Button
                                    className="btn-rating-details"
                                    style={{
                                       backgroundColor: 'var(--primary-color)',
                                       border: 'none',
                                       fontWeight: 500,
                                       width: '100px',
                                       marginLeft: '20px',
                                    }}
                                    onClick={handleShowLess}
                                 >
                                    Thu gọn
                                 </Button>
                              )}
                           </>
                        )}
                     </div>
                  </div>
               </Col>
            </Row>
         </div>

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
                        }}
                     >
                        <img
                           style={{
                              width: '100px',
                              height: '100px',
                           }}
                           src={selectedRating.user.avatar || defaultImage.USER_AVATAR}
                           alt="User Avatar"
                        />
                     </div>
                     <Form.Group className="mb-3">
                        <Form.Label>Người đánh giá</Form.Label>
                        <Form.Control type="text" value={selectedRating.user.username || ''} readOnly />
                     </Form.Group>

                     <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" value={selectedRating.user.email || ''} readOnly />
                     </Form.Group>

                     <Form.Group className="mb-3">
                        <Form.Label>Nội dung</Form.Label>
                        <Form.Control as="textarea" rows={3} value={selectedRating.content || ''} readOnly />
                     </Form.Group>

                     <Form.Group className="mb-3">
                        <Form.Label>Đánh giá</Form.Label>
                        <Form.Control type="text" value={selectedRating.rating} readOnly />
                     </Form.Group>

                     <Form.Group className="mb-3">
                        <Form.Label>Tiêu chí</Form.Label>
                        <Form.Control
                           type="text"
                           value={criteriaTypesName[selectedRating.criteria] || selectedRating.criteria || ''}
                           readOnly
                        />
                     </Form.Group>
                  </Form>
               )}
            </Modal.Body>
         </Modal>

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
                     <Form.Control as="select" value={criteriaValue} onChange={(e) => setCriteriaValue(e.target.value)}>
                        {Object.entries(criteriaTypesName).map(([key, value]) => (
                           <option key={key} value={key}>
                              {value}
                           </option>
                        ))}
                     </Form.Control>
                  </Form.Group>

                  <Form.Group className="mb-3">
                     <Form.Label>Nội dung</Form.Label>
                     <Form.Control as="textarea" rows={3} value={contentValue} onChange={handleContentChange} />
                  </Form.Group>

                  <Form.Group className="mb-3">
                     <Form.Label>Đánh giá</Form.Label>
                     <Form.Control type="number" min="1" value={ratingValue} onChange={handleRatingChange} />
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
                           width: '120px',
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

         {/* Modal Edit Rating */}
         <Modal
            style={{ height: '520px', marginTop: '100px' }}
            show={isEditRatingModalVisible}
            onHide={handleCloseEditRatingModal}
            centered
            scrollable
         >
            <Modal.Header closeButton>
               <Modal.Title>Chỉnh sửa đánh giá</Modal.Title>
            </Modal.Header>
            <Modal.Body>
               <Form>
                  <Form.Group className="mb-3">
                     <Form.Label>Tiêu chí</Form.Label>
                     <Form.Control
                        as="select"
                        value={editCriteriaValue}
                        onChange={(e) => setEditCriteriaValue(e.target.value)}
                     >
                        {Object.entries(criteriaTypesName).map(([key, value]) => (
                           <option key={key} value={key}>
                              {value}
                           </option>
                        ))}
                     </Form.Control>
                  </Form.Group>

                  <Form.Group className="mb-3">
                     <Form.Label>Nội dung</Form.Label>
                     <Form.Control
                        as="textarea"
                        rows={3}
                        value={editContentValue}
                        onChange={(e) => setEditContentValue(e.target.value)}
                     />
                  </Form.Group>

                  <Form.Group className="mb-3">
                     <Form.Label>Đánh giá</Form.Label>
                     <Form.Control
                        type="number"
                        min="1"
                        max="5"
                        value={editRatingValue}
                        onChange={(e) => setEditRatingValue(Number(e.target.value))}
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
                        onClick={updateRating}
                        style={{
                           backgroundColor: 'var(--primary-color)',
                           border: 'none',
                           fontWeight: 500,
                           width: '120px',
                        }}
                        variant="primary"
                     >
                        Cập nhật
                     </Button>
                  </div>
               </Form>
            </Modal.Body>
         </Modal>

      </Container>
   );
};

export default SupplierDetails;
