import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { UserIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import { TruckIcon } from '@heroicons/react/24/solid'; // Optional: use if needed


// Backend API routes
const API_ROUTES = {
  customer: { login: '/api/users/login', register: '/api/users/register' },
  delivery: { login: '/api/partners/login', register: '/api/partners/register' },
  admin: { login: '/api/admin/login', register: '/api/admin/add' },
};

const portalDetails = {
  customer: {
    title: 'Customer Portal',
    description: 'Order food, track deliveries, and manage your account',
    icon: UserIcon,
    color: 'bg-indigo-600',
  },
  delivery: {
    title: 'Delivery Portal',
    description: 'Manage deliveries, track orders, and earn money',
    icon: TruckIcon,
    color: 'bg-green-600',
  },
  admin: {
    title: 'Admin Portal',
    description: 'Manage system, users, and monitor operations',
    icon: ShieldCheckIcon,
    color: 'bg-red-600',
  },
};

const PortalCard = ({ keyName, title, description, icon: Icon, color, selectedPortal, setSelectedPortal }) => {
  const isSelected = selectedPortal === keyName;
  return (
    <div
      onClick={() => setSelectedPortal(keyName)}
      className={`cursor-pointer p-6 rounded-xl text-white ${color} ${isSelected ? 'ring-4 ring-offset-2 ring-white' : ''} transition shadow-lg`}
    >
      <Icon className="h-8 w-8 mb-3" />
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="text-sm opacity-90">{description}</p>
    </div>
  );
};

const AuthForm = ({
  isLogin,
  setIsLogin,
  formData,
  handleChange,
  handleSubmit,
  loading,
  selectedPortal,
}) => (
  <div className="bg-white p-10 rounded-2xl shadow-xl max-w-3xl mx-auto w-full">
    <div className="mb-6 text-center">
      <h2 className="text-3xl font-bold text-gray-900">
        {isLogin ? 'Sign in' : 'Create account'}
      </h2>
      <p className="text-sm text-gray-500">{portalDetails[selectedPortal].title}</p>
    </div>

    <form className="space-y-5" onSubmit={handleSubmit}>
      {!isLogin && (
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            name="username"
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={formData.username}
            onChange={handleChange}
            placeholder="Your name"
          />
        </div>
      )}
      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          name="email"
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          value={formData.email}
          onChange={handleChange}
          placeholder="you@example.com"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Password</label>
        <input
          type="password"
          name="password"
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          value={formData.password}
          onChange={handleChange}
          placeholder="••••••••"
        />
      </div>

      {!isLogin && selectedPortal === 'delivery' && (
        <div>
          <label className="block text-sm font-medium text-gray-700">Vehicle Type</label>
          <select
            name="vehicleType"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={formData.vehicleType}
            onChange={handleChange}
          >
            <option value="bike">Bike</option>
            <option value="scooter">Scooter</option>
            <option value="car">Car</option>
          </select>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-md transition"
      >
        {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Sign Up'}
      </button>
    </form>

    <div className="text-center mt-4">
      <button
        onClick={() => setIsLogin(!isLogin)}
        className="text-sm text-indigo-600 hover:underline"
      >
        {isLogin ? 'Need an account? Sign up' : 'Already have an account? Sign in'}
      </button>
    </div>
  </div>
);

const Auth = () => {
  const [selectedPortal, setSelectedPortal] = useState('customer');
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    vehicleType: 'bike',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const redirectPaths = {
    customer: '/',
    admin: '/admin',
    delivery: '/driverDashboard',
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const apiRoute = API_ROUTES[selectedPortal][isLogin ? 'login' : 'register'];
      const portalRole = {
        customer: 'customer',
        delivery: 'delivery_partner',
        admin: 'admin',
      }[selectedPortal];

      const payload = isLogin
        ? { email: formData.email, password: formData.password }
        : {
            ...formData,
            role: portalRole,
          };

      const response = await axios.post(`http://localhost:5000${apiRoute}`, payload);
      const { token, user } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      navigate(redirectPaths[selectedPortal]);
    } catch (error) {
      toast.error(error.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-6">
      <div className="max-w-5xl mx-auto text-center mb-8">
        <h1 className="text-4xl font-extrabold text-gray-900">Welcome to Deliver At Door</h1>
        <p className="text-lg text-gray-600">Select your portal to proceed</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
        {Object.entries(portalDetails).map(([key, val]) => (
          <PortalCard
            key={key}
            keyName={key}
            {...val}
            selectedPortal={selectedPortal}
            setSelectedPortal={setSelectedPortal}
          />
        ))}
      </div>

      <AuthForm
        isLogin={isLogin}
        setIsLogin={setIsLogin}
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        loading={loading}
        selectedPortal={selectedPortal}
      />
    </div>
  );
};

export default Auth;
