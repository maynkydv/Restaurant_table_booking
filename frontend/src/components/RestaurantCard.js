import React, { useState, useEffect } from "react";
import serverOrigin from '../utils/constant';
import { toast } from "react-hot-toast";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import { useCookies } from 'react-cookie';


const RestaurantCard = ({ restaurant }) => {
  const { authState, logout } = useAuth();
  const [cookies] = useCookies(["tokenId"]);

  let { restaurantId, name, location, mobile, tableCount } = restaurant;
  // console.log(restaurant);
  const navigate = useNavigate();

  const imageName = name.replace(/\s+/g, '_').toLowerCase();
  const imageUrl = `${serverOrigin}/image/${imageName}.png`;

  const [isBookingFormVisible, setBookingFormVisible] = useState(false);
  const [formData, setFormData] = useState({
    restaurantId: restaurantId,
    restaurantName: name,
    userId: '',
    userName: authState.userName,
    date: '',
    startTime: '',
    endTime: '',
    guestCount: 1,
  });


  const [minDate, setMinDate] = useState('');
  const [minTime, setMinTime] = useState('');

  useEffect(() => {
    // Update min date and time to current date and time
    const now = new Date();
    // console.log(now);
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toTimeString().split(':').slice(0, 2).join(':');
    
    // console.log(now.toISOString());
    // console.log(timeStr);

    setMinDate(dateStr);
    setMinTime(timeStr);
    
    setFormData({
      ...formData,
      userId: authState.userId,
      userName: authState.userName,
    });
  }, [cookies, authState]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleBookingToggle = () => {
    if (authState.isLoggedIn) {
      setBookingFormVisible((prev) => !prev);
    } else {
      toast.error('Please log in to book a table.');
      // navigate('/');
    }
  };

  const handleViewBookings = () => {
    navigate(`/restaurant/${restaurantId}/bookings`);
  };


  const removeRestaurant = async () => {
    if (!(authState.isLoggedIn)) { // will never be called
      toast.error('Please log in to remove a restaurant.');
      return;
    }
    if (!(authState.isAdmin)) {
      toast.error('Unauthorized for normal User');
      return;
    }
    const confirmed = window.confirm(`Are you sure you want to delete the restaurant: ${restaurant.name}?`);

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(`${serverOrigin}/admin/restaurant/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ restaurantId: restaurantId }),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        // console.log(errorData);
        const errorMessage = errorData.errors ? errorData.errors[0] : 'Failed to Delete Restaurant';
        throw new Error(errorMessage);
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
    if (!(authState.isLoggedIn)) {
      toast.error('Please log in to book a table.');
      return;
    }
    console.log(authState);

    try {
      console.log(formData);
      const response = await fetch(`${serverOrigin}/user/booking`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        // console.log(errorData);
        const errorMessage = errorData.errors ? errorData.errors[0] : 'Failed to create booking';
        throw new Error(errorMessage);
      }


      const result = await response.json();

      // console.log(result);

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
    <>
      <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white">
        {/* Image */}
        <img
          className="w-full h-48 object-cover"
          src={imageUrl}
          onError={(e) => { e.target.onerror = null; e.target.src = `${serverOrigin}/image/default_placeholder.png`; }}
          alt={name || 'Restaurant'}
        />
        <div className="px-6 py-4">
          <div className="font-bold text-xl mb-2">{name}</div>
          <p className="text-gray-600 text-sm mb-2">Location: {location}</p>
          <p className="text-gray-600 text-sm mb-2">Contact: {mobile}</p>
          <p className="text-gray-700 text-base">Total Capacity: {tableCount} Tables</p>
        </div>

        {/* Buttons */}
        <div className="px-6 py-4">


          {authState.isAdmin && (
            <div className="flex flex-col gap-3 pb-2 pt-2">
              <button onClick={handleViewBookings} className="bg-yellow-400 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded">
                View Bookings
              </button>
            </div>
          )}
          {authState.isAdmin && (
            <div className="flex flex-col gap-3 pb-3 pt-2">
              <button onClick={removeRestaurant} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                Remove Restaurant
              </button>
            </div>
          )}

          <button
            onClick={handleBookingToggle}
            className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded mb-2 w-full"
          >
            {isBookingFormVisible ? 'Discard Booking' : 'Book Now'}
          </button>

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
                  min={minDate} 
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
                  min={formData.date === minDate ? minTime : undefined} // Only restrict time on current date or minDate
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
                  min={formData.startTime} 
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
    </>);
};

export default RestaurantCard;
