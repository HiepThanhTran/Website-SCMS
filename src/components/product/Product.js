import React, { useContext, useEffect, useState, useCallback } from "react";
import APIs, { endpoints } from "../../configs/APIs";
import productDefaultImage from "../../images/Product/product_default.jpg";
import "./Product.css";
import cookie from "react-cookies";
import { MyCartContext } from "../../App";

const Product = () => {
	const [products, setProducts] = useState([]);
	const [categories, setCategories] = useState([]);
	const [page, setPage] = useState(1);
	const [size, setSize] = useState(8);
	const [loading, setLoading] = useState(true);
	const [name, setName] = useState("");
	const [selectedCategory, setSelectedCategory] = useState("");
	const [, dispatch] = useContext(MyCartContext);

	const loadCategories = useCallback(async () => {
		try {
			const res = await APIs.get(endpoints.categories);
			setCategories(res.data);
		} catch (error) {
			console.error(error);
		}
	}, []);

	const loadProduct = useCallback(async () => {
		setLoading(true);
		try {
			const params = new URLSearchParams({
				page,
				size,
				name: name || "",
				categoryId: selectedCategory || "",
			}).toString();

			const res = await APIs.get(`${endpoints.products}?${params}`);
			setProducts(res.data);
		} catch (error) {
			console.error("Failed to load products:", error);
		} finally {
			setLoading(false);
		}
	}, [page, size, name, selectedCategory]);


	useEffect(() => {
		loadCategories();
		loadProduct();
	}, [loadProduct, loadCategories]);

	const handleSearch = useCallback(
		(event) => {
			setName(event.target.value);
			setPage(1);
		},
		[]
	);

	const handleCategoryChange = (event) => {
		setSelectedCategory(event.target.value);
		setPage(1);
	};

	const handleNextPage = () => {
		setPage((prevPage) => prevPage + 1);
	};

	const handlePrevPage = () => {
		setPage((prevPage) => (prevPage > 1 ? prevPage - 1 : 1));
	};

	const addToCart = (product) => {
		let cart = cookie.load("cart") || {};

		if (cart[product.id]) {
			cart[product.id].quantity++;
		} else {
			cart[product.id] = {
				id: product.id,
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
					onChange={handleSearch}
					value={name}
				/>
				<select
					className="product__search--category"
					onChange={handleCategoryChange}
					value={selectedCategory}
				>
					<option value="">Tất cả danh mục</option>
					{categories.map((category) => (
						<option key={category.id} value={category.id}>
							{category.name}
						</option>
					))}
				</select>
			</div>

			{loading ? (
				<div>Loading...</div>
			) : (
				<div className="row">
					{products.map((product) => (
						<div key={product.id} className="col-3 mb-4">
							<div className="card-product">
								<div className="card-product__image">
									<img
										src={product.image || productDefaultImage}
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
									<button
										className="card-product__button--order"
										onClick={() => addToCart(product)}
									>
										Đặt hàng
									</button>
								</div>
							</div>
						</div>
					))}
				</div>
			)}

			<div className="text-center">
				<button
					className="btn-page me-2"
					onClick={handlePrevPage}
					disabled={page === 1}
				>
					<i className="bx bxs-left-arrow"></i>
				</button>
				<button
					className="btn-page"
					onClick={handleNextPage}
					disabled={products.length < size}
				>
					<i className="bx bxs-right-arrow"></i>
				</button>
			</div>
		</div>
	);
};

export default Product;