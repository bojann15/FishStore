import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Headers from './components/Headers';
import Footer from './components/Footer';
import Products from './components/Products';
import { GlobalContextProvider } from './context/globalState';
import DetailProduct from './components/DetailProduct';
import Cart from './components/Cart';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Profile from './components/Auth/Profile';
import Shipping from './components/Shipping';
import Payment from './components/Payment';
import PlaceOrder from './components/PlaceOrder';
import OrderDetails from './components/OrderDetails';
import UserList from './components/Admin/UserList';
import UserEdit from './components/Admin/UserEdit';
import ProductList from './components/Admin/ProductList';
import ProductEdit from './components/Admin/ProductEdit';
import OrderList from './components/Admin/OrderList';
const App = () => {
  return (
    <GlobalContextProvider>
      <Router>
        <div>
          <Headers />
          <main className="py-3">
            <Container>
              <Switch>
                <Route path="/" exact component={Products} />
                <Route path="/login" component={Login} />
                <Route path="/register" component={Register} />
                <Route path="/profile" component={Profile} />
                <Route path="/shipping" component={Shipping} />
                <Route path="/payment" component={Payment} />
                <Route path="/placeorder" component={PlaceOrder} />
                <Route path="/order/:id" component={OrderDetails} />
                <Route path="/product/:id" component={DetailProduct} />
                <Route path="/cart/:id?" component={Cart} />
                <Route path="/admin/userlist" component={UserList} />
                <Route path="/admin/user/:id/edit" component={UserEdit} />
                <Route path="/admin/productlist" component={ProductList} />
                <Route path="/admin/product/:id/edit" component={ProductEdit} />
                <Route path="/admin/orderlist" component={OrderList} />
              </Switch>
            </Container>
          </main>
          <Footer />
        </div>
      </Router>
    </GlobalContextProvider>
  );
}

export default App;
