import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-hot-toast';
import { server_origin } from '../../utils/constant';
import { useNavigate } from 'react-router-dom';

const AddRestaurant = () => {
  const [cookies] = useCookies(['tokenId']);
  // const [isAdmin, setIsAdmin] = useState(false);
  const [restaurantData, setRestaurantData] = useState({
    name: '',
    location: '',
    mobile: '',
    tableCount: 0,
    ownerId: '',
  });
  const navigate = useNavigate();
  let isAdmin = false ;

  useEffect(() => {  
    
    const tokenId = cookies.tokenId;
    if (tokenId) {
      const decodedToken = jwtDecode(tokenId);
      isAdmin = (decodedToken.role === 'admin') ;
    }

    if(!isAdmin){
      // console.log(isAdmin );
      toast.error('Unauthorized: Only admin can Access');
      navigate('/');
    }

  },[]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRestaurantData({ ...restaurantData, [name]: value });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAdmin) {
      toast.error('Unauthorized: Only admin can add restaurants');
      return;
    }

    try {
      const response = await fetch(`${server_origin}/admin/restaurant`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(restaurantData),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add restaurant');
      }

      const result = await response.json();
      toast.success('Restaurant added successfully');
      // navigate('/');  

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
            <label className="block text-gray-700 font-bold mb-1">Owner ID</label>
            <input
              type="text"
              name="ownerId"
              value={restaurantData.ownerId}
              onChange={handleChange}
              required
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
