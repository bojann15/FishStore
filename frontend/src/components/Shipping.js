import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import { GlobalContext } from '../context/globalState';
import CheckoutSteps from '../utilis/CheckoutSteps';

const Shipping = () => {
    const history = useHistory();
    const { shippingAddress, setShippingAddress } = useContext(GlobalContext);
    const [address, setAddress] = useState(shippingAddress.address);
    const [city, setCity] = useState(shippingAddress.city);
    const [postalCode, setPostalCode] = useState(shippingAddress.postalCode);
    const [country, setCountry] = useState(shippingAddress.country);

    const submitHandler = (e) => {
        e.preventDefault();
        localStorage.setItem("shippingAddress", JSON.stringify({ address, city, postalCode, country }));
        setShippingAddress(localStorage.getItem('shippingAddress') ? JSON.parse(localStorage.getItem('shippingAddress')) : {});
        history.push('/payment')
    };

    return (
        <Container>
            <Row className="justify-content-md-center">
                <Col xs={12} md={6}>
                    <CheckoutSteps step1 step2 />
                    <h1>Shipping</h1>
                    <Form onSubmit={submitHandler} >
                        <Form.Group controlId='address'>
                            <Form.Label>Address</Form.Label>
                            <Form.Control required type="text" placeholder="Enter address" value={address ? address : ''} onChange={(e) => setAddress(e.target.value)} />
                        </Form.Group>
                        <Form.Group controlId='city'>
                            <Form.Label>City</Form.Label>
                            <Form.Control required type="text" placeholder="Enter city" value={city ? city : ''} onChange={(e) => setCity(e.target.value)} />
                        </Form.Group>
                        <Form.Group controlId='postalCode'>
                            <Form.Label>Postal Code</Form.Label>
                            <Form.Control required type="text" placeholder="Enter postal  code" value={postalCode ? postalCode : ''} onChange={(e) => setPostalCode(e.target.value)} />
                        </Form.Group>
                        <Form.Group controlId='country'>
                            <Form.Label>Country</Form.Label>
                            <Form.Control required type="text" placeholder="Enter country" value={country ? country : ''} onChange={(e) => setCountry(e.target.value)} />
                        </Form.Group>
                        <Button className="mt-2" type="submit" variant="primary" >Continue</Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    )
}

export default Shipping;
