import React, { useEffect, useContext } from 'react';
import API from '../api/index';
import { useParams, Link, useLocation, useHistory } from 'react-router-dom';
import { GlobalContext } from '../context/globalState';
import { Row, Col, ListGroup, Image, Button, Card, Alert, Form } from 'react-bootstrap';

const Cart = () => {
    const { id } = useParams();
    const location = useLocation();
    const history = useHistory();
    const qty = location.search ? (Number(location.search.split('=')[1])) : 1;
    const { cart, setCart, shouldUpdate, setShouldUpdate } = useContext(GlobalContext);

    useEffect(() => {
        if (!shouldUpdate) return;
        if (!id) return;
        const fetchData = async () => {
            try {
                const response = await API.get(`/products/${id}`);
                const data = { ...response.data, qty }
                const check = cart?.every(item =>
                    item._id !== response.data._id
                )
                if (check) {
                    localStorage.setItem('cartItems', JSON.stringify([...cart, data]));
                    setCart(localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : []);
                    setShouldUpdate(!shouldUpdate);
                }
            } catch (error) {
                console.error(error.response && error.response.data.detail
                    ? error.response.data.detail
                    : error.message);
            }
        }
        fetchData();
    }, [id, shouldUpdate]);


    const checkoutHandler = () => {
        history.push('/login?redirect=shipping');
    };
    const removeFromCart = (id) => {
        cart.forEach((item, index) => { if (item._id === id) cart.splice(index, 1) });
        setCart([...cart]);
        localStorage.setItem('cartItems', JSON.stringify([...cart]));
    };
    const qtyHandler = (id, value) => {
        cart.forEach(item => {
            if (item._id === id) {
                item.qty = value
            }
        });
        setCart([...cart]);
        localStorage.setItem('cartItems', JSON.stringify([...cart]));
    };

    return (
        <Row>
            <Col md={8}>
                <h1>Shopping Cart</h1>
                {cart?.length === 0 || cart === null ? (
                    <Alert variant='info'>
                        Your cart is empty <Link to='/'>Go Back</Link>
                    </Alert>
                ) : (
                    <ListGroup variant='flush'>
                        {cart?.map(item => (
                            <ListGroup.Item key={item._id}>
                                <Row >
                                    <Col md={2}>
                                        <Image src={`http://localhost:8000${item.image}`} alt={item.name} fluid rounded />
                                    </Col>
                                    <Col md={3}>
                                        <Link to={`/product/${item._id}`}>{item.name}</Link>
                                    </Col>
                                    <Col md={2}>
                                        ${item.price}
                                    </Col>
                                    <Col md={3}>
                                        <Form.Control
                                            as="select"
                                            value={item.qty}
                                            onChange={(e) => qtyHandler(item._id, Number(e.target.value))}
                                        >
                                            {

                                                [...Array(item.countInStock).keys()].map((x) => (
                                                    <option key={x + 1} value={x + 1}>
                                                        {x + 1}
                                                    </option>
                                                ))
                                            }

                                        </Form.Control>
                                    </Col>
                                    <Col md={1}>
                                        <Button type='button' variant='light' onClick={() => removeFromCart(item._id)}>
                                            <i className='fas fa-trash'></i>
                                        </Button>
                                    </Col>
                                </Row>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                )}
            </Col>
            <Col md={4}>
                <Card>
                    <ListGroup variant='flush'>
                        <ListGroup.Item>
                            <h2>Subtotal ({cart?.reduce((acc, item) => acc + item.qty, 0)}) items</h2>
                            ${cart?.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2)}
                        </ListGroup.Item>
                    </ListGroup>
                    <ListGroup.Item style={{ display: 'flex', justifyContent: 'center' }}>
                        <Button size="lg" style={{ width: '100rem' }} className='btn-block' disabled={cart?.length === 0} onClick={checkoutHandler}>
                            Proceed to checkout
                        </Button>
                    </ListGroup.Item>
                </Card>
            </Col>
        </Row>
    )
}

export default Cart;
