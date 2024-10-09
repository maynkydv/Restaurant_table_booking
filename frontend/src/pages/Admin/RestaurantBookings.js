import React, { useEffect, useState } from 'react';
import serverOrigin from '../../utils/constant';
import { toast } from 'react-hot-toast';
import { useNavigate ,useParams } from "react-router-dom";
import { useAuth } from '../../utils/AuthContext';

// import { useCookies } from 'react-cookie';




const RestaurantBookings = () => {
  const { authState, logout } = useAuth();
  // const [cookies] = useCookies(["tokenId"]);

  const { restaurantId } = useParams();   
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {

    if (!(authState.isAdmin)) {
      toast.error('Unauthorized: Only admin can access');
      return navigate('/');
    }

    const fetchBookings = async () => {
      try {
        const response = await fetch(`${serverOrigin}/admin/restaurant/${restaurantId}/bookings`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (!response.ok) {
          const errorData = await response.json();
          // console.log(errorData);
          const errorMessage = errorData.errors ? errorData.errors[0] : 'Failed to Fetch Restaurant Bookings ';
          throw new Error(errorMessage);
        }

        const data = await response.json();
        setBookings(data.bookings);
        // console.log(data.bookings);

        if(!data) {
          toast.error('No Booking Available')
          return navigate('/restaurants');
        }
      } catch (error) {
        toast.error(`Error: ${error.message}`);
      }
    };

    fetchBookings();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">All Bookings of {bookings[0]?.restaurantName}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bookings.map((booking) => (
          <div key={booking.userId} className="bg-white shadow-md rounded-md p-4 border">
            <h2 className="font-bold text-xl">Table Number: {booking.tableNumber}</h2>
            <p className="text-gray-700">Date: {booking.date}</p>
            <p className="text-gray-700">From: {booking.startTime}</p>
            <p className="text-gray-700">To: {booking.endTime}</p>
            <p className="text-gray-700">For: {booking.guestCount} Guest</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RestaurantBookings;
