// src/pages/GoodsPage.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const GoodsPage = () => {
  const [goods, setGoods] = useState([]);

  useEffect(() => {
    const fetchGoods = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/goods/all');
        setGoods(res.data);
      } catch (err) {
        console.error('Error fetching goods:', err);
      }
    };

    fetchGoods();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">All Items</h2>
      <ul className="space-y-2">
        {goods.map((item) => (
          <li key={item._id} className="p-4 bg-white shadow rounded">
            <p><strong>Name:</strong> {item.name}</p>
            <p><strong>Price:</strong> ₹{item.price}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GoodsPage;
