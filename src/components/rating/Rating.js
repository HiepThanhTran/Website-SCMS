import { Container, Row, Col } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import APIs, { authAPI, endpoints } from '../../configs/APIConfigs';
import Loading from '../../layout/loading/Loading';
import './Rating.css';
import { routeUrl } from '../../App';

const Rating = () => {
   const [suppliers, setSuppliers] = useState([]);
   const [loading, setLoading] = useState(true);
   const navigate = useNavigate();

   console.log(suppliers);
   const loadSuppliers = async () => {
      try {
         const res = await APIs.get(endpoints.suppliers);
         const data = res.data;
         setSuppliers(data);
      } catch (error) {
         console.error(error);
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      loadSuppliers();
   }, []);

   if (loading) {
      return <Loading />;
   }

   const handleSupplierClick = (supplierId) => {
      navigate(routeUrl.RATING_DETAILS(supplierId));
   };

   return (
      <Container className="rating-container">
         <div className="shadow-lg p-3 mb-3 bg-body rounded gap-3">
            <Row>
               <h1 className="rating-container__title">Danh sách nhà cung cấp</h1>
               {suppliers.map((supplier) => (
                  <Col sm={12} md={4} lg={3} key={supplier.id} className="mb-3">
                     <div
                        className="supplier-card shadow-sm p-3 bg-body rounded"
                        onClick={() => handleSupplierClick(supplier.id)}
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
