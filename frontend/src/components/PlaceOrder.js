import React, { useState, useEffect, useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Button, Row, Col, ListGroup, Image, Card, Alert } from 'react-bootstrap';
import { GlobalContext } from '../context/globalState';
import CheckoutSteps from '../utilis/CheckoutSteps';
import API from '../api/index';

const PlaceOrder = () => {
    const { shippingAddress, paymentMethod, setPaymentMethod, cart, setCart, user, order, setOrder } = useContext(GlobalContext);
    const history = useHistory();
    const [error, setError] = useState('');
    if (cart) {
        cart.itemsPrice = cart?.reduce((acc, curr) => acc + curr.price * curr.qty, 0).toFixed(2);
        cart.shippingPrice = (cart?.itemsPrice > 100 ? 0 : 10).toFixed(2);
        cart.taxPrice = Number((0.2) * cart.itemsPrice).toFixed(2);
        cart.totalPrice = (Number(cart.itemsPrice) + Number(cart.shippingPrice) + Number(cart.taxPrice)).toFixed(2);
    };


    const placeOrder = async () => {
        try {
            const response = await API.post('orders/add', { orderItems: cart, shippingAddress, paymentMethod, itemsPrice: cart.itemsPrice, shippingPrice: cart.shippingPrice, taxPrice: cart.taxPrice, totalPrice: cart.totalPrice, id: user._id, }, {
                headers: { Authorization: `Bearer ${user?.token}` }
            });
            setOrder(response.data);
            localStorage.removeItem('cartItems');
            setCart([]);
            localStorage.removeItem('paymentMethod');
            localStorage.removeItem('shippingAddress');
            setPaymentMethod('');
        } catch (err) {
            setError(err.response && error.response.data.detail ? error.response.data.detail : error.message);
        };
    };

    useEffect(() => {
        order.length !== 0 && history.push(`/order/${order._id}`);
    }, [order, history]);

    return (
        <div>
            <CheckoutSteps step1 step2 step3 step4 />
            <Row>
                <Col md={8}>
                    <ListGroup variant='flush'>
                        <ListGroup.Item>
                            <h2>Shipping</h2>
                            <p>
                                <strong>Shipping: </strong>
                                {shippingAddress.address}, {shippingAddress.city}
                                {'  '}
                                {shippingAddress.postalCode},
                                {'  '}
                                {shippingAddress.country}
                            </p>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <h2>Payment Method</h2>
                            <p>
                                <strong>Method: </strong>
                                {paymentMethod}
                            </p>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <h2>Order Items</h2>
                            {cart?.length === 0 ? <Alert variant="info" >
                                Your cart is empty
                            </Alert> : (
                                <ListGroup variant="flush">
                                    {cart.map((item, index) => (
                                        <ListGroup.Item key={index}>
                                            <Row>
                                                <Col md={1}>
                                                    <Image src={`http://localhost:8000${item.image}`} alt={item.name} fluid rounded />
                                                </Col>
                                                <Col>
                                                    <Link to={`/product/${item._id}`}>{item.name}</Link>
                                                </Col>
                                                <Col md={4}>
                                                    {item.qty} X ${item.price} = ${(item.qty * item.price).toFixed(2)}
                                                </Col>
                                            </Row>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            )}
                        </ListGroup.Item>
                    </ListGroup>
                </Col>
                <Col md={4}>
                    <Card>
                        <ListGroup variant="flush">
                            <ListGroup.Item>
                                <h2>Order Summary</h2>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Item: </Col>
                                    <Col>${cart.itemsPrice}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Shipping: </Col>
                                    <Col>${cart.shippingPrice}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Tax: </Col>
                                    <Col>${cart.taxPrice}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Total: </Col>
                                    <Col>${cart.totalPrice}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                {error && <Alert variant='danger'>
                                    {error}
                                </Alert>}
                            </ListGroup.Item>
                            <ListGroup.Item style={{ display: 'flex', justifyContent: 'center' }}>
                                <Button size="lg" style={{ width: '100rem' }} type="button" className="btn-block" disabled={cart === 0} onClick={placeOrder}>
                                    Place Order
                                </Button>
                            </ListGroup.Item>
                        </ListGroup>
                    </Card>
                </Col>

            </Row>
        </div>
    )
}

export default PlaceOrder;
