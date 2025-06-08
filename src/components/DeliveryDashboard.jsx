import React from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import { useNavigate } from 'react-router-dom'; // Ensure you import useNavigate for navigation
import L from 'leaflet';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import 'leaflet-routing-machine';

const Routing = ({ from, to }) => {
  const map = useMap();

  React.useEffect(() => {
    if (!map) return;

    const routingControl = L.Routing.control({
      waypoints: [L.latLng(from[0], from[1]), L.latLng(to[0], to[1])],
      routeWhileDragging: false,
      show: false,
      addWaypoints: false,
      draggableWaypoints: false,
    }).addTo(map);

    return () => map.removeControl(routingControl);
  }, [map, from, to]);

  return null;
};

const DeliveryDashboard = () => {
  const pickup = [28.6304, 77.3733]; // JIIT Noida
  const dropoff = [28.6129, 77.2295]; // India Gate (dummy destination)
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove token and userType from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    
    // Navigate to authentication page after logout
    navigate('/auth');
  };

  // Dummy data for the delivery details
  const customerName = "John Doe";
  const orderDetails = "2x Large Pizzas, 1x Coke";
  const orderWeight = "2.5 kg";
  const expectedDeliveryTime = "30 minutes";
  
  return (
    <div className="bg-gray-100 min-h-screen">

      {/* Navbar */}
      <nav className="bg-indigo-600 p-4 text-white">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Delivery Partner Dashboard</h1>
          <div className="flex space-x-6">
            <button className="text-white hover:text-indigo-200">Delivery History</button>
            <button 
              onClick={handleLogout} 
              className="text-white hover:text-indigo-200"
            >
              Log Out
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex flex-col md:flex-row justify-between p-6 space-y-6 md:space-y-0">
        {/* Left Section: Map */}
        <div className="w-full md:w-1/2 h-[600px]">
          <MapContainer center={pickup} zoom={13} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Routing from={pickup} to={dropoff} />
          </MapContainer>
        </div>

        {/* Right Section: Delivery Info */}
        <div className="w-full md:w-1/2 p-6 bg-white shadow-md rounded-lg">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Current Delivery Details</h2>

          <div className="mb-4">
            <h3 className="text-xl font-medium text-gray-700">Customer: {customerName}</h3>
            <p className="text-gray-600">Order Details: {orderDetails}</p>
            <p className="text-gray-600">Order Weight: {orderWeight}</p>
          </div>

          <div className="flex justify-between items-center">
            <div className="text-lg font-medium text-gray-700">Expected Delivery Time:</div>
            <div className="text-lg text-indigo-600">{expectedDeliveryTime}</div>
          </div>

          <div className="mt-6 text-gray-600">
            <h4 className="font-semibold text-lg">Route Information:</h4>
            <p>Pickup Location: JIIT Noida</p>
            <p>Drop-off Location: India Gate</p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default DeliveryDashboard;
