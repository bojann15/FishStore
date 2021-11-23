import React, { useState, useEffect, useContext } from 'react';
import API from '../../api/index';
import { GlobalContext } from '../../context/globalState';
import { useHistory, useLocation } from 'react-router-dom';
import { Form, Button, Row, Col, Alert, Table } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { Pagination } from 'react-bootstrap';


const Profile = () => {
    const { user, setUser } = useContext(GlobalContext);
    const history = useHistory();
    const location = useLocation();
    const [error, setError] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [name, setName] = useState('');
    const [myOrderList, setMyOrderList] = useState([]);
    const [update, setUpdate] = useState(false);
    const [page, setPage] = useState(0);
    const [pages, setPages] = useState(0);
    let path = location.search;
    
    useEffect(() => {
        if (!user) {
            history.push('/login');
        }
        else {
            if (!user || !user.name) {
                const fetchData = async () => {
                    try {
                        await API.get("user/profile", {
                            headers: { Authorization: `Bearer ${user?.token}` }
                        })
                    } catch (err) {
                        console.error(err)
                    }
                }
                fetchData();
            } else {
                setName(user.name);
                setEmail(user.email);
            }
        }
    }, [user]);
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await API.get(`orders/myorders${path}`, {
                    headers: { Authorization: `Bearer ${user?.token}` }
                });
                setMyOrderList(response.data.orders);
                setPage(response.data.page);
                setPages(response.data.pages);
            } catch (err) {
                console.error(err.message);
            }
        }
        fetchData()
    }, [update, path]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setMessage("Passwords don't match");
        } else {
            try {
                const response = await API.put('user/profile/update', { id: user._id, name, email, password }, {
                    headers: { Authorization: `Bearer ${user?.token}` }
                })
                localStorage.setItem("profile", JSON.stringify(response.data));
                setUser(JSON.parse(localStorage.getItem('profile')));
                setMessage('You are successfully updated');
            } catch (err) {
                console.error(err.response.data.detail);
                setError(err.response.data.detail);
            }
        }
    };

    const deleteHandler = async (id) => {
        if (window.confirm('Are you sure you want to delete this order?')) {
            try {
                await API.delete(`orders/delete/${id}`, {
                    headers: { Authorization: `Bearer ${user?.token}` }
                });
                setUpdate(!update);
            } catch (err) {
                console.error(err);
            }
        }
    }

    return (
        <Row>
            <Col md={3}>
                <h2>User Profile</h2>
                {message && <Alert variant='danger'>
                    {message}
                </Alert>}
                {error && <Alert variant='danger'>
                    {error}
                </Alert>}
                <Form onSubmit={handleUpdate}>
                    <Form.Group controlId="name">
                        <Form.Label>Name</Form.Label>
                        <Form.Control required type="name" placeholder="Enter Name" value={name} onChange={(e) => setName(e.target.value)}></Form.Control>
                    </Form.Group>
                    <Form.Group controlId="email">
                        <Form.Label>Email Address</Form.Label>
                        <Form.Control required type="email" placeholder="Enter Email" value={email} onChange={(e) => setEmail(e.target.value)}></Form.Control>
                    </Form.Group>
                    <Form.Group controlId="password">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Enter Password" value={password} onChange={(e) => setPassword(e.target.value)}></Form.Control>
                    </Form.Group>
                    <Form.Group controlId="confirmPassword">
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}></Form.Control>
                    </Form.Group>
                    <Button className='my-3' type="submit" variant="primary">Update</Button>
                </Form>
            </Col>
            <Col md={9}>
                <h2>My Orders</h2>
                <Table striped responsive className="table-sm">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Date</th>
                            <th>Total</th>
                            <th>Paid</th>
                            <th>Delivered</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {myOrderList.map((order, index) => (
                            <tr key={index}>
                                <td>{order._id}</td>
                                <td>{order.createdAt.substring(0, 10)}</td>
                                <td>${order.totalPrice}</td>
                                <td>{order.isPaid ? order.paidAt.substring(0, 10) : (<i className="fas fa-times" style={{ color: 'red' }}></i>)}</td>
                                <td>{order.isDelivered ? order.deliveredAt.substring(0, 10) : (<i className="fas fa-times" style={{ color: 'red' }}></i>)}</td>
                                <td><LinkContainer to={`/order/${order._id}`}><Button className="btn-sm">Details</Button></LinkContainer> <Button variant="danger" className="btn-sm" onClick={() => deleteHandler(order._id)}>
                                    <i className="fas fa-trash"></i>
                                </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                {
                    pages > 1 && (
                        <Pagination size="md">
                            {[...Array(pages).keys()].map((x) => (
                                <LinkContainer key={x + 1} to={`/profile/?page=${x + 1}`}>
                                    <Pagination.Item active={x + 1 === page}>{x + 1}</Pagination.Item>
                                </LinkContainer>
                            ))}
                        </Pagination>
                    )
                }
            </Col>
        </Row>
    )
}

export default Profile;
