import { useCallback, useEffect, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { routeUrl } from '../../App';
import APIs, { endpoints } from '../../configs/APIConfigs';
import Loading from '../../layout/loading/Loading';
import './Rating.css';

const Rating = () => {
   const [suppliers, setSuppliers] = useState([]);
   const [page, setPage] = useState(1);
   const [size] = useState(10);
   const [loading, setLoading] = useState(true);

   const navigate = useNavigate();

   const loadSuppliers = useCallback(async () => {
      setLoading(true);
      try {
         const res = await APIs.get(endpoints.suppliers, { params: { page, size } });

         setSuppliers(res.data);
      } catch (error) {
         console.error(error);
      } finally {
         setLoading(false);
      }
   }, [page, size]);

   useEffect(() => {
      loadSuppliers();
   }, [loadSuppliers]);

   if (loading) {
      return <Loading />;
   }

   return (
      <Container className="rating-container">
         <div className="shadow-lg p-3 mb-3 bg-body rounded gap-3">
            <Row>
               <h1 className="rating-container__title">Danh sách nhà cung cấp</h1>
               {suppliers.map((supplier) => (
                  <Col sm={12} md={4} lg={3} key={supplier.id} className="mb-3">
                     <div
                        className="supplier-card shadow-sm p-3 bg-body rounded"
                        onClick={() => navigate(routeUrl.RATING_DETAILS(supplier.id))}
                     >
                        <div className="supplier-card__item">
                           <i className="bx bxs-id-card"></i>
                           <span>Tên: {supplier.name}</span>
                        </div>

                        <div className="supplier-card__item">
                           <i className="bx bxs-phone"></i>
                           <span>Thông tin liên hệ: {supplier.contactInfo}</span>
                        </div>
                     </div>
                  </Col>
               ))}
            </Row>
         </div>
      </Container>
   );
};

export default Rating;
