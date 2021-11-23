import React, { useContext, useState, useEffect } from 'react';
import { useHistory, Link, useLocation } from 'react-router-dom';
import { Form, Button, Row, Col, Container, Alert } from 'react-bootstrap';
import API from '../../api/index';
import { GlobalContext } from '../../context/globalState';

const Register = () => {
    const history = useHistory();
    const location = useLocation();
    const redirect = location.search ? location.search.split('=')[1] : '/';
    const { user, setUser } = useContext(GlobalContext);
    const [error, setError] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [name, setName] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setMessage("Passwords don't match");
        } else {
            try {
                const response = await API.post('/user/register', { name, email, password })
                localStorage.setItem("profile", JSON.stringify(response.data));
                setUser(JSON.parse(localStorage.getItem('profile')));
            } catch (err) {
                console.error(err.response.data.detail);
                setError(err.response.data.detail);
            }
        }
    };

    useEffect(() => {
        user && history.push(redirect);
    }, [history, user, redirect]);

    return (
        <Container>
            <Row className="justify-content-md-center">
                <Col xs={12} md={6}>
                    <h1>Register</h1>
                    {message && <Alert variant='danger'>
                        {message}
                    </Alert>}
                    {error && <Alert variant='danger'>
                        {error}
                    </Alert>}
                    <Form onSubmit={handleRegister}>
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
                            <Form.Control required type="password" placeholder="Enter Password" value={password} onChange={(e) => setPassword(e.target.value)}></Form.Control>
                        </Form.Group>
                        <Form.Group controlId="confirmPassword">
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control required type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}></Form.Control>
                        </Form.Group>
                        <Button className='my-3' type="submit" variant="primary">Register</Button>
                    </Form>
                    <Row className="py-3">
                        <Col>
                            Have an Account? <Link to={redirect ? `/login?redirect=${redirect}` : '/login'}>Sign In</Link>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Container>
    )
}

export default Register;
