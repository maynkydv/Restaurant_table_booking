import React, { useState, useEffect } from 'react';
import serverOrigin from '../../utils/constant';
import { toast, } from "react-hot-toast";
import { useAuth } from '../../utils/AuthContext';
import { useNavigate } from 'react-router-dom';

import { useCookies } from 'react-cookie';



const ProfilePage = () => {
  const [cookies, setCookie, removeCookie] = useCookies(['tokenId']);
  const { authState ,logout } = useAuth();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '',
    mobile: '',
  });
  const [bookings, setBookings] = useState([]);

  
  useEffect(() => {
    if(!cookies.tokenId){
      toast.error('To View Profile Login First');
      return navigate('/login');
    }
    const fetchUserDetails = async () => {
      try {
        const response = await fetch(`${serverOrigin}/user`, {
          method: 'GET',
          credentials: 'include', 
        });

        if (!response.ok) {
          const errorData = await response.json();
          // console.log(errorData);
          const errorMessage = errorData.errors ? errorData.errors[0] : 'Failed to fetch user data';
          throw new Error(errorMessage);
        }
        const userData = await response.json();
        // console.log(userData);
        setUserData({
          name: userData.name,
          email: userData.email,
          password: '********',  
          mobile: userData.mobile,
        });
        // console.log(userData);
        setBookings(userData.Bookings || []);  

      } catch (error) {
        console.error('Error fetching user details:', error.message);
        toast.error(`Error: ${error.message}`);
      }
    };

    fetchUserDetails();
  }, [navigate , authState.isLoggedIn]);  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };


  const validateForm = () => {

    if (userData.name.length  === 0 ) {
      toast.error('Name should have Alphabets');
      return false;
    }
    if (userData.name.length  < 5 ) {
      toast.error('Name must be at least 5 characters long.');
      return false;
    }
    if (!/^[a-zA-Z]/.test(userData.name)) {
      toast.error('Name should not start with a number.');
      return false;
    }
    if (userData.email.length < 5 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
      toast.error('Email is not valid.');
      return false;
    }
    if (userData.password.length < 5) {
      toast.error('Password must be at least 5 characters long.');
      return false;
    }
    if (!/^\d{10}$/.test(userData.mobile)) {
      toast.error('Mobile number must be a 10-digit number.');
      return false;
    }
    return true;
  };


  const handleUpdateClick = async () => {
    if (!validateForm()) {
      return;
    }
    try {
      const response = await fetch(`${serverOrigin}/user`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
        credentials: 'include',  
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update user data');
      }

      toast.success('Profile updated successfully!');
      setIsEditing(false);

    } catch (error) {
      console.error('Error updating user details:', error.message);
      toast.error(`Error: ${error.message}`);
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    try {
      const response = await fetch(`${serverOrigin}/user/booking`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bookingId }),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete booking');
      }

      toast.success('Booking deleted successfully!');
      // window.location.reload();
      setBookings((prevBookings) => prevBookings.filter(booking => booking.bookingId !== bookingId));

    } catch (error) {
      console.error('Error deleting booking:', error.message);
      toast.error(`Error: ${error.message}`);
    }
  };


  const isUnbookable = (endTime) => {
    return true ;
    const currentTime = Date.now();
    console.log(currentTime);
    const bookingEndTime = new Date(endTime);
    console.log(endTime);

    return currentTime < bookingEndTime;
  };



  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Profile Details</h2>

      <div className="mb-4">
        <label className="block text-gray-700">Name</label>
        {isEditing ? (
          <input
            type="text"
            name="name"
            value={userData.name}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        ) : (
          <p className="text-gray-700">{userData.name}</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Email</label>
        {isEditing ? (
          <input
            type="email"
            name="email"
            value={userData.email}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        ) : (
          <p className="text-gray-700">{userData.email}</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Password</label>
        {isEditing ? (
          <input
            type="password"
            name="password"
            value={userData.password}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        ) : (
          <p className="text-gray-700">{userData.password}</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Mobile Number</label>
        {isEditing ? (
          <input
            type="text"
            name="mobile"
            value={userData.mobile}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        ) : (
          <p className="text-gray-700">{userData.mobile}</p>
        )}
      </div>

      <button
        className="bg-blue-500 text-white font-bold py-2 px-4 rounded mr-2"
        onClick={isEditing ? handleUpdateClick : handleEditClick}
      >
        {isEditing ? "Update" : "Edit"}
      </button>

      <h2 className="text-2xl font-bold mt-8 mb-4">Your Bookings</h2>
      {bookings.length > 0 ? (
        <ul>
        {bookings.map((booking) => (
          <li key={booking.bookingId} className="mb-2 p-2 border border-gray-300 rounded flex justify-between items-center">
            <div>
              <p><strong>Restaurant Name:</strong> {booking.restaurantName}</p>
              <p><strong>Table Number:</strong> {booking.tableNumber}</p>
              <p><strong>For:</strong> {booking.guestCount} Guest</p>
              <p><strong>Date:</strong> {booking.date}</p>
              <p><strong>From:</strong> {booking.startTime}</p>
              <p><strong>To:</strong> {booking.endTime}</p>
            </div>
            {isUnbookable(booking.endTime) && ( // Check if the booking can be unbooked
              <button
                onClick={() => handleDeleteBooking(booking.bookingId)}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded"
              >
                Unbook
              </button>
            )}
          </li>
        ))}
      </ul>
    ) : (
      <p>No bookings found.</p>
    )}
  </div>
);
};

export default ProfilePage;