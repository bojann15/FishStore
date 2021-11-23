import React, { useState, useEffect, useContext } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { useHistory, useLocation } from 'react-router-dom';
import API from '../../api/index';
import { Table, Button, Row, Col } from 'react-bootstrap';
import { GlobalContext } from '../../context/globalState';
import Paginate from '../../utilis/Paginate';

const ProductList = () => {
    const history = useHistory();
    const { user } = useContext(GlobalContext);
    const [productList, setProductList] = useState([]);
    const [page, setPage] = useState(0);
    const [pages, setPages] = useState(0);
    const [update, setUpdate] = useState(false);
    const location = useLocation();
    let keyword = location.search;

    useEffect(() => {
        if (user && user.isAdmin) {
            const fetchData = async () => {
                try {
                    const response = await API.get(`/products${keyword}`);
                    setProductList(response.data.products);
                    setPage(response.data.page);
                    setPages(response.data.pages);
                } catch (err) {
                    console.error(err);
                }
            }
            fetchData();
        } else {
            history.push('/login');
        }
    }, [history, update, user, keyword]);

    const deleteHandler = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await API.delete(`products/delete/${id}`, {
                    headers: { Authorization: `Bearer ${user?.token}` }
                });
                setUpdate(!update);
            } catch (err) {
                console.error(err);
            }
        }
    };

    const createProductHandler = async () => {
        try {
            const response = await API.post('products/create', {}, {
                headers: { Authorization: `Bearer ${user?.token}` }
            });
            history.push(`/admin/product/${response.data._id}/edit`);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <Row className='align-items-center ' >
                <Col >
                    <h1>Products</h1>
                </Col>
                <Col style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }} >
                    <Button onClick={createProductHandler} >
                        <i className="fas fa-plus"></i> Create Product
                    </Button>
                </Col>
            </Row>
            <Table striped bordered hover responsive className="table-sm">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>NAME</th>
                        <th>PRICE</th>
                        <th>CATEGORY</th>
                        <th>BRAND</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {productList.map((product) => (
                        <tr key={product._id}>
                            <td>{product._id}</td>
                            <td>{product.name}</td>
                            <td>{product.price}</td>
                            <td>{product.category}</td>
                            <td>{product.brand}</td>
                            <td>
                                <LinkContainer to={`/admin/product/${product._id}/edit`}>
                                    <Button variant="light" className="btn-sm">
                                        <i className="fas fa-edit"></i>
                                    </Button>
                                </LinkContainer>
                                <Button variant="danger" className="btn-sm" onClick={() => deleteHandler(product._id)}>
                                    <i className="fas fa-trash"></i>
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <Paginate page={page} pages={pages} isAdmin={true} />
        </div>
    )
}
export default ProductList;