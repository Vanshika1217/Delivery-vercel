import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TruckIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const VehicleDispatch = () => {
  const [orders, setOrders] = useState([]);
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState('');
  const [selectedPartner, setSelectedPartner] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      const [ordersRes, partnersRes] = await Promise.all([
        axios.get('http://localhost:5000/api/orders/pending', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('http://localhost:5000/api/partners', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      setOrders(ordersRes.data);
      setPartners(partnersRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to fetch data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleDispatch = async (e) => {
    e.preventDefault();
    if (!selectedOrder || !selectedPartner || !vehicleNumber) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:5000/api/dispatch',
        {
          orderId: selectedOrder,
          partnerId: selectedPartner,
          vehicleNumber
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setSuccessMessage('Order dispatched successfully!');
      setSelectedOrder('');
      setSelectedPartner('');
      setVehicleNumber('');
      setTimeout(() => setSuccessMessage(''), 3000);
      fetchData();
    } catch (error) {
      console.error('Error dispatching order:', error);
      setError(error.response?.data?.message || 'Failed to dispatch order');
    } finally {
      setIsSubmitting(false);
    }
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
      <div className="flex items-center space-x-2">
        <TruckIcon className="h-8 w-8 text-blue-600" />
        <h1 className="text-3xl font-bold">Vehicle Dispatch</h1>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {successMessage && (
        <div className="bg-green-50 border-l-4 border-green-400 p-4">
          <p className="text-sm text-green-700">{successMessage}</p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleDispatch} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Order
            </label>
            <select
              value={selectedOrder}
              onChange={(e) => setSelectedOrder(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isSubmitting}
            >
              <option value="">Select an order</option>
              {orders.map((order) => (
                <option key={order._id} value={order._id}>
                  Order #{order._id.slice(-6)} - {order.user.name} (${order.totalAmount})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Delivery Partner
            </label>
            <select
              value={selectedPartner}
              onChange={(e) => setSelectedPartner(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isSubmitting}
            >
              <option value="">Select a delivery partner</option>
              {partners.map((partner) => (
                <option key={partner._id} value={partner._id}>
                  {partner.name} - {partner.vehicleNumber}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Vehicle Number
            </label>
            <input
              type="text"
              value={vehicleNumber}
              onChange={(e) => setVehicleNumber(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter vehicle number"
              disabled={isSubmitting}
            />
          </div>

          <button
            type="submit"
            className={`w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Dispatching...' : 'Dispatch Order'}
          </button>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Pending Orders</h2>
        {orders.length === 0 ? (
          <p className="text-gray-600">No pending orders found.</p>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="border-b pb-4 last:border-b-0">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">Order #{order._id.slice(-6)}</h3>
                    <p className="text-gray-600">Customer: {order.user.name}</p>
                    <p className="text-gray-600">Total Amount: ${order.totalAmount}</p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-sm font-semibold bg-yellow-100 text-yellow-800">
                    Pending
                  </span>
                </div>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Created: {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VehicleDispatch; 