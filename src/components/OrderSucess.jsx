// OrderSuccess.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const OrderSuccess = () => (
    <div className="min-h-screen flex flex-col justify-center items-center bg-green-50">
        <h1 className="text-4xl font-bold text-green-700 mb-4">Order Confirmed!</h1>
        <p className="text-lg text-gray-700 mb-6">Thank you for your purchase. Your order is on its way.</p>
        <Link to="/" className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700">
            Go to Home
        </Link>
    </div>
);

export default OrderSuccess;
