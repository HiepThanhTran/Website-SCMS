import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { CSSTransition } from 'react-transition-group';
import APIs, { endpoints } from '../../configs/APIConfigs';
import Loading from '../../layout/loading/Loading';
import './Rating.css';

const RatingDetails = () => {
   const { supplierId } = useParams();
   const [supplier, setSupplier] = useState(null);
   const [loading, setLoading] = useState(true);

   console.log(supplier);

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

   useEffect(() => {
      loadSupplierDetail();
   }, [loadSupplierDetail]);

   if (loading || !supplier) {
      return <Loading />;
   }

   return (
      <CSSTransition in={!loading} timeout={1000} classNames="fade" unmountOnExit>
         <Container className="rating-container">
            <h1>Tên nhà cung cấp: {supplier.name}</h1>
            <p>Thông tin liên hệ: {supplier.contactInfo}</p>
            <p>Rating: {supplier.phone}</p>
            <p>Rating: {supplier.address}</p>
         </Container>
      </CSSTransition>
   );
};

export default RatingDetails;
