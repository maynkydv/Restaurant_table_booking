import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import serverOrigin from '../../utils/constant';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../utils/AuthContext';

import { useCookies } from 'react-cookie';
import {jwtDecode} from 'jwt-decode';

const AddRestaurant = () => {
  const { authState, logout } = useAuth();

  const [cookies] = useCookies(["tokenId"]);
  let isAdmin = false;

  const [restaurantData, setRestaurantData] = useState({
    name: '',
    location: '',
    mobile: '',
    tableCount: 0,
    userId: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [users, setUsers] = useState([]); 
  const navigate = useNavigate();

  useEffect(() => {
    const tokenId = cookies.tokenId;


    if(!(tokenId)){
      toast.error('Please login First to Add Restaurant');
      return navigate('/login');
    }
    else{
      const decodedToken = jwtDecode(tokenId);
      isAdmin = (decodedToken.role == 'admin');
    }
    if(!isAdmin){
      toast.error('Unauthorized! You cannot add Restaurant');
      return navigate('/');
    }

    // Fetch all users from the server
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${serverOrigin}/admin/users`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }

        const usersData = await response.json();
        setUsers(usersData);
      } catch (error) {
        toast.error(`Error: ${error.message}`);
      }
    };

    fetchUsers();
  }, [authState.isAdmin]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRestaurantData({ ...restaurantData, [name]: value });
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]); 
  };

  const validateForm = () => {

    if (restaurantData.name.length  === 0 ) {
      toast.error('Restaurant Name should have Alphabets');
      return false;
    }
    if (restaurantData.name.length  < 5 ) {
      toast.error('Restaurant Name must be at least 5 characters long.');
      return false;
    }
    if (restaurantData.location.length  < 5 ) {
      toast.error('Location must be at least 5 characters long.');
      return false;
    }
    if (!/^[a-zA-Z]/.test(restaurantData.name)) {
      toast.error('Restaurant Name should not start with a number.');
      return false;
    }
    if (restaurantData.tableCount.length > 20) {
      toast.error('Table Count atmost can be 20 .');
      return false;
    }
    if (restaurantData.tableCount.length > 3) {
      toast.error('Table Count must be atleast 3.');
      return false;
    }
    if (!/^\d{10}$/.test(restaurantData.mobile)) {
      toast.error('Mobile number must be a 10-digit number.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }
    const formData = new FormData(); 

    formData.append('name', restaurantData.name);
    formData.append('location', restaurantData.location);
    formData.append('mobile', restaurantData.mobile);
    formData.append('tableCount', restaurantData.tableCount);
    formData.append('userId', restaurantData.userId);

    if (imageFile) {
      formData.append('myImage', imageFile); 
    }

    try {
      const response = await fetch(`${serverOrigin}/admin/restaurant`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        // console.log(errorData);
        const errorMessage = errorData.errors ? errorData.errors[0] : 'Failed to Add Restaurant';
        throw new Error(errorMessage);
      }

      toast.success('Restaurant added successfully');
      navigate('/restaurants');
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Add A New Restaurant</h1>
      <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-bold mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={restaurantData.name}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-bold mb-1">Location</label>
            <input
              type="text"
              name="location"
              value={restaurantData.location}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-bold mb-1">Mobile</label>
            <input
              type="text"
              name="mobile"
              value={restaurantData.mobile}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-bold mb-1">Table Count</label>
            <input
              type="number"
              name="tableCount"
              value={restaurantData.tableCount}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-bold mb-1">Owner</label>
            <select
              type="userId"
              name="userId"
              value={restaurantData.userId}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded"
            >
              <option value="">Select Owner</option>
              {users.map((user) => (
                <option key={user.userId} value={user.userId}>
                  {user.name} ({user.email})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-700 font-bold mb-1">Upload Image</label>
            <input
              type="file"
              name="myImage"
              onChange={handleImageChange}
              accept="image/*"
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Add Restaurant
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddRestaurant;
