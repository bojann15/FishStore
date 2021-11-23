import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import { GlobalContext } from '../context/globalState';
import CheckoutSteps from '../utilis/CheckoutSteps';

const Payment = () => {
    const history = useHistory();
    const { shippingAddress, paymentMethod, setPaymentMethod } = useContext(GlobalContext);
    !shippingAddress.address && history.push('/shipping');

    const submitHandler = (e) => {
        e.preventDefault();
        localStorage.setItem("paymentMethod", JSON.stringify({ paymentMethod }));
        history.push('/placeorder');
    };

    return (
        <Container>
            <Row className="justify-content-md-center">
                <Col xs={12} md={6}>
                    <CheckoutSteps step1 step2 step3 />
                    <Form onSubmit={submitHandler}>
                        <Form.Group>
                            <Form.Label as="legend">Select Method</Form.Label>
                            <Col>
                                <Form.Check type="radio" label='Cash' id='Cash' value="Cash" name='paymentMethod' onChange={(e) => setPaymentMethod(e.target.value)}>
                                </Form.Check>
                                <Form.Check type="radio" label='Credit Card' id='Credit Card' value='Credit Card' name='paymentMethod' onChange={(e) => setPaymentMethod(e.target.value)}>
                                </Form.Check>
                            </Col>
                        </Form.Group>
                        <Button className="mt-3" type="submit" variant='primary'>Continue</Button>
                    </Form>
                </Col>
            </Row>
        </Container >
    )
}

export default Payment;
