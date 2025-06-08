// NavbarUser.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";

const NavbarUser = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow p-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold text-blue-600">
        DeliverySys
      </Link>
      <div className="flex gap-6 items-center">
        <Link to="/cart" className="text-gray-700 hover:text-blue-600">
          Cart
        </Link>
        <Link to="/orderspage" className="text-gray-700 hover:text-blue-600">
          Order History
        </Link>
        <Link to="/profile" className="text-gray-700 hover:text-blue-600">
          Profile
        </Link>
        {user && (
          <span className="text-sm text-gray-600">
            Welcome, <strong>{user.name}</strong>
          </span>
        )}
        <button
          onClick={handleLogout}
          className="ml-2 px-4 py-1 text-sm text-white bg-red-500 hover:bg-red-600 rounded"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default NavbarUser;