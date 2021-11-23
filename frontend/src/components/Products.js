import React, { useContext, useEffect, useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import API from '../api/index';
import { GlobalContext } from '../context/globalState';
import Product from './Product';
import Paginate from '../utilis/Paginate';
import ProductCarousel from '../utilis/ProductCarousel';
const Products = () => {

    const location = useLocation();
    const { products, setProducts } = useContext(GlobalContext);
    let keyword = location.search;
    const [page, setPage] = useState(0);
    const [pages, setPages] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await API.get(`/products${keyword}`);
                setProducts(response.data.products);
                setPage(response.data.page)
                setPages(response.data.pages)
            } catch (error) {
                console.error(error.response && error.response.data.detail
                    ? error.response.data.detail
                    : error.message)
            }
        }
        fetchData();
    }, [keyword])

    return (
        <div>
            {!keyword && <ProductCarousel />}

            <h1>Products</h1>
            <Row>
                {products.map(product => (
                    <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                        <Product product={product} />
                    </Col>
                ))}
            </Row>
            <Paginate page={page} pages={pages} keyword={keyword} />
        </div>
    )
}

export default Products;
