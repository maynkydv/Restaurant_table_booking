import React, { useState, useEffect } from "react";
import { server_origin } from '../utils/constant';
import { toast } from "react-hot-toast";
import { useNavigate } from 'react-router-dom';
import { useCookies } from "react-cookie";
import { jwtDecode } from "jwt-decode"; 

const RestaurantCard = ({ restaurant, isLoggedIn, isAdmin }) => {
  const [cookies, setCookie, removeCookie] = useCookies(["tokenId"]);
  const { restaurantId, name, location, mobile, tableCount } = restaurant;
  // console.log(restaurant);
  const navigate = useNavigate();

  const [isBookingFormVisible, setBookingFormVisible] = useState(false);
  const [formData, setFormData] = useState({
    restaurantId: restaurantId,
    restaurantName: name,
    userId: '',
    userName: '',
    date: '',
    startTime: '',
    endTime: '',
    guestCount: 1,
  });


  useEffect(() => {
    const tokenId = cookies.tokenId;
    if (!tokenId) {
      toast.error('Login First');
      navigate('/login');
    }
    try {
      const decodedToken = jwtDecode(tokenId);
      setFormData({ ...formData,
        userId: decodedToken.userId,
        userName: decodedToken.userName,
       });
    } catch (error) {
      console.error("Invalid token", error);
    }
    
  }, [cookies]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleBookingToggle = () => {
    if (isLoggedIn) {
      setBookingFormVisible((prev) => !prev);
    } else {
      toast.error('Please log in to book a table.');
    }
  };

  const removeRestaurant = async () => {
    if (!isLoggedIn) {
      toast.error('Please log in to remove a restaurant.');
      return;
    }
    if (!isAdmin) {
      toast.error('Unauthorized for normal User');
      return;
    }
    const confirmed = window.confirm(`Are you sure you want to delete the restaurant: ${restaurant.name}?`);

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(`${server_origin}/admin/restaurant/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ restaurantId: restaurantId }),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete restaurant');
      }

      const result = await response.json();
      toast.success(result.message);
      window.location.reload();
      // navigate('/restaurants'); // Navigate after deletion

    } catch (error) {
      console.error('Error removing restaurant:', error.message);
      toast.error(`Error: ${error.message}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      toast.error('Please log in to book a table.');
      return;
    }

    try {
      console.log(formData);
      const response = await fetch(`${server_origin}/user/booking`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create booking');
      }


      const result = await response.json();

      console.log(result);

      toast.success(`${result.message} Your Table number is ${result.booking.tableNumber}`);

      setFormData({
        restaurantId: restaurantId,
        restaurantName: name,
        date: '',
        startTime: '',
        endTime: '',
        guestCount: 1,
      });
      setBookingFormVisible(false);
      navigate('/profile');

    } catch (error) {
      console.error('Error booking table:', error.message);
      toast.error(`Oops !! ${error.message}`);
    }
  };

  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white">
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">{name}</div>
        <p className="text-gray-600 text-sm mb-2">Location: {location}</p>
        <p className="text-gray-600 text-sm mb-2">Contact: {mobile}</p>
        <p className="text-gray-700 text-base">Table Available: {tableCount}</p>
      </div>

      {/* Buttons */}
      <div className="px-6 py-4">
        <button
          onClick={handleBookingToggle}
          className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded mb-2 w-full"
        >
          {isBookingFormVisible ? 'Discard Booking' : 'Book Now'}
        </button>

        {isAdmin && (
          <div className="flex flex-col gap-2">
            <button onClick={removeRestaurant} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
              Remove Restaurant
            </button>
          </div>
        )}
      </div>

      {/* Booking Form */}
      {isBookingFormVisible && (
        <div className="px-6 py-4 bg-gray-100 rounded">
          <h2 className="text-lg font-bold mb-2">Booking Form</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="date" className="block text-gray-700 font-semibold mb-1">Date</label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="startTime" className="block text-gray-700 font-semibold mb-1">Start Time</label>
              <input
                type="time"
                id="startTime"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="endTime" className="block text-gray-700 font-semibold mb-1">End Time</label>
              <input
                type="time"
                id="endTime"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="guestCount" className="block text-gray-700 font-semibold mb-1">Number of guestCount</label>
              <input
                type="number"
                id="guestCount"
                name="guestCount"
                value={formData.guestCount}
                min="1"
                max="20"
                onChange={handleChange}
                required
                className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex justify-center">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded-md"
              >
                Book Now
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default RestaurantCard;
