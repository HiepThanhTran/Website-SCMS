import React, { useEffect, useState } from "react";
import Spinner from "react-bootstrap/Spinner";
import APIs, { endpoints } from "../../configs/APIs";
import productDefaultImage from "../../images/Product/product_default.jpg";
import "./Product.css";

const Product = () => {
	const [products, setProducts] = useState([]);
	const [page, setPage] = useState(1);
	const [size, setSize] = useState(8);
	const [loading, setLoading] = useState(true);
	const [q, setQ] = useState("");

	const loadProduct = async () => {
		setLoading(true);
		try {
			let params = new URLSearchParams({
				page: page,
				size: size,
				q: q,
			}).toString();

			let res = await APIs.get(`${endpoints.products}?${params}`);
			setProducts(res.data);
		} catch (error) {
			console.error("Failed to fetch products:", error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		loadProduct();
	}, [page, size, q]);

	const handleSearch = (event) => {
		event.preventDefault();
		setQ(event.target.value);
	};

	const handleNextPage = () => {
		setPage((prevPage) => prevPage + 1);
	};

	const handlePrevPage = () => {
		setPage((prevPage) => (prevPage > 1 ? prevPage - 1 : 1));
	};

	if (loading) {
		return (
			<div className="text-center">
				<Spinner animation="border" />
			</div>
		);
	}

	return (
		<div className="container product">
			<div className="product__title">
				<h1 className="product__title--main">Danh sách sản phẩm</h1>
				<span></span>
			</div>

			<div className="product__search">
				<input
					type="text"
					className="product__search--input"
					placeholder="Tìm kiếm sản phẩm..."
					value={q}
					onChange={handleSearch}
				/>
			</div>

			<div className="row">
				{products.map((product) => (
					<div key={product.id} className="col-3 mb-4">
						<div className="card-product">
							<div className="card-product__image">
								<img
									src={
										product.image
											? product.image
											: productDefaultImage
									}
									alt={product.name}
								/>
							</div>

							<div className="card-product__content">
								<h1 className="card-product__content--title">
									Tên sản phẩm: {product.name}
								</h1>
								<p className="card-product__content--description">
									Mô tả: {product.description}
								</p>
								<span className="card-product__content--price">
									Giá: {product.price} VNĐ
								</span>
							</div>

							<div className="card-product__button">
								<button className="card-product__button--detail">
									Xem chi tiết
								</button>
								<button className="card-product__button--order">
									Đặt hàng
								</button>
							</div>
						</div>
					</div>
				))}
			</div>

			<div className="text-center">
				<button
					className="btn-page me-2"
					onClick={handlePrevPage}
					disabled={page === 1}>
					<i className="bx bxs-left-arrow"></i>
				</button>
				<button className="btn-page" onClick={handleNextPage}>
					<i className="bx bxs-right-arrow"></i>
				</button>
			</div>
		</div>
	);
};

export default Product;
