import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import { MapIcon, TruckIcon, UserCircleIcon} from '@heroicons/react/24/outline';
const TrackOrder = ({ order }) => {
  const [driverLocation, setDriverLocation] = useState(null);
  const [map, setMap] = useState(null);
  const driverMarkerRef = useRef(null);
  const socketRef = useRef(null);
  const [route, setRoute] = useState(null);

  useEffect(() => {
    if (
      !map &&
      order &&
      order.pickupLocation &&
      order.pickupLocation.coordinates &&
      order.dropoffLocation &&
      order.dropoffLocation.coordinates
    ) {
      const sourceCoordinates = {
        lat: order.pickupLocation.coordinates[1],
        lng: order.pickupLocation.coordinates[0],
      };
      const destCoordinates = {
        lat: order.dropoffLocation.coordinates[1],
        lng: order.dropoffLocation.coordinates[0],
      };

      const newMap = L.map(`map-${order.id}`).setView(
        [sourceCoordinates.lat, sourceCoordinates.lng],
        14
      );

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
      }).addTo(newMap);

      L.marker([sourceCoordinates.lat, sourceCoordinates.lng])
        .addTo(newMap)
        .bindPopup('Pickup Location');

      L.marker([destCoordinates.lat, destCoordinates.lng])
        .addTo(newMap)
        .bindPopup('Dropoff Location');

      driverMarkerRef.current = L.marker([0, 0])
        .addTo(newMap)
        .bindPopup('Driver Location');

      setMap(newMap);
    }
  }, [order, map]);

  useEffect(() => {
    if (map) {
      socketRef.current = io('http://localhost:5000');

      if (order.deliveryPartner) {
        socketRef.current.on('updateDriverLocation', (location) => {
          setDriverLocation(location);
          if (driverMarkerRef.current) {
            try {
              driverMarkerRef.current.setLatLng([location.lat, location.lng]);
            } catch (error) {
              console.error('Error setting driver marker location:', error);
              console.log('Received location data:', location);
            }
          }
        });
      }
    }

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
      if (map) {
        map.remove();
        setMap(null);
      }
    };
  }, [order, map]);

  useEffect(() => {
    if (driverLocation && driverMarkerRef.current) {
      driverMarkerRef.current.setLatLng([driverLocation.lat, driverLocation.lng]);
    }
  }, [driverLocation]);

  useEffect(() => {
    if (
      map &&
      order &&
      order.pickupLocation &&
      order.pickupLocation.coordinates &&
      order.dropoffLocation &&
      order.dropoffLocation.coordinates
    ) {
      const sourceCoordinates = {
        lat: order.pickupLocation.coordinates[0],
        lng: order.pickupLocation.coordinates[1],
      };
      const destCoordinates = {
        lat: order.dropoffLocation.coordinates[0],
        lng: order.dropoffLocation.coordinates[1],
      };

      const routingControl = L.Routing.control({
        waypoints: [
          L.latLng(sourceCoordinates.lat, sourceCoordinates.lng),
          L.latLng(destCoordinates.lat, destCoordinates.lng),
        ],
        createMarker: () => null,
        lineOptions: {
          styles: [{ color: '#003366', weight: 4, opacity: 0.8 }],
        },
        show: false,
        addWaypoints: false,
        routeWhileDragging: false,
      }).addTo(map);

      setRoute(routingControl);

      return () => {
        if (map && routingControl) {
          map.removeControl(routingControl);
        }
        setRoute(null);
      };
    }
  }, [order, map]);

  return <div id={`map-${order.id}`} style={{ width: '100%', height: '400px' }}></div>;
};

const ActiveOrders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem('token');

      try {
        const response = await fetch('http://localhost:5000/api/orders/me/pending', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }

        const fetchedOrders = await response.json();
        setOrders(fetchedOrders);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleTrackClick = (order) => {
    setSelectedOrder(order);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl text-gray-500">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-semibold text-center mb-6">Active Orders</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
  {orders.map((order) => {
    const [sourceLng, sourceLat] = order.pickupLocation.coordinates;
    const [destLng, destLat] = order.dropoffLocation.coordinates;
    const isDriverAssigned = order.status === 'accepted' && order.deliveryPartner;

    return (
      <div
        key={order.id}
        className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 transition-all hover:shadow-xl"
      >
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Order #{order.id}</h3>
        
        <div className="text-gray-600 space-y-1 text-sm">
          <p className="flex items-center">
            <MapIcon className="h-4 w-4 mr-2 text-blue-600" />
            <strong>From:</strong> ({sourceLat}, {sourceLng})
          </p>
          <p className="flex items-center">
            <MapIcon className="h-4 w-4 mr-2 text-green-600" />
            <strong>To:</strong> ({destLat}, {destLng})
          </p>
          <p className="flex items-center">
            <TruckIcon className="h-4 w-4 mr-2 text-yellow-600" />
            <strong>Status:</strong> {order.status}
          </p>
          <p className="flex items-center">
            <UserCircleIcon className="h-4 w-4 mr-2 text-purple-600" />
            <strong>Driver Assigned:</strong> {isDriverAssigned ? 'Yes' : 'No'}
          </p>
        </div>

        {isDriverAssigned && (
          <button
            onClick={() => handleTrackClick(order)}
            className="mt-4 w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Track Order
          </button>
        )}
      </div>
    );
  })}
</div>

      {selectedOrder && (
        <div className="mt-6">
          <TrackOrder order={selectedOrder} />
        </div>
      )}
    </div>
  );
};

export default ActiveOrders;
