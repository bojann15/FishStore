import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { Carousel, Image } from 'react-bootstrap';
import API from '../api';
const ProductCarousel = () => {
    const [topProducts, setTopProducts] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await API.get('products/top');
                setTopProducts(response.data)

            } catch (error) {
                console.error(error.response && error.response.data.detail
                    ? error.response.data.detail
                    : error.message)
            }
        }
        fetchData()
    }, [])
    return (
        <Carousel pause='hover' >
            {topProducts.map((product) => (
                <Carousel.Item key={product._id}>
                    <Link to={`/product/${product._id}`}>
                        <Image src={`http://localhost:8000${product.image}`} alt={product.name} fluid />
                        <Carousel.Caption className="carousel.caption">
                            <h4>{product.name} (${product.price})</h4>
                        </Carousel.Caption>
                    </Link>
                </Carousel.Item>
            ))}
        </Carousel>
    )
}

export default ProductCarousel;
