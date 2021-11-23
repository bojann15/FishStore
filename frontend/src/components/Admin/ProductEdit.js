import React, { useContext, useState, useEffect } from 'react';
import { useHistory, Link, useParams } from 'react-router-dom';
import { Form, Button, Row, Col, Container } from 'react-bootstrap';
import API from '../../api/index';
import { GlobalContext } from '../../context/globalState';

const ProductEdit = () => {
    const { id } = useParams();
    const history = useHistory();
    const { user } = useContext(GlobalContext);
    const [error, setError] = useState('');
    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [image, setImage] = useState('');
    const [category, setCategory] = useState('');
    const [brand, setBrand] = useState('');
    const [countInStock, setCountInStock] = useState('');
    const [description, setDescription] = useState('');

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            await API.put(`/products/update/${id}`, { name, price, image, category, brand, countInStock, description }, {
                headers: { Authorization: `Bearer ${user?.token}` }
            });
            history.push('/admin/productlist');
        } catch (err) {
            console.error(err.response.data.detail);
            setError(err.response.data.detail);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await API.get(`products/${id}`, {
                    headers: { Authorization: `Bearer ${user?.token}` }
                })
                setName(response.data.name);
                setPrice(response.data.price);
                setImage(response.data.image);
                setCategory(response.data.category);
                setBrand(response.data.brand);
                setDescription(response.data.description);
                setCountInStock(response.data.countInStock);
            } catch (err) {
                console.error(err);
            };
        }
        fetchData();
    }, []);

    const uploadFileHandler = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData()
        formData.append('image', file);
        formData.append('product_id', id);
        try {
            const response = await API.post('products/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })
            setImage(response.data);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <Link to='/admin/productlist'>
                Go Back
            </Link>
            <Container>
                <Row className="justify-content-md-center">
                    <Col xs={12} md={6}>
                        <h1>Edit Product</h1>

                        <Form onSubmit={submitHandler}>
                            <Form.Group controlId="name">
                                <Form.Label>Name</Form.Label>
                                <Form.Control type="name" placeholder="Enter Name" value={name} onChange={(e) => setName(e.target.value)}></Form.Control>
                            </Form.Group>
                            <Form.Group controlId="price">
                                <Form.Label>Price</Form.Label>
                                <Form.Control type="number" placeholder="Enter Price" value={price} onChange={(e) => setPrice(e.target.value)}></Form.Control>
                            </Form.Group>
                            <Form.Group controlId="image">
                                <Form.Label>Image</Form.Label>
                                <Form.Control type="text" placeholder="Enter Image" value={image} onChange={(e) => setImage(e.target.value)}></Form.Control>
                                <Form.Control type="file" onChange={uploadFileHandler} />
                            </Form.Group>
                            <Form.Group controlId="brand">
                                <Form.Label>Brand</Form.Label>
                                <Form.Control type="text" placeholder="Enter Brand" value={brand} onChange={(e) => setBrand(e.target.value)}></Form.Control>
                            </Form.Group>
                            <Form.Group controlId="countinstock">
                                <Form.Label>Stock</Form.Label>
                                <Form.Control type="number" placeholder="Enter Stock" value={countInStock} onChange={(e) => setCountInStock(e.target.value)}></Form.Control>
                            </Form.Group>
                            <Form.Group controlId="category">
                                <Form.Label>Category</Form.Label>
                                <Form.Control type="text" placeholder="Enter Category" value={category} onChange={(e) => setCategory(e.target.value)}></Form.Control>
                            </Form.Group>
                            <Form.Group controlId="description">
                                <Form.Label>Description</Form.Label>
                                <Form.Control type="text" placeholder="Enter Description" value={description} onChange={(e) => setDescription(e.target.value)}></Form.Control>
                            </Form.Group>
                            <Button className='my-3' type="submit" variant="primary">Edit</Button>
                        </Form>

                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default ProductEdit;
