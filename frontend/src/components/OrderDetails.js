import React, { useContext, useEffect, useState } from 'react';
import API from '../api/index';
import { useParams, Link, useHistory } from 'react-router-dom';
import { GlobalContext } from '../context/globalState';
import { Row, Col, ListGroup, Image, Card, Alert, Button } from 'react-bootstrap';

const OrderDetails = () => {
    const { id } = useParams();
    const history = useHistory();
    const { user, setOrder } = useContext(GlobalContext);
    const [orderDetails, setOrderDetails] = useState('');
    const [update, setUpdate] = useState(false)

    useEffect(() => {
        if (!user) {
            history.push('/login');
        };
        setOrder([]);
        const fetchData = async () => {
            try {
                const response = await API.get(`/orders/${id}`, {
                    headers: { Authorization: `Bearer ${user?.token}` }
                });
                setOrderDetails(response.data);
            } catch (err) {
                console.error(err.message);
            }
        }
        fetchData();
    }, [id, update, history]);
    if (orderDetails) {
        orderDetails.itemsPrice = orderDetails.orderItems?.reduce((acc, curr) => acc + curr.price * curr.qty, 0).toFixed(2)
    };
    const deliverHandler = async () => {
        try {
            await API.put(`/orders/${id}/deliver`, {}, {
                headers: { Authorization: `Bearer ${user?.token}` }
            })
            setUpdate(!update)
        } catch (err) {
            console.error(err)
        }
    };
    const paidHandler = async () => {
        try {
            await API.put(`/orders/${id}/pay`, {}, {
                headers: { Authorization: `Bearer ${user?.token}` }
            })
            setUpdate(!update)
        } catch (err) {
            console.error(err)
        }
    };
    return (
        <div>

            <h1>Order: {orderDetails._id}</h1>
            <Row>
                <Col md={8}>
                    <ListGroup variant='flush'>
                        <ListGroup.Item>
                            <h2>Shipping</h2>
                            <p><strong>Name: </strong>{orderDetails?.user?.name}</p>
                            <p><strong>Email: </strong><a href={`mailto: ${orderDetails?.user?.email}`} > {orderDetails?.user?.email} </a></p>
                            <p>
                                <strong>Shipping: </strong>
                                {orderDetails?.shippingAddress?.address}, {orderDetails?.shippingAddress?.city}
                                {'  '}
                                {orderDetails?.shippingAddress?.postalCode},
                                {'  '}
                                {orderDetails?.shippingAddress?.country}
                            </p>
                            {orderDetails.isDelivered ? (
                                <Alert variant='success'>
                                    Delivered on {orderDetails.deliveredAt.substring(0, 10)}
                                </Alert>
                            ) : (
                                <Alert variant='warning'>
                                    Not Delivered
                                </Alert>
                            )}
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <h2>Payment Method</h2>
                            <p>
                                <strong>Method: </strong>
                                {orderDetails.paymentMethod}
                            </p>
                            {orderDetails.isPaid ? (
                                <Alert variant='success'>
                                    Paid on {orderDetails.paidAt.substring(0, 10)}
                                </Alert>
                            ) : (
                                <Alert variant='warning'>
                                    Not Paid
                                </Alert>
                            )}
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <h2>Order Items</h2>
                            {orderDetails?.orderItems?.length === 0 ? <Alert variant="info" >
                                Your order is empty
                            </Alert> : (
                                <ListGroup variant="flush">
                                    {orderDetails?.orderItems?.map((item, index) => (
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
                                    <Col>${orderDetails.itemsPrice}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Shipping: </Col>
                                    <Col>${orderDetails.shippingPrice}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Tax: </Col>
                                    <Col>${orderDetails.taxPrice}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Total: </Col>
                                    <Col>${orderDetails.totalPrice}</Col>
                                </Row>
                            </ListGroup.Item>
                        </ListGroup>
                        {!orderDetails.isPaid && (
                            <ListGroup.Item style={{ display: 'flex', justifyContent: 'center' }}>
                                <Button size="lg" style={{ width: '100rem' }} className='btn-block' onClick={paidHandler}>
                                    Pay
                                </Button>
                            </ListGroup.Item>
                        )}
                        {user && user.isAdmin && orderDetails.isPaid && !orderDetails.isDelivered && (
                            <ListGroup.Item style={{ display: 'flex', justifyContent: 'center', }}>
                                <Button size="lg" style={{ width: '100rem' }} className=' btn-block' onClick={deliverHandler}>
                                    Mark As Deliver
                                </Button>
                            </ListGroup.Item>
                        )}
                    </Card>
                </Col>
            </Row>
        </div >
    )
}
export default OrderDetails;