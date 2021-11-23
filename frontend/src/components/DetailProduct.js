import React, { useState, useEffect, useContext } from 'react';
import { Link, useParams, useHistory, useLocation } from 'react-router-dom';
import { Row, Col, Image, ListGroup, Button, Card, Form, Alert } from 'react-bootstrap';
import API from '../api/index';
import Rating from '../utilis/Rating';
import { GlobalContext } from '../context/globalState';
import { Pagination } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';


const DetailProduct = () => {
    const { id } = useParams();
    const { user, qty, setQty } = useContext(GlobalContext);
    const history = useHistory();
    const location = useLocation();
    const [detailProduct, setDetailProduct] = useState([]);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [errorReview, setErrorReview] = useState('');
    const [success, setSuccess] = useState('');
    const [update, setUpdate] = useState(false);
    const [page, setPage] = useState(0);
    const [pages, setPages] = useState(0);
    const [reviews, setReviews] = useState([]);
    let path = location.search;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await API.get(`/products/${id}`);
                setDetailProduct(response.data);
            } catch (err) {
                console.error(err.response.data);
            }
        }
        fetchData();
    }, [id, update]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await API.get(`/products/${id}/review${path}`);
                setReviews(response.data.reviews);
                setPage(response.data.page);
                setPages(response.data.pages);
            } catch (err) {
                console.error(err.message);
            }
        }
        fetchData()
    }, [update, path]);

    const addCartHandler = () => {
        history.push(`/cart/${id}?qty=${qty}`);
        setUpdate(!update);
    };
    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const response = await API.post(`products/${id}/reviews`, { rating, comment }, {
                headers: { Authorization: `Bearer ${user?.token}` }
            })
            setSuccess(response.data);
            setRating(0);
            setComment('');
            setUpdate(!update);

        } catch (error) {
            setErrorReview(error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message);
        }
    };

    return (
        <div>
            <Link to="/" className="btn btn-light my-3">Home Page</Link>
            <div>
                <Row>
                    <Col md={6}>
                        <Image src={`http://localhost:8000${detailProduct.image}`} alt={detailProduct.name} fluid rounded />
                    </Col>
                    <Col md={3}>
                        <ListGroup variant="flush">
                            <ListGroup.Item>
                                <h3>{detailProduct.name}</h3>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Rating value={detailProduct.rating} text={`${detailProduct.numReviews} reviews`} color={'#f8e825'} />
                            </ListGroup.Item>
                            <ListGroup.Item>
                                Price: ${detailProduct.price}
                            </ListGroup.Item>
                            <ListGroup.Item>
                                Description: {detailProduct.description}
                            </ListGroup.Item>
                        </ListGroup>
                    </Col>
                    <Col md={3}>
                        <Card>
                            <ListGroup variant="flush">
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Price: </Col>
                                        <Col><strong>${detailProduct.price}</strong></Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Status: </Col>
                                        <Col>{detailProduct.countInStock > 0 ? 'In Stock' : 'Out of Stock'}</Col>
                                    </Row>
                                </ListGroup.Item>
                                {detailProduct.countInStock > 0 && (
                                    <ListGroup.Item>
                                        <Row>
                                            <Col>Qty</Col>
                                            <Col xs='auto' className="my-1">
                                                <Form.Control as="select" value={qty}
                                                    onChange={e => setQty(e.target.value)}>
                                                    {[...Array(detailProduct.countInStock).keys()].map((x) => (
                                                        <option key={x + 1} value={x + 1}>{x + 1}</option>
                                                    ))}
                                                </Form.Control>
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>
                                )}
                                <ListGroup.Item style={{ display: 'flex', justifyContent: 'center' }}>
                                    <Button size="lg" style={{ width: '100rem' }} className="btn-block" onClick={addCartHandler} disabled={detailProduct.countInStock === 0} type="button">Add to Cart</Button>
                                </ListGroup.Item>
                            </ListGroup>
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <Col md={6}>
                        <h4>Reviews</h4>
                        {reviews?.length === 0 && <Alert variant='info'>No Reviews</Alert>}
                        <ListGroup variant="flush">
                            {reviews?.map((review) => (
                                <ListGroup.Item key={review._id} style={{ borderBottom: 'none' }}>
                                    <strong>{review.name}</strong>
                                    <Rating value={review.rating} color="#f8e825" />
                                    <p>{review.createdAt.substring(0, 10)}</p>
                                    <p>{review.comment}</p>
                                </ListGroup.Item>
                            ))}
                            <ListGroup.Item >
                                {
                                    pages > 1 && (
                                        <Pagination size="md">
                                            {[...Array(pages).keys()].map((x) => (
                                                <LinkContainer key={x + 1} to={`/product/${id}?page=${x + 1}`}>
                                                    <Pagination.Item active={x + 1 === page}>{x + 1}</Pagination.Item>
                                                </LinkContainer>
                                            ))}
                                        </Pagination>
                                    )
                                }
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <h4>Write a review</h4>
                                {success && <Alert variant='success'>Review Submitted</Alert>}
                                {errorReview && <Alert variant="danger">{errorReview}</Alert>}
                                {user ? (
                                    <Form onSubmit={submitHandler}>
                                        <Form.Group controlId='rating'>
                                            <Form.Label>Rating</Form.Label>
                                            <Form.Control as='select' value={rating} onChange={(e) => setRating(e.target.value)}>
                                                <option value=''>Select...</option>
                                                <option value='1'>1 - Poor</option>
                                                <option value='2'>2 - Fair</option>
                                                <option value='3'>3 - Good</option>
                                                <option value='4'>4 - Very Good</option>
                                                <option value='5'>5 - Excellent</option>
                                            </Form.Control>
                                        </Form.Group>
                                        <Form.Group controlId='comment'>
                                            <Form.Label>Review</Form.Label>
                                            <Form.Control as='textarea' row='5' value={comment} onChange={(e) => setComment(e.target.value)}></Form.Control>
                                        </Form.Group>

                                        <Button className="btn-block mt-3" size="lg" type='submit' variant='primary'>Submit</Button>

                                    </Form>
                                ) : (
                                    <Alert variant="info">
                                        Please <Link to='/login'>login</Link> to write a review
                                    </Alert>
                                )}
                            </ListGroup.Item>
                        </ListGroup>
                    </Col>
                </Row>
            </div>
        </div>
    )
}

export default DetailProduct;
