import React, { useContext, useState } from 'react';
import { Navbar, Container, Nav, NavDropdown, Offcanvas, Button, Form } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useHistory, useLocation } from 'react-router-dom';
import { GlobalContext } from '../context/globalState';

const Header = () => {
    const { user, setUser } = useContext(GlobalContext)
    const location = useLocation();
    const history = useHistory();
    const [keyword, setKeyword] = useState('');
    const [expanded, setExpanded] = useState(false);

    const submitHandler = (e) => {
        e.preventDefault();
        keyword ? history.push(`/?keyword=${keyword}&page=1`) : history.push(history.push(location.pathname));
        setExpanded(false);
    }

    const logoutHandler = () => {
        localStorage.removeItem('profile');
        setUser(null);
        history.push('');
        setExpanded(false);
    }

    return (
        <header style={{ backgroundColor: 'green' }} >
            <Navbar bg="primary" expand={false} collapseOnSelect expanded={expanded}>
                <Container fluid>
                    <LinkContainer to="/">
                        <Navbar.Brand  ><h4 style={{ color: 'white' }}>Fish Store</h4></Navbar.Brand>
                    </LinkContainer>
                    <Navbar.Toggle onClick={() => setExpanded(expanded ? false : "expanded")} aria-controls="offcanvasNavbar" />

                    <Navbar.Offcanvas
                        id="offcanvasNavbar"
                        aria-labelledby="offcanvasNavbarLabel"
                        placement="end"
                    >
                        <Offcanvas.Header style={{ marginTop: '50px' }} closeButton onClick={() => setExpanded(false)}>
                            <Offcanvas.Title id="offcanvasNavbarLabel">Fish Store</Offcanvas.Title>
                        </Offcanvas.Header>
                        <Offcanvas.Body>
                            <Nav className="justify-content-end flex-grow-1 pe-3 " >
                                <LinkContainer to="/" onClick={() => setExpanded(false)}>
                                    <Nav.Link >Home</Nav.Link>
                                </LinkContainer>
                                <LinkContainer to="/cart" onClick={() => setExpanded(false)}>
                                    <Nav.Link ><i className="fas fa-shopping-cart"></i>Cart</Nav.Link>
                                </LinkContainer>
                                {user ? (
                                    <NavDropdown title={user.name} id='username'>
                                        <LinkContainer to='/profile' onClick={() => setExpanded(false)}>
                                            <NavDropdown.Item>Profile</NavDropdown.Item>
                                        </LinkContainer>
                                        <NavDropdown.Item onClick={logoutHandler}>Logout</NavDropdown.Item>
                                    </NavDropdown>
                                ) : (
                                    <LinkContainer to="/login" onClick={() => setExpanded(false)}>
                                        <Nav.Link ><i className="fas fa-user"></i>Login</Nav.Link>
                                    </LinkContainer>
                                )}
                                {user && user.isAdmin && (
                                    <NavDropdown title='Admin' id='adminmenu'>
                                        <LinkContainer to='/admin/userlist' onClick={() => setExpanded(false)}>
                                            <NavDropdown.Item>Users</NavDropdown.Item>
                                        </LinkContainer>

                                        <LinkContainer to='/admin/productlist' onClick={() => setExpanded(false)}>
                                            <NavDropdown.Item>Products</NavDropdown.Item>
                                        </LinkContainer>

                                        <LinkContainer to='/admin/orderlist' onClick={() => setExpanded(false)}>
                                            <NavDropdown.Item>Orders</NavDropdown.Item>
                                        </LinkContainer>

                                    </NavDropdown>
                                )}
                            </Nav>
                            <Form onSubmit={submitHandler} className='d-flex'>
                                <Form.Control style={{ paddingLeft: '2rem' }} type="text" name="q" onChange={(e) => setKeyword(e.target.value)} className='mr-sm-2 ml-sm-5'></Form.Control>
                                <div className="search-icon">
                                    <i className="fas fa-search" />
                                </div>
                                <Button type="submit" variant='primary' className="p-2">Search</Button>
                            </Form >
                        </Offcanvas.Body>
                    </Navbar.Offcanvas>
                </Container>
            </Navbar>
        </header >
    )
}

export default Header;