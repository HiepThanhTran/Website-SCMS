import React, { useEffect, useState } from 'react';
import APIs, { endpoints } from "../../configs/APIs";
import Spinner from 'react-bootstrap/Spinner';
import './Product.css';

const Product = () => {
    const [products, setProducts] = useState([]);

    const loadProducts = async () => {
        try {
            let res = await APIs.get(endpoints.products);
            setProducts(res.data);
        } catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        loadProducts();
    }, []);

    if (products.length === 0) {
        return <Spinner animation="border" variant="success" />;
    }

    return (
        <div className="products-page">
            <div className="container">
                <div className="row">
                    {products.map((product, index) => (
                        <div className="col-lg-2 col-md-3 col-sm-6 mb-4" key={index}>
                            <div className="products-card">
                                <div 
                                    className="products-image" 
                                    style={{ 
                                        backgroundImage: `url(${product.image ? product.image : ''})`,
                                        backgroundColor: product.image ? 'transparent' : 'var(--sub-color)',
                                        height: '200px',
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center'
                                    }}>
                                </div>
                                <div className="products-card-body">
                                    <h5 className="products-card-title">{product.name}</h5>
                                    <p className="card-text">{product.description}</p>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div className="products-btn-group">
                                            <button type="button" className="products-btn btn-sm">View</button>
                                            <button type="button" className="products-btn btn-sm">Add to Cart</button>
                                        </div>
                                        <span className="products-price">${product.price}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Product;