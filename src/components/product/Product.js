import { Container, Row, Col, Form } from "react-bootstrap";
import { useState, useEffect, useCallback, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import APIs, { endpoints } from '../../configs/APIs';
import { defaultImage } from '../../utils/Constatns';
import { MyCartContext } from "../../App";
import Loading from '../../layout/loading/Loading';
import cookie from "react-cookies";
import "./Product.css";

const Product = () => {
  const [, dispatch] = useContext(MyCartContext);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [units, setUnits] = useState([]);
  const [tags, setTags] = useState([]);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(8);
  const [name, setName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [selectedUnit, setSelectedUnit] = useState("");
  const navigate = useNavigate();

  const loadProduct = async () => {
    try {
      const params = new URLSearchParams({
        page: page,
        size: size,
        name: name,
        categoryId: selectedCategory,
        tagId: selectedTag
      });

      const res = await APIs.get(`${endpoints.products}?${params}`);
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadCategories = async () => {
    try {
      const res = await APIs.get(endpoints.categories);
      setCategories(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadUnits = async () => {
    try {
      const res = await APIs.get(endpoints.units);
      setUnits(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadTags = async () => {
    try {
      const res = await APIs.get(endpoints.tags);
      setTags(res.data);
    } catch (err) {
      console.error("Error loading tags:", err);
    }
  };

  useEffect(() => {
    loadProduct();
  }, [page, size, name, selectedCategory, selectedTag]);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadUnits();
  }, []);

  useEffect(() => {
    loadTags();
  }, []);

  const handleSearch = useCallback((event) => {
    setName(event.target.value);
    setPage(1);
  }, []);

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
    setPage(1);
  };

  const handleUnitChange = (event) => {
    setSelectedUnit(event.target.value);
    setPage(1);
  };

  const handleTagChange = (event) => {
    setSelectedTag(event.target.value);
    setPage(1);
  };

  const handleNextPage = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    setPage((prevPage) => (prevPage > 1 ? prevPage - 1 : 1));
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const addToCart = (product) => {
    let cart = cookie.load("cart") || {};

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

    cookie.save("cart", cart);
    dispatch({ type: "update" });
  };

  return (
    <Container className="product-container">
      <div className="shadow-lg p-3 mb-3 bg-body rounded gap-3">
        <Row>
          <Col sm={3}>
            <div className="title-filter">
              <h3 className="title-filter">Bộ lọc nâng cao</h3>
            </div>

            <div className="filter">
              <div className="filter__title">
                <i className='bx bxs-category'></i>
                <h3 className="filter__title--main">Danh mục</h3>
              </div>

              <div className="filter-category__dropdown mt-4">
                <select className="product__search--all" onChange={handleCategoryChange} value={selectedCategory}>
                  <option value="">Tất cả danh mục</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id} className="short-option">
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="filter mt-4">
              <div className="filter__title">
                <i class='bx bxs-package'></i>
                <h3 className="filter__title--main">Đơn vị</h3>
              </div>

              <div className="filter__dropdown mt-4">
                <select className="product__search--all" onChange={handleUnitChange} value={selectedUnit}>
                  <option value="">Tất cả đơn vị</option>
                  {units.map((unit) => (
                    <option key={unit.id} value={unit.id}>
                      {unit.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="filter mt-4">
              <div className="filter__title">
                <i className='bx bx-money'></i>
                <h3 className="filter__title--main">Giá</h3>
              </div>

              <Form.Group className="mb-3 mt-3" style={{ width: "250px" }}>
                <Form.Label>Từ</Form.Label>
                <Form.Control type="text" />
              </Form.Group>

              <Form.Group className="mb-3" style={{ width: "250px" }}>
                <Form.Label>Đến</Form.Label>
                <Form.Control type="text" />
              </Form.Group>
            </div>


            <div className="filter mt-4">
              <div className="filter__title">
                <i className='bx bxs-purchase-tag'></i>
                <h3 className="filter__title--main">Nhãn</h3>
              </div>

              <div className="filter__tag--dropdown mt-4">
                {tags.map((tag) => (
                  <div className="tag-item">
                    <span className="">{tag.name}</span>
                  </div>
                ))}
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
                <Col sm={3} key={product.id} className="mb-4">
                  <div className="product-card">
                    <div
                      className="product-card__image"
                      onClick={() => handleProductClick(product.id)}
                      style={{ cursor: "pointer" }}
                    >
                      <img
                        src={product.image ? product.image : defaultImage.PRODUCT_IMAGE}
                        alt={product.name || "Ảnh sản phẩm"}
                      />
                    </div>

                    <div
                      className="product-card__content"
                      onClick={() => handleProductClick(product.id)}
                      style={{ cursor: "pointer" }}
                    >
                      <h1 className="product-card__content--title">{product.name}</h1>
                      <p className="product-card__content--des">
                        Mô tả: {product.description}
                      </p>
                      <span>Giá: {product.price} VNĐ</span>
                    </div>

                    <div className="product-card__button">
                      <button onClick={(e) => {
                        e.stopPropagation();
                        addToCart(product);
                      }}>
                        <i className='bx bxs-cart-add'></i>
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