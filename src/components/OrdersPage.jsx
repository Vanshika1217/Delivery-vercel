// src/pages/OrdersPage.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/orders/all');
        setOrders(res.data);
      } catch (err) {
        console.error('Error fetching orders:', err);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">All Orders</h2>
      <ul className="space-y-2">
        {orders.map((order) => (
          <li key={order._id} className="p-4 bg-white shadow rounded">
            <p><strong>Order ID:</strong> {order._id}</p>
            <p><strong>Total:</strong> ₹{order.totalAmount}</p>
            <p><strong>Status:</strong> {order.status}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrdersPage;
