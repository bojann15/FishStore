import React, { useState, useEffect, useContext } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { useHistory, useLocation } from 'react-router-dom';
import API from '../../api/index';
import { Table, Button } from 'react-bootstrap';
import { GlobalContext } from '../../context/globalState';
import { Pagination } from 'react-bootstrap';

const UserList = () => {
    const history = useHistory();
    const location = useLocation();
    const { user } = useContext(GlobalContext);
    const [userList, setUserList] = useState([]);
    const [update, setUpdate] = useState(false);
    const [page, setPage] = useState(0);
    const [pages, setPages] = useState(0);
    let path = location.search;

    useEffect(() => {
        if (user && user.isAdmin) {
            const fetchData = async () => {
                try {
                    const response = await API.get(`user${path}`, {
                        headers: { Authorization: `Bearer ${user?.token}` }
                    });
                    setUserList(response.data.users);
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
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await API.delete(`user/delete/${id}`, {
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
            <h1>Users</h1>
            <Table striped bordered hover responsive className="table-sm">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>NAME</th>
                        <th>EMAIl</th>
                        <th>ADMIN</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {userList.map((user) => (
                        <tr key={user._id}>
                            <td>{user._id}</td>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.isAdmin ? (
                                <i className="fas fa-check" style={{ color: 'green' }}></i>) :
                                (<i className="fas fa-check" style={{ color: 'red' }}></i>)}
                            </td>
                            <td>
                                <LinkContainer to={`/admin/user/${user._id}/edit`}>
                                    <Button variant="light" className="btn-sm">
                                        <i className="fas fa-edit"></i>
                                    </Button>
                                </LinkContainer>
                                <Button variant="danger" className="btn-sm" onClick={() => deleteHandler(user._id)}>
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
                            <LinkContainer key={x + 1} to={`/admin/userlist/?page=${x + 1}`}>
                                <Pagination.Item active={x + 1 === page}>{x + 1}</Pagination.Item>
                            </LinkContainer>
                        ))}
                    </Pagination>
                )
            }
        </div>
    )
}
export default UserList;