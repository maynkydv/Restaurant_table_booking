import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { useAuth } from '../utils/AuthContext';

const Navbar = () => {
  const { authState, checkAuth , logout } = useAuth();
  const handleLogout = () => {
    logout();
  };

  return (<>
    <nav className="bg-white shadow-md p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Left  */}
        <div className="flex items-center space-x-6">
          <Link to="/" className="text-gray-700 text-lg font-semibold hover:text-gray-900">
            Home
          </Link>
          <Link to="/restaurants" className="text-gray-700 text-lg font-semibold hover:text-gray-900">
            Restaurants
          </Link>

          {authState.isLoggedIn && authState.isAdmin && (
            <>
              <Link to="/add-restaurant" className="flex items-center text-lg text-blue-600 font-bold hover:text-gray-900">
                Add Restaurant
              </Link><Link to="/users" className="flex items-center text-lg text-blue-600 font-bold hover:text-gray-900">
                All Users
              </Link>
            </>
          )}
        </div>

        {/* Right */}
        <div className="flex items-center space-x-6">
          {authState.isLoggedIn && (
            <span className="text-blue-600 font-bold">
              {authState.role.charAt(0).toUpperCase() + authState.role.slice(1)} {/* Capitalize the role */}
            </span>
          )}

          {!(authState.isLoggedIn) ? (
            <>
              <Link to="/login" className="text-gray-700 text-lg font-semibold hover:text-gray-900">
                Login
              </Link>
              <Link to="/register" className="text-gray-700 text-lg font-semibold hover:text-gray-900">
                Register
              </Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="text-gray-700 text-lg font-semibold hover:text-gray-900"
            >
              Logout
            </button>
          )}

          {authState.isLoggedIn && (
            <Link
              to="/profile"
              className="flex items-center text-gray-700 text-lg font-semibold hover:text-gray-900"
            >
              <FaUserCircle className="mr-2" size={24} /> {/* User Icon */}
            </Link>
          )}
        </div>
      </div>
    </nav>
  </>
  );
};

export default Navbar;
