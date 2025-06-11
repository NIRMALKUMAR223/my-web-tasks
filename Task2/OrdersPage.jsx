import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './OrdersPage.css';

const OrdersPage = () => {

    const [orders, setOrders] = useState([]);

    useEffect(() => {

        axios.get('http://localhost:3001/orders')
            .then(res => setOrders(res.data))
            .catch(err => console.error('Error fetching orders:', err));

    }, []);

    const handleStatusChange = (id, newStatus) => {

        const order = orders.find(o => o.id === id);

        if (order.status === newStatus) return; // Skip update if no change

        axios.put(`http://localhost:3001/orders/${id}`, { ...order, status: newStatus })
            .then(() => {
                setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
                alert('Status updated successfully');
            })
            .catch(() => alert('Failed to update status'));
    };

    return (
        <div className="orders-container">
            
            <h2>Orders List</h2>
            
            <table className="orders-table">
                
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Amount</th>
                        <th>Payment Status</th>
                        <th>Update Status</th>
                    </tr>
                </thead>
                
                <tbody>
                    {orders.map(order => (
                        
                        <tr key={order.id}>
                            <td>{order.id}</td>
                            <td>{order.customerName}</td>
                            <td>${order.amount}</td>
                            <td>
                                <span className={`badge ${order.status.toLowerCase()}`}>
                                    {order.status}
                                </span>
                            </td>
                            <td>
                                <select
                                    value={order.status}
                                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                >
                                    <option value="PAID">PAID</option>
                                    <option value="PENDING">PENDING</option>
                                    <option value="FAILED">FAILED</option>
                                </select>
                            </td>
                        </tr>
                        
                    ))}
                </tbody>
            
            </table>
        </div>
    );
};

export default OrdersPage;
