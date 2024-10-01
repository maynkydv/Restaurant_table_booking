import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { jwtDecode } from "jwt-decode";

const Home = () => {
  const [cookies] = useCookies(["tokenId"]);
  const [role, setRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const tokenId = cookies.tokenId;
    if (tokenId) {
      try {
        const decodedToken = jwtDecode(tokenId);
        setRole(decodedToken.role);
      } catch (error) {
        console.error("Invalid token", error);
      }
    }
  }, [cookies]);

  const handleBookTableClick = () => {
    navigate("/restaurants");
  };

  const handleAddRestaurantClick = () => {
    navigate("/add-restaurant");
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-r from-blue-200 via-blue-100 to-blue-300">
      <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
        Welcome to Restaurant Table Booking
      </h1>


      <div className="flex flex-row justify-around space-x-44">
        <button
          onClick={handleBookTableClick}
          className="w-full mb-6 py-3 px-6 text-lg font-semibold text-white bg-blue-500 rounded-full shadow-lg"
        >
          Book Table
        </button>


        {role === "admin" && (
          <button
            onClick={handleAddRestaurantClick}
            className="w-full mb-6 py-3 px-6 text-lg font-semibold text-white bg-blue-500 rounded-full shadow-lg"
          >
            Add Restaurant
          </button>
        )}
      </div>
    </div>
  );
};

export default Home;
