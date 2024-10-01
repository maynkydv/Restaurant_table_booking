import React, { useState, useEffect } from 'react';
import { server_origin } from '../../utils/constant';
import { toast, } from "react-hot-toast";

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '',
    mobile: '',
  });
  const [bookings, setBookings] = useState([]);

  
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch(`${server_origin}/user/`, {
          method: 'GET',
          credentials: 'include', 
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch user data');
        }

        const userData = await response.json();
        setUserData({
          name: userData.name,
          email: userData.email,
          password: '********',  
          mobile: userData.mobile,
        });
        console.log(userData);
        setBookings(userData.Bookings || []);  

      } catch (error) {
        console.error('Error fetching user details:', error.message);
        toast.error(`Error: ${error.message}`);
      }
    };

    fetchUserDetails();
  }, []);  

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

  const handleUpdateClick = async () => {
    try {
      const response = await fetch(`${server_origin}/user/update`, {
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
          {bookings.map((booking, index) => (
            <li key={index} className="mb-2 p-2 border border-gray-300 rounded">
              {/* <p><strong>Restaurant:</strong> {booking.restaurant}</p> */}
              <p><strong>Restaurant Id:</strong> {booking.restaurantId}</p>
              <p><strong>Table Number:</strong> {booking.tableNumber}</p>
              <p><strong>Date:</strong> {booking.date}</p>
              <p><strong>From:</strong> {booking.startTime}</p>
              <p><strong>To:</strong> {booking.endTime}</p>
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
