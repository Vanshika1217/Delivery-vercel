import React, { useState, useEffect, useContext } from 'react';
import { CartContext } from './CartContext';
import Navbar from './Navbar';
import Footer from './Footer';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const OrderPageContext = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [quantities, setQuantities] = useState({});
    const { addToCart } = useContext(CartContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/goods/all');
                const data = await response.json();
                setOrders(data);
                setLoading(false);
            } catch (error) {
                console.error('Error loading orders:', error);
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const handleAddToCart = (item) => {
        setQuantities((prev) => ({ ...prev, [item._id]: 1 }));
        addToCart(item);
        toast.success(`${item.name} added to cart!`);
    };

    const handleIncrement = (item) => {
        setQuantities((prev) => {
            const updatedQty = (prev[item._id] || 0) + 1;
            return { ...prev, [item._id]: updatedQty };
        });
    };

    const handleDecrement = (item) => {
        setQuantities((prev) => {
            const updatedQty = Math.max((prev[item._id] || 1) - 1, 0);
            if (updatedQty === 0) {
                const newQuantities = { ...prev };
                delete newQuantities[item._id];
                return newQuantities;
            }
            return { ...prev, [item._id]: updatedQty };
        });
    };

    const handleDelete = async (id) => {
        try {
            const res = await fetch(`http://localhost:5000/api/goods/${id}`, {
                method: 'DELETE',
            });
            if (res.ok) {
                setOrders(prev => prev.filter(order => order._id !== id));
                toast.success('Item deleted successfully.');
            } else {
                toast.error('Failed to delete item.');
            }
        } catch (error) {
            console.error('Delete error:', error);
            toast.error('Error deleting item.');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-50">
                <div className="text-xl font-semibold animate-pulse text-gray-700">Loading orders...</div>
            </div>
        );
    }

    return (
        <>
            <Navbar />
            <ToastContainer position="top-right" />
            <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-4xl font-bold text-gray-800">Available Goods</h2>
                    <button
                        onClick={() => navigate('/checkout')}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition">
                        Go to Checkout
                    </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {orders.map(item => (
                        <div key={item._id} className="bg-white rounded-xl shadow-md hover:shadow-2xl transition-shadow duration-300 overflow-hidden">
                            <img
                                src={item.image || 'https://via.placeholder.com/400x250?text=No+Image'}
                                alt={item.name}
                                className="w-full h-48 object-cover"
                            />
                            <div className="p-5">
                                <h3 className="text-xl font-semibold mb-2 text-indigo-700">{item.name}</h3>
                                <p className="text-gray-600 mb-1"><strong>Category:</strong> {item.category}</p>
                                <p className="text-gray-600 mb-1"><strong>Price:</strong> ₹{item.price}</p>
                                <p className="text-gray-600 mb-1"><strong>Stock:</strong> {item.stock}</p>
                                <p className="text-gray-600 mb-3">
                                    <strong>Status:</strong>{' '}
                                    <span className={`inline-block px-2 py-1 rounded text-sm font-medium 
                                        ${item.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {item.isAvailable ? 'Available' : 'Out of Stock'}
                                    </span>
                                </p>
                                <div className="flex gap-3 items-center">
                                    {quantities[item._id] ? (
                                        <div className="flex items-center bg-green-600 text-white rounded-md px-3 py-1">
                                            <button
                                                className="text-xl px-2"
                                                onClick={() => handleDecrement(item)}
                                            >
                                                −
                                            </button>
                                            <span className="px-2">{quantities[item._id]}</span>
                                            <button
                                                className="text-xl px-2"
                                                onClick={() => handleIncrement(item)}
                                            >
                                                +
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => handleAddToCart(item)}
                                            className="px-4 py-2 border border-green-600 text-green-600 hover:bg-green-600 hover:text-white rounded-md transition">
                                            ADD
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleDelete(item._id)}
                                        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition">
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default OrderPageContext;
