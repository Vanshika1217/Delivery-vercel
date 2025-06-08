import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CalendarIcon, ClockIcon, TruckIcon, UserCircleIcon, MapIcon } from '@heroicons/react/24/outline';
import MapComponent from './MapComponent';
import FindBookings from './FindBookings';
import activeTrips from './data/activeTripData.js';
import CurrentTrip from './CurrentTrip';
import axios from 'axios'
const DriverDashboard = () => {
  const [currentTrips, setCurrentTrips] = useState([]);
  const [completedTrips, setCompletedTrips] = useState([]);
  const [activeTrip, setActiveTrip] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [progress, setProgress] = useState(0);
  const [remainingTime, setRemainingTime] = useState(120);
  const [totalTrips, setTotalTrips] = useState(84);
  const [distanceDriven, setDistanceDriven] = useState(1628);
  const [drivingHours, setDrivingHours] = useState(16.2);
  const navigate = useNavigate();
    
  const dummyBookings = [
    {
      id: '1',
      bookerName: 'Saumya Sharma',
      source: [28.5708, 77.3261 ],
      destination: [ 28.6315, 77.2167 ],
      from: 'Noida Sector 18',
      to: 'Connaught Place, Delhi',
      startTime: '10:00 AM',
      endTime: '11:00 AM',
    },
    {
      id: '2',
      bookerName: 'Ayush Talan',
      source: [ 28.5734,  77.0125 ],
      destination: [ 28.4941,  77.0888 ],
      from: 'Noida Sector 63',
      to: 'Hauz Khas, Delhi',
      startTime: '10:00 AM',
      endTime: '11:00 AM',
    },
  ];

  const [availableBookings, setAvailableBookings] = useState(dummyBookings);

  const handleAcceptBooking = (booking) => {
    // Format the destination coordinates (dropoff)
    console.log(booking.dropoffLocation.coordinates[0]);
    const destinationCoordinates = 
      {lat: booking.dropoffLocation.coordinates[0], lng:booking.dropoffLocation.coordinates[1]};
  
    // Format the source coordinates (pickup)
    const sourceCoordinates = {lat:booking.pickupLocation.coordinates[0], lng:booking.pickupLocation.coordinates[1]};
    console.log(sourceCoordinates);
    console.log(destinationCoordinates);
    // Mapping booking data to match your schema structure
    const activeTripData = {
      id: booking._id,
      bookerName: booking.user.name,
      status: 'active',
      sourceCoordinates: sourceCoordinates,
      destCoordinates: destinationCoordinates,
      from: booking.pickupAddress,
      to : booking.deliveryAddress,
      startTime: booking.estimatedDeliveryTime,
      endTime: booking.actualDeliveryTime,
    };
  
    // Set the active trip in state
    setActiveTrip(activeTripData);
  };
  useEffect(() => {
    const trip = activeTrips.find((trip) => trip.status === 'active');
    if (trip) {
      setActiveTrip({
        ...trip,
        startTime: '10:00 AM',
        endTime: '12:00 PM',
        sourceCoordinates: [ 28.6, 77.2 ],
        destCoordinates: [ 28.5, 77.4 ],
      });
    }

    const interval = setInterval(() => {
      if (activeTrip) {
        setProgress((prev) => (prev < 100 ? prev + 1 : 100));
        setRemainingTime((prev) => (prev > 0 ? prev - 1 : 0));
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [activeTrip]);

  const handleComplete = async (id) => {
    if (!activeTrip) return;
  
    try {
      const token = localStorage.getItem('token'); // assuming token is stored
  
      // Ensure you're passing the correct order ID from activeTrip.
      const orderId = activeTrip.id; // or id if you're passing it from the parent component
  
      await axios.patch(`http://localhost:5000/api/orders/${orderId}/status`, 
        { status: 'picked_up' },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      // Proceed with local state updates
      const newTotalTrips = totalTrips + 1;
      const newDistanceDriven = distanceDriven + 10;
      const newDrivingHours = (drivingHours + 1) % 24;
  
      setCompletedTrips((prev) => [...prev, { ...activeTrip, status: 'completed' }]);
      setCurrentTrips((prev) => prev.filter((t) => t.id !== orderId)); // Use the correct orderId here
      setTotalTrips(newTotalTrips);
      setDistanceDriven(newDistanceDriven);
      setDrivingHours(newDrivingHours);
  
      setActiveTrip(null);
      setProgress(0);
      setRemainingTime(120);
  
      console.log("Trip status updated to 'picked_up' and local state updated.");
    } catch (error) {
      console.error('Error updating trip status:', error);
    }
  };
  

  const handleSignOut = () => {
    setIsAuthenticated(false);
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-100 to-indigo-100 text-gray-900">
      {/* Sidebar */}
      <aside className="w-20 lg:w-1/6 bg-white border-r border-indigo-300 px-4 py-6 flex flex-col justify-between shadow-md">
        <div>
          <h2 className="text-2xl font-extrabold text-indigo-600 mb-8">Driver Panel</h2>
          <nav className="space-y-4 text-gray-800">
            {[['Dashboard', TruckIcon], ['Trips', TruckIcon], ['Schedule', CalendarIcon], ['Analytics', ClockIcon], ['Support', MapIcon]].map(([label, Icon]) => (
              <button key={label} className="flex items-center space-x-2 w-full text-left px-3 py-2 rounded-md hover:bg-indigo-100 transition">
                <Icon className="h-5 w-5 text-indigo-600" />
                <span className="font-semibold">{label}</span>
              </button>
            ))}
          </nav>
        </div>
        <button onClick={handleSignOut} className="text-indigo-600 font-bold py-2 border border-indigo-600 rounded-md hover:bg-indigo-600 hover:text-white transition">
          Sign Out
        </button>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="bg-white px-6 py-4 flex justify-between items-center border-b border-indigo-200 shadow-sm">
          <input type="search" placeholder="Search anything here…" className="flex-1 max-w-md p-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          <div className="flex items-center space-x-4">
            <button className="relative">
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-indigo-600" />
              🔔
            </button>
            <Link to="/driver-profile" className="flex items-center space-x-2">
              <UserCircleIcon className="h-8 w-8 text-indigo-600" />
              <div className="text-right">
                <div className="font-bold text-gray-800">Profile</div>
                <div className="text-xs text-gray-500">Driver</div>
              </div>
            </Link>
          </div>
        </header>

        {/* Content */}
        <main className="p-6 space-y-6 overflow-auto">
          {/* Active Trip or Booking List */}
          {activeTrip ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <CurrentTrip
                activeTrip={activeTrip}
                progress={progress}
                remainingTime={remainingTime}
                handleComplete={handleComplete}
              />
              <MapComponent activeTrip={activeTrip} />
            </div>
          ) : (
            <FindBookings availableBookings={availableBookings} handleAcceptBooking={handleAcceptBooking} />
          )}
        </main>
      </div>
    </div>
  );
};

export default DriverDashboard;
