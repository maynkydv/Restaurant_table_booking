import React, { useEffect, useState } from 'react';
import { useCookies } from "react-cookie";
import {jwtDecode} from "jwt-decode"; 
import { server_origin } from '../../utils/constant';
import { toast } from "react-hot-toast";

import RestaurantCard from '../../components/RestaurantCard';

const RestaurantPage = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [cookies] = useCookies(["tokenId"]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(null);

  const [restaurants, setRestaurants] = useState([]);
  const [error, setError] = useState(null);

  const fetchRestaurants = async () => {
    try {
      const response = await fetch(`${server_origin}/user/restaurant`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch restaurants');
      }

      const restaurantData = await response.json();
      setRestaurants(restaurantData);
    } catch (error) {
      setError(error.message);
      toast.error('Error fetching restaurants:', error.message);
    }
  };

  useEffect(() => {
    
  }, []);


  useEffect(() => {

    fetchRestaurants();

    const tokenId = cookies.tokenId;
    if (tokenId) {
      setIsLoggedIn(true);

      try {
        const decodedToken = jwtDecode(tokenId);
        setRole(decodedToken.role);

        if (decodedToken.role === "admin") {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
        
      } catch (error) {
        console.error("Invalid token", error);
      }
    } else {
      setIsLoggedIn(false);
    }


  }, [cookies]); 

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Restaurants</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {restaurants.map((restaurant, index) => (
          <RestaurantCard key={index} restaurant={restaurant} isLoggedIn={isLoggedIn} isAdmin={isAdmin} />
        ))}
      </div>
    </div>
  );
};

export default RestaurantPage;
