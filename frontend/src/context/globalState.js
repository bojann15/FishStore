import React, { useState, createContext } from 'react';

export const GlobalContext = createContext();
export const GlobalContextProvider = (props) => {
    const [products, setProducts] = useState([]);
    const [shouldUpdate, setShouldUpdate] = useState(true);
    const [cart, setCart] = useState(localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : []);
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')));
    const [shippingAddress, setShippingAddress] = useState(localStorage.getItem('shippingAddress') ? JSON.parse(localStorage.getItem('shippingAddress')) : {});
    const [paymentMethod, setPaymentMethod] = useState('');
    const [order, setOrder] = useState([]);
    const [qty, setQty] = useState(1);
    return (
        <GlobalContext.Provider value={{ products, setProducts, shouldUpdate, setShouldUpdate, cart, setCart, user, setUser, shippingAddress, setShippingAddress, paymentMethod, setPaymentMethod, order, setOrder, qty, setQty }}>
            {props.children}
        </GlobalContext.Provider >
    )
}