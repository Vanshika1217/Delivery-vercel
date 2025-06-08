import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import io from 'socket.io-client';
import 'leaflet-routing-machine';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';

const ChangeMapView = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
};

const Routing = ({ current, source, destination }) => {
  const map = useMap();

  useEffect(() => {
    if (!current || !source || !destination) return;

    const routingControl = L.Routing.control({
      waypoints: [
        L.latLng(current.lat, current.lng),
        L.latLng(source.lat, source.lng),
        L.latLng(destination.lat, destination.lng),
      ],
      createMarker: () => null,
      lineOptions: {
        styles: [{ color: '#003366', weight: 4, opacity: 0.8 }],
      },
      show: false,
      addWaypoints: false,
      routeWhileDragging: false,
    }).addTo(map);

    return () => {
      map.removeControl(routingControl);
    };
  }, [current, source, destination, map]);

  return null;
};

const MapComponent = ({ activeTrip }) => {
  const [currentPosition, setCurrentPosition] = useState(null);
  const [mapCenter, setMapCenter] = useState([28.6139, 77.2090]); // Initialize with Delhi coordinates

  // 🔁 Get and update driver's location
  useEffect(() => {
    const updateLocation = () => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setCurrentPosition(coords);
          setMapCenter(coords); // Update map center when location is available
        },
        (error) => {
          console.error('Error getting location: ', error);
          // Handle error appropriately, maybe set a default center or show a message
        }
      );
    };

    updateLocation(); // Initial fetch
    const interval = setInterval(updateLocation, 5000); // Every 5 seconds

    return () => clearInterval(interval);
  }, []);

  // 📡 Emit location to backend via Socket.io
  useEffect(() => {
    const socket = io('http://localhost:5000'); // Replace with your deployed server if needed

    if (currentPosition) {
      socket.emit('driverLocation', currentPosition);
    }

    const interval = setInterval(() => {
      if (currentPosition) {
        socket.emit('driverLocation', currentPosition);
      }
    }, 5000);

    return () => {
      socket.disconnect();
      clearInterval(interval);
    };
  }, [currentPosition]);

  const sourceCoordinates = activeTrip?.sourceCoordinates;
  const destCoordinates = activeTrip?.destCoordinates;

  return (
    <MapContainer center={mapCenter} zoom={13} style={{ height: '400px', width: '100%' }}>
      <ChangeMapView center={mapCenter} />
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />

      {currentPosition && (
        <Marker position={currentPosition}>
          <Popup>Driver's Current Location</Popup>
        </Marker>
      )}

      {sourceCoordinates && (
        <Marker position={sourceCoordinates}>
          <Popup>Warehouse / Store</Popup>
        </Marker>
      )}

      {destCoordinates && (
        <Marker position={destCoordinates}>
          <Popup>Customer's Delivery Address</Popup>
        </Marker>
      )}

      {sourceCoordinates && destCoordinates && currentPosition && (
        <Routing current={currentPosition} source={sourceCoordinates} destination={destCoordinates} />
      )}
    </MapContainer>
  );
};

export default MapComponent;
