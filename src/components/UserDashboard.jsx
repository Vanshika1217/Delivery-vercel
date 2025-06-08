import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const response = await fetch('/api/orders/user');
      if (!response.ok) {
        throw new Error('Failed to load orders');
      }
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <h2>Orders</h2>
      {orders.length === 0 ? (
        <p>No orders available.</p>
      ) : (
        <ul>
          {orders.map((order) => (
            <li key={order._id}>{order.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Orders;
