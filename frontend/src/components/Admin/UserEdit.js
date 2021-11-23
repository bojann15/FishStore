import React, { useContext, useState, useEffect } from 'react';
import { useHistory, Link, useParams } from 'react-router-dom';
import { Form, Button, Row, Col, Container } from 'react-bootstrap';
import API from '../../api/index';
import { GlobalContext } from '../../context/globalState';

const UserEdit = () => {
    const { id } = useParams();
    const history = useHistory();
    const { user, setUser } = useContext(GlobalContext);
    const [error, setError] = useState('');
    const [email, setEmail] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const [name, setName] = useState('');
    
    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            await API.put(`/user/update/${id}`, { name, email, isAdmin }, {
                headers: { Authorization: `Bearer ${user?.token}` }
            })
            history.push('/admin/userlist');
        } catch (err) {
            console.error(err.response.data.detail);
            setError(err.response.data.detail);
        }


    }
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await API.get(`user/${id}`, {
                    headers: { Authorization: `Bearer ${user?.token}` }
                });
                setName(response.data.name);
                setEmail(response.data.email);
                setIsAdmin(response.data.isAdmin);
            } catch (err) {
                console.error(err);
            }
        }
        fetchData();
    }, []);

    return (
        <div>
            <Link to='/admin/userlist'>
                Go Back
            </Link>
            <Container>
                <Row className="justify-content-md-center">
                    <Col xs={12} md={6}>
                        <h1>Edit User</h1>

                        <Form onSubmit={submitHandler}>
                            <Form.Group controlId="name">
                                <Form.Label>Name</Form.Label>
                                <Form.Control type="name" placeholder="Enter Name" value={name} onChange={(e) => setName(e.target.value)}></Form.Control>
                            </Form.Group>
                            <Form.Group controlId="email">
                                <Form.Label>Email Address</Form.Label>
                                <Form.Control type="email" placeholder="Enter Email" value={email} onChange={(e) => setEmail(e.target.value)}></Form.Control>
                            </Form.Group>
                            <Form.Group controlId="isadmin">

                                <Form.Check type="checkbox" label="Is Admin" checked={isAdmin} onChange={(e) => setIsAdmin(e.target.checked)}></ Form.Check>
                            </Form.Group>

                            <Button className='my-3' type="submit" variant="primary">Edit</Button>
                        </Form>

                    </Col>
                </Row>
            </Container>
        </div>
    )
}
export default UserEdit;