// src/pages/GoodsPage.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UsersPage = () => {
  const [goods, setGoods] = useState([]);

  useEffect(() => {
    const fetchGoods = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/users/all');
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
            <p><strong>Name:</strong> {item.username}</p>
            <p><strong>Vehicle Type:</strong> ₹{item.vehicleType}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UsersPage;
