import React, { useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import {
  ClipboardDocumentListIcon,
  UserGroupIcon,
  TruckIcon,
  PlusCircleIcon,
  TrashIcon,
  ArrowLeftOnRectangleIcon,
  Bars3Icon,
} from '@heroicons/react/24/outline';

const AdminDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    navigate('/auth');
  };

  const navigation = [
    { name: 'View Orders', href: '/admin/orders', icon: ClipboardDocumentListIcon },
    { name: 'View Goods', href: '/admin/users', icon: UserGroupIcon },
    { name: 'Delivery Partners', href: '/admin/partners', icon: TruckIcon },
    { name: 'View Users', href: '/admin/users', icon: TruckIcon },
   
  ];

  return (
    <div className="flex flex-col h-screen">
      {/* Black Navbar */}
      <header className="flex items-center justify-between bg-black text-white px-6 py-4 shadow">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-white hover:text-gray-300 focus:outline-none"
          >
            <Bars3Icon className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold">Admin Portal</h1>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center px-4 py-2 text-white hover:bg-gray-800 rounded-lg"
        >
          <ArrowLeftOnRectangleIcon className="w-6 h-6 mr-2" />
          Logout
        </button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-white shadow-lg transition-all duration-300`}>
          <div className="flex flex-col h-full">
            <div className="p-4">
              <h2 className={`text-2xl font-bold ${!isSidebarOpen && 'hidden'}`}>Dashboard</h2>
            </div>
            <nav className="flex-1 px-2 py-4 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg group"
                >
                  <item.icon className="w-6 h-6" />
                  <span className={`ml-3 ${!isSidebarOpen && 'hidden'}`}>{item.name}</span>
                </Link>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 flex flex-col overflow-auto bg-gray-50">
          <div className="p-6 flex-grow">
            <Outlet />
          </div>
          {/* Footer */}
          <footer className="bg-white text-center py-3 shadow-inner">
            <p className="text-sm text-gray-500">© {new Date().getFullYear()} Admin Panel. All rights reserved.</p>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
