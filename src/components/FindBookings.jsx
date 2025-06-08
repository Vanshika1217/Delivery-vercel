import React, { useEffect, useState } from 'react';
import axios from 'axios';

const FindBookings = ({ handleAcceptBooking }) => {
  const [availableBookings, setAvailableBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch bookings when component mounts
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/orders/pending');
        setAvailableBookings(response.data); // Save pending bookings in state
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // Handle accepting a booking
  const acceptBooking = async (booking) => {
    try {
      const token = localStorage.getItem('token');
  
      await axios.patch(
        `http://localhost:5000/api/orders/${booking._id}/accept`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      // Remove the accepted booking from the list
      setAvailableBookings((prevBookings) =>
        prevBookings.filter((b) => b._id !== booking._id)
      );
  
      handleAcceptBooking(booking);
    } catch (error) {
      console.error('Error accepting booking:', error);
      if (error.response) {
        console.error('Server response:', error.response.data);
      }
    }
  };
  

  if (loading) {
    return <div className="text-center text-gray-600">Loading pending bookings...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {availableBookings.length === 0 ? (
        <div className="col-span-full text-center text-gray-600">No pending bookings found.</div>
      ) : (
        availableBookings.map((booking) => (
          <div key={booking._id} className="bg-white p-5 shadow-lg border border-[#38B2AC] rounded-xl">
            <div className="font-bold text-lg text-[#2C7A7B] mb-2">
              {booking.user?.username || 'Unknown Booker'}
            </div>
            <div className="text-gray-700 mb-1">
              <strong>From (Lat, Lng):</strong>{' '}
              {booking.pickupLocation?.coordinates
                ? `${booking.pickupLocation.coordinates[1]}, ${booking.pickupLocation.coordinates[0]}`
                : 'N/A'}
            </div>
            <div className="text-gray-700 mb-1">
              <strong>To:</strong> {booking.dropoffLocation?.coordinates
                ? `${booking.dropoffLocation.coordinates[1]}, ${booking.dropoffLocation.coordinates[0]}`
                : 'N/A'}
            </div>
            <div className="text-sm text-gray-500 mb-1">
              <strong>Start:</strong>{' '}
              {booking.createdAt ? new Date(booking.createdAt).toLocaleString() : 'N/A'}
            </div>
            <div className="text-sm text-gray-500 mb-3">
              <strong>ETA:</strong>{' '}
              {booking.estimatedDeliveryTime
                ? new Date(booking.estimatedDeliveryTime).toLocaleString()
                : 'N/A'}
            </div>
            <button
              onClick={() => acceptBooking(booking)} // Use the updated acceptBooking function
              className="w-full px-4 py-2 bg-[#38B2AC] text-white rounded-md hover:bg-[#2C7A7B] transition"
            >
              Accept Booking
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default FindBookings;
