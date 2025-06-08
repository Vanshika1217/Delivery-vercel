import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { XCircleIcon } from '@heroicons/react/24/outline';

const ViewOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/orders', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5000/api/orders/${orderId}/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      fetchOrders(); // Refresh orders list
    } catch (error) {
      console.error('Error canceling order:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">All Orders</h1>
      
      {orders.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-600">No orders found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-semibold">Order #{order._id.slice(-6)}</h2>
                  <p className="text-gray-600">Date: {formatDate(order.createdAt)}</p>
                  <p className="text-gray-600">User: {order.user.name}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                    order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                  {order.status !== 'cancelled' && order.status !== 'delivered' && (
                    <button
                      onClick={() => handleCancelOrder(order._id)}
                      className="flex items-center text-red-600 hover:text-red-700"
                    >
                      <XCircleIcon className="w-5 h-5 mr-1" />
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b">
                    <div>
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                    <p className="font-semibold">${item.price}</p>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-between items-center mt-4 pt-4 border-t">
                <span className="text-lg font-semibold">Total Amount:</span>
                <span className="text-xl font-bold text-blue-600">${order.totalAmount}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewOrders; 