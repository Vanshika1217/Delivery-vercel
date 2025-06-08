import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'leaflet/dist/leaflet.css';

import UsersPage from './components/UsersPage.jsx';
import PartnersPage from './components/PartnersPage.jsx';
import ActiveOrders from "./components/ActiveOrders.jsx"
import Home from "./components/Home";
import Signup from './components/SignUp';
import AdminLogin from "./components/AdminLogin";
import Login from './components/Login';
import Auth from './components/Auth';
import Checkout from './components/Checkout';
import OrderPage from "./components/OrderPageContext.jsx"
import OrderSuccess from './components/OrderSucess.jsx';
import TrackOrder from './components/TrackOrder.jsx';
import OrderHistory from './components/OrderHistory.jsx';
import AdminDashboard from "./components/AdminDashboard.jsx"
import OrdersPage from './components/OrdersPage.jsx';
import GoodsPage from './components/GoodsPage.jsx';
import DeliveryDashboard from './components/DeliveryDashboard.jsx';
import DriverDashboard from './components/DriverDashboard.jsx';
import DriverProfile from './components/DriverProfile.jsx';
function App() {
  return (
 <>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/driverDashboard" element={<DriverDashboard />} />
        <Route path="/driver-profile" element={<DriverProfile/>} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/login" element={<Login />} />
        <Route path="/checkout" element={<Checkout/>}/>
        <Route path="/ordercontext" element={<OrderPage/>}/>
        {/* Optional redirect for unknown routes */}
        <Route path="/order-sucess" element={<OrderSuccess/>}/>
        <Route path="/admin" element={<AdminDashboard />}>
  <Route path="orders" element={<OrdersPage />} />
  <Route path="users" element={<GoodsPage />} /> {/* or UsersPage if it's really for users */}
  <Route path="partners" element={<PartnersPage/>} /> {/* or UsersPage if it's really for users */}
  <Route path="users" element={<UsersPage/>} /> {/* or UsersPage if it's really for users */}
</Route>

        <Route path="/orderspage" element={<ActiveOrders/>}/>
        <Route path="/order-history" element={<OrderHistory/>}/>
        <Route path="/delivery" element={<DeliveryDashboard />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
  </>
  );
}

export default App;
