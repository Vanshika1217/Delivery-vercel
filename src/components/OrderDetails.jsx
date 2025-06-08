import React, { useState, useEffect } from 'react';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [quantities, setQuantities] = useState({});

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/goods/all');
                const data = await response.json();
                setOrders(data);

                // Initialize quantities for each order
                const initialQuantities = {};
                data.forEach(item => {
                    initialQuantities[item._id] = 0;  // Start with 0 quantity
                });
                setQuantities(initialQuantities);

                setLoading(false);
            } catch (error) {
                console.error('Error loading orders:', error);
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const handleQuantityChange = (id, delta) => {
        setQuantities(prev => ({
            ...prev,
            [id]: Math.max(0, (prev[id] || 0) + delta)  // Ensure quantity never goes below 0
        }));
    };

    const handleDelete = async (id) => {
        try {
            const res = await fetch(`http://localhost:5000/api/goods/${id}`, {
                method: 'DELETE',
            });
            if (res.ok) {
                setOrders(prev => prev.filter(order => order._id !== id));
                alert('Item deleted successfully.');
            } else {
                alert('Failed to delete item.');
            }
        } catch (error) {
            console.error('Delete error:', error);
            alert('Error deleting item.');
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
        <div className="p-4 md:p-10 bg-[#f7f7f7] min-h-screen">
            <h2 className="text-4xl font-bold mb-10 text-center text-[#1c1c1c]">Available Goods</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {orders.map(item => (
                    <div key={item._id} className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100">
                        <img 
                            src={item.image || 'https://via.placeholder.com/400x250?text=No+Image'} 
                            alt={item.name}
                            className="w-full h-48 object-cover"
                        />
                        <div className="p-5 flex flex-col justify-between">
                            <div>
                                <h3 className="text-lg font-bold text-gray-800 mb-1">{item.name}</h3>
                                <p className="text-gray-500 text-sm mb-1">{item.category}</p>
                                <p className="text-gray-800 font-medium text-md">₹{item.price}</p>
                                <p className="text-gray-600 text-sm mb-2">Stock: {item.stock}</p>
                                <span className={`inline-block px-2 py-1 rounded text-xs font-medium 
                                    ${item.isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {item.isAvailable ? 'Available' : 'Out of Stock'}
                                </span>
                            </div>

                            <div className="mt-4 flex justify-between items-center">
                                {/* Quantity control buttons */}
                                <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full">
                                    <button 
                                        onClick={() => handleQuantityChange(item._id, -1)} 
                                        className="text-xl font-bold text-gray-700 hover:text-red-600"
                                    >–</button>
                                    <span className="px-2">{quantities[item._id]}</span>
                                    <button 
                                        onClick={() => handleQuantityChange(item._id, 1)} 
                                        className="text-xl font-bold text-green-600 hover:text-green-700"
                                    >+</button>
                                </div>

                                {/* Delete Button */}
                                <button 
                                    onClick={() => handleDelete(item._id)} 
                                    className="text-sm text-red-500 hover:text-red-600 font-medium"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Orders;
