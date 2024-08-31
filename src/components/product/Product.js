import { Container, Row, Col } from "react-bootstrap";
import { useState, useEffect, useCallback } from "react";
import APIs, { endpoints } from '../../configs/APIs';
import { defaultImage, statusCode } from '../../utils/Constatns';
import "./Product.css";

const Product = () => {
   const [products, setProducts] = useState([]);
   const [page, setPage] = useState(1);
   const [size, setSize] = useState(8);
   const [name, setName] = useState("");

   const loadProduct = async () => {
      try {
         const params = new URLSearchParams({
            page: page,
            size: size,
            name: name
         });

         const res = await APIs.get(`${endpoints.products}?${params}`);
         setProducts(res.data);
      } catch (err) {
         console.error(err);
      }
   };

   useEffect(() => {
      loadProduct();
   }, [page, size, name]);

   const handleSearch = useCallback((event) => {
		setName(event.target.value);
		setPage(1);
	}, []);


   const handleNextPage = () => {
      setPage((prevPage) => prevPage + 1);
   };

   const handlePrevPage = () => {
      setPage((prevPage) => (prevPage > 1 ? prevPage - 1 : 1));
   };

   return (
      <Container className="product-container">
         <div className="shadow-lg p-3 mb-3 bg-body rounded gap-3">
            <Row>
               <Col sm={3}>
                  <div className="title-filter">
                     <h3 className="title-filter">Bộ lọc nâng cao</h3>
                  </div>

                  <div className="filter-category">
                     <i class='bx bxs-category'></i>
                     <h3 className="filter-category__title">Danh mục</h3>
                  </div>
               </Col>

               <Col sm={9}>
                  <Row>
                     <div className="product__search">
                        <input
                           type="text"
                           className="product__search--input"
                           placeholder="Nhập tên sản phẩm..."
                           onChange={handleSearch}
                           value={name}

                        />
                     </div>
                     {products.map((product, index) => (
                        <Col sm={3} key={index} className="mb-4">
                           <div className="product-card">
                              <div className="product-card__image">
                                 <img
                                    src={product.image ? product.image : defaultImage.PRODUCT_IMAGE}
                                    alt={product.name || "Ảnh sản phẩm"}
                                 />
                              </div>

                              <div className="product-card__content">
                                 <h1 className="product-card__content--title">{product.name}</h1>
                                 <p className="product-card__content--des">
                                    Mô tả: {product.description}
                                 </p>
                                 <span>Giá: {product.price} VNĐ</span>
                              </div>

                              <div className="product-car__button">
                                 <button>
                                    <i class='bx bxs-cart-add'></i>
                                 </button>
                              </div>
                           </div>
                        </Col>
                     ))}

                     <div className="text-center mt-4">
                        <button className="btn-page me-2 me-3" onClick={handlePrevPage} disabled={page === 1}>
                           <i className="bx bxs-left-arrow"></i>
                        </button>
                        <button className="btn-page" onClick={handleNextPage} disabled={products.length < size}>
                           <i className="bx bxs-right-arrow"></i>
                        </button>
                     </div>

                  </Row>
               </Col>
            </Row>
         </div>
      </Container>
   );
};

export default Product;