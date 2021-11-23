import React, { useState, useEffect, useContext } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { useHistory, useLocation } from 'react-router-dom';
import API from '../../api/index';
import { Table, Button } from 'react-bootstrap';
import { GlobalContext } from '../../context/globalState';
import { Pagination } from 'react-bootstrap';

const OrderList = () => {
    const history = useHistory();
    const location = useLocation();
    const { user } = useContext(GlobalContext);
    const [orderList, setOrderList] = useState([]);
    const [update, setUpdate] = useState(false);
    const [page, setPage] = useState(0);
    const [pages, setPages] = useState(0);
    let path = location.search;

    useEffect(() => {
        if (user && user.isAdmin) {
            const fetchData = async () => {
                try {
                    const response = await API.get(`orders${path}`, {
                        headers: { Authorization: `Bearer ${user?.token}` }
                    });
                    setOrderList(response.data.orders);
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
    }, [history, update, path]);

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
    };

    return (
        <div>
            <h1>Orders</h1>
            <Table striped bordered hover responsive className="table-sm">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>USER</th>
                        <th>DATE</th>
                        <th>TOTAL</th>
                        <th>PAID</th>
                        <th>DELIVERED</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {orderList.map((order) => (
                        <tr key={order._id}>
                            <td>{order._id}</td>
                            <td>{order.user && order.user.name}</td>
                            <td>{order.createdAt.substring(0, 10)}</td>
                            <td>${order.totalPrice}</td>
                            <td>{order.isPaid ?
                                (order.paidAt.substring(0, 10)) :
                                (<i className="fas fa-check" style={{ color: 'red' }}></i>)}
                            </td>
                            <td>{order.isDelivered ?
                                (order.deliveredAt.substring(0, 10)) :
                                (<i className="fas fa-check" style={{ color: 'red' }}></i>)}
                            </td>
                            <td>
                                <LinkContainer to={`/order/${order._id}`}>
                                    <Button className="btn-sm">
                                        Details
                                    </Button>
                                </LinkContainer>
                                <Button variant="danger" className="btn-sm" onClick={() => deleteHandler(order._id)}>
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
                            <LinkContainer key={x + 1} to={`/admin/orderlist/?page=${x + 1}`}>
                                <Pagination.Item active={x + 1 === page}>{x + 1}</Pagination.Item>
                            </LinkContainer>
                        ))}
                    </Pagination>
                )
            }
        </div>
    )
}
export default OrderList;
