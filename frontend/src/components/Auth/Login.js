import React, { useState, useEffect, useContext } from 'react';
import { useHistory, Link, useLocation } from 'react-router-dom';
import { Form, Button, Row, Col, Container, Alert } from 'react-bootstrap';
import API from '../../api/index';
import { GlobalContext } from '../../context/globalState';

const Login = () => {
    const { user, setUser } = useContext(GlobalContext);
    const history = useHistory();
    const location = useLocation();
    const redirect = location.search ? location.search.split('=')[1] : '/';
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await API.post('/user/login', { username: email, password });
            localStorage.setItem("profile", JSON.stringify(response.data));
            setUser(JSON.parse(localStorage.getItem('profile')));
        } catch (err) {
            console.error(err.response.data.detail);
            setError(err.response.data.detail);
        }
    }
    useEffect(() => {
        user && history.push(redirect);
    }, [history, user, redirect]);

    return (
        <Container>
            <Row className="justify-content-md-center">
                <Col xs={12} md={6}>
                    <h1>Sign In</h1>
                    {error && <Alert variant='danger'>
                        {error}
                    </Alert>}
                    <Form onSubmit={handleLogin}>
                        <Form.Group controlId="email">
                            <Form.Label>Email Address</Form.Label>
                            <Form.Control type="email" placeholder="Enter Email" value={email} onChange={(e) => setEmail(e.target.value)}></Form.Control>
                        </Form.Group>

                        <Form.Group controlId="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" placeholder="Enter Password" value={password} onChange={(e) => setPassword(e.target.value)}></Form.Control>
                        </Form.Group>

                        <Button className='my-3' type="submit" variant="primary">Sign In</Button>
                    </Form>
                    <Row className="py-3">
                        <Col>
                            New Customer? <Link to={redirect ? `/register?redirect=${redirect}` : '/register'}>Register</Link>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Container>
    )
}

export default Login;
