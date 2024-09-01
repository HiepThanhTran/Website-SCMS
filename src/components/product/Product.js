import { useCallback, useContext, useEffect, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import cookie from 'react-cookies';
import { useNavigate } from 'react-router-dom';
import { MyCartContext } from '../../App';
import APIs, { endpoints } from '../../configs/APIs';
import { defaultImage } from '../../utils/Constatns';
import './Product.css';

const Product = () => {
   const [, dispatch] = useContext(MyCartContext);
   const [products, setProducts] = useState([]);
   const [categories, setCategories] = useState([]);
   const [page, setPage] = useState(1);
   const [size, setSize] = useState(8);
   const [name, setName] = useState('');
   const [category, setCategory] = useState('');

   const navigate = useNavigate();

   const loadProduct = useCallback(async () => {
      try {
         const res = await APIs.get(endpoints.products, {
            params: { page, size, name, category },
         });
         setProducts(res.data);
      } catch (err) {
         console.error(err);
      }
   }, [page, size, name, category]);

   const loadCategories = async () => {
      try {
         const res = await APIs.get(endpoints.categories);
         setCategories(res.data);
      } catch (err) {
         console.error(err);
      }
   };

   useEffect(() => {
      loadCategories();
   }, []);

   useEffect(() => {
      loadProduct();
   }, [loadProduct]);

   const handleSearch = useCallback((event) => {
      setName(event.target.value);
      setPage(1);
   }, []);

   const handleCategoryChange = useCallback((event) => {
      setCategory(event.target.value);
      setPage(1);
   }, []);

   const handleNextPage = () => setPage((prevPage) => prevPage + 1);;

   const handlePrevPage = () => setPage((prevPage) => (prevPage > 1 ? prevPage - 1 : 1));;

   const handleProductClick = (productId) => {
      navigate(`/product/${productId}`);
   };

   const addToCart = (product) => {
      let cart = cookie.load('cart') || {};

      if (cart[product.id]) {
         cart[product.id].quantity++;
      } else {
         cart[product.id] = {
            image: product.image,
            name: product.name,
            description: product.description,
            price: product.price,
            quantity: 1,
         };
      }

      cookie.save('cart', cart);
      console.info('cart', cart);
      dispatch({ type: 'update' });
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
                     <div className="filter-category__title">
                        <i className="bx bxs-category"></i>
                        <h3 className="filter-category__title--main">Danh mục</h3>
                     </div>

                     <div className="filter-category__dropdown mt-4">
                        <select
                           className="product__search--category"
                           onChange={handleCategoryChange}
                           value={category}
                        >
                           <option value="">Tất cả danh mục</option>
                           {categories.map((category) => (
                              <option key={category.id} value={category.id}>
                                 {category.name}
                              </option>
                           ))}
                        </select>
                     </div>
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
                     {products.map((product) => (
                        <Col sm={3} key={product?.id} className="mb-4">
                           <div className="product-card">
                              <div
                                 className="product-card__image"
                                 onClick={() => handleProductClick(product.id)}
                                 style={{ cursor: 'pointer' }}
                              >
                                 <img
                                    src={product?.image ?? defaultImage.PRODUCT_IMAGE}
                                    alt={product?.name || 'Ảnh sản phẩm'}
                                 />
                              </div>

                              <div
                                 className="product-card__content"
                                 onClick={() => handleProductClick(product?.id)}
                                 style={{ cursor: 'pointer' }}
                              >
                                 <h1 className="product-card__content--title">{product?.name}</h1>
                                 <p className="product-card__content--des">Mô tả: {product?.description}</p>
                                 <span>
                                    Giá:{' '}
                                    {product?.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                                 </span>
                              </div>

                              <div className="product-card__button">
                                 <button
                                    onClick={(e) => {
                                       e.stopPropagation();
                                       addToCart(product);
                                    }}
                                 >
                                    <i className="bx bxs-cart-add"></i>
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
