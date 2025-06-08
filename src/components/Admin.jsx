import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import AdminCards from './AdminCards';

const Admin = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    try {
      setUser(storedUser ? JSON.parse(storedUser) : null);
    } catch (err) {
      console.error("Error parsing user from localStorage:", err);
      setUser(null);
    }
  }, []);
  

  if (!user || user.username !== "admin") {
    return <div className="text-center mt-10 text-red-600 font-semibold">Access Denied</div>;
  }

  return (
    <div>
      {/* Navbar */}
      <Navbar admin={true} />

      {/* Main container with grey background */}
      <div className="bg-gray-100 min-h-screen flex flex-col items-center">
        <div className="flex flex-wrap justify-center gap-6 p-6 mt-10">
          <AdminCards title="Users" description="Fetch, Add or Remove Users" />
          <AdminCards title="Hotels" description="Fetch, Add or Remove Hotels" />
          <AdminCards title="Flats" description="Fetch, Add or Remove Flats" />
          <AdminCards title="PGs" description="Fetch, Add or Remove PGs" />
        </div>
      </div>
    </div>
  );
};

export default Admin;
