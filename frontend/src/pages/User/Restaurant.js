import React, { useEffect, useState } from 'react';
import serverOrigin from '../../utils/constant';
import { toast } from "react-hot-toast";

import RestaurantCard from '../../components/RestaurantCard';



const RestaurantPage = () => {
  const [restaurants, setRestaurants] = useState([]);


  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await fetch(`${serverOrigin}/user/restaurant`, {
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
        console.error('Error fetching restaurants:', error.message);
        toast.error('Error fetching restaurants:', error.message);
      }
    };

    fetchRestaurants();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Restaurants</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {restaurants.map((restaurant, index) => (
          <RestaurantCard key={index} restaurant={restaurant} />
        ))}
      </div>
    </div>
  );
};

export default RestaurantPage;
