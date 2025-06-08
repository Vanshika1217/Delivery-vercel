import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from './CartContext';
import Navbar from "./Navbar";
import Footer from "./Footer";
import { jsPDF } from 'jspdf';

const Checkout = () => {
    const { cartItems, removeFromCart } = useContext(CartContext);
    const total = cartItems.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
    const navigate = useNavigate();

    const generateReceiptPDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(20);
        doc.text("Order Receipt", 20, 20);
        doc.setFontSize(12);
        doc.text(`Date: ${new Date().toLocaleString()}`, 20, 30);

        let y = 50;
        cartItems.forEach((item, index) => {
            const qty = item.quantity || 1;
            doc.text(`${index + 1}. ${item.name} (x${qty}) - ₹${item.price * qty}`, 20, y);
            y += 10;
        });

        doc.setFontSize(14);
        doc.text(`Total Amount: ₹${total}`, 20, y + 10);
        doc.save("receipt.pdf");
    };

    const handleConfirmOrder = async () => {
        const token = localStorage.getItem('token');

        try {
            const response = await fetch('http://localhost:5000/api/orders/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    items: cartItems.map(item => ({
                        name: item.name,
                        quantity: item.quantity || 1,
                        price: item.price,
                    })),
                    totalAmount: total,
                    specialInstructions: "Leave at the door",
                    createdAt: new Date().toISOString()
                })
            });

            if (response.ok) {
                generateReceiptPDF();
                alert("Order confirmed and receipt downloaded!");
                navigate('/order-success');
            } else {
                const err = await response.json();
                alert(`Failed to confirm order: ${err.message}`);
            }
        } catch (error) {
            console.error("Error confirming order:", error);
            alert("Something went wrong.");
        }
    };

    return (
        <>
            <Navbar />
            <div className="p-8 bg-gray-50 min-h-screen">
                <h2 className="text-3xl font-bold mb-6">Checkout</h2>
                {cartItems.length === 0 ? (
                    <p className="text-gray-700">Your cart is empty.</p>
                ) : (
                    <>
                        <ul className="mb-4">
                            {cartItems.map((item, index) => (
                                <li key={`${item._id}-${index}`} className="flex justify-between items-center mb-3 bg-white p-4 rounded shadow">
                                    <div>
                                        <h4 className="font-semibold">{item.name}</h4>
                                        <p className="text-sm text-gray-600">₹{item.price} x {item.quantity || 1}</p>
                                    </div>
                                    <button
                                        onClick={() => removeFromCart(item._id)}
                                        className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded">
                                        Remove
                                    </button>
                                </li>
                            ))}
                        </ul>
                        <div className="text-xl font-bold text-right">Total: ₹{total}</div>
                        <button
                            onClick={handleConfirmOrder}
                            className="mt-4 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
                            Confirm Order
                        </button>
                    </>
                )}
            </div>
            <Footer />
        </>
    );
};

export default Checkout;
