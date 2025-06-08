import React, { useState, useEffect } from "react";
import axios from "axios";

const OrderHistory = () => {
  const [orderHistory, setOrderHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch order history from the backend
  const fetchOrderHistory = async () => {
    try {
      const token = localStorage.getItem("token"); // Or your auth state
      const response = await axios.get("http://localhost:5000/api/orders/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });      
      console.log(response);
      if (Array.isArray(response.data)) {
        setOrderHistory(response.data);
      } else {
        console.error("API response is not an array:", response.data);
        setOrderHistory([]);
      }
    } catch (error) {
      console.error("Failed to fetch order history:", error);
      setOrderHistory([]);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchOrderHistory();
  }, []);

  // Handle loading state
  if (loading) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold text-gray-800">Loading Order History...</h2>
      </div>
    );
  }

  // Handle case when no orders are found
  if (orderHistory.length === 0) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold text-gray-800">No Order History Available</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 text-gray-900">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold text-center mb-10">Order History</h1>

        <div className="space-y-8">
          {Array.isArray(orderHistory) ? (
            orderHistory.map((order) => (
              <div key={order.orderId} className="bg-white shadow-lg rounded-xl p-6 space-y-4">
                <h2 className="text-2xl font-semibold">Order ID: {order.orderId}</h2>
                <p className="text-gray-600">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                <p className="text-gray-600">Total: ₹{order.totalAmount}</p>
                <p className="text-gray-600">Status: {order.status}</p>
                <p className="text-gray-600">Delivery Address: {order.deliveryAddress}</p>
                <div className="text-gray-600">
                  <h3 className="font-semibold">Items:</h3>
                  <ul>
                    {order.items.map((item, index) => (
                      <li key={index}>{item.name} - ₹{item.price}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))
          ) : (
            <div>No order history available</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;
