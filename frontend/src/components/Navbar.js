import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { jwtDecode } from "jwt-decode";
import { FaUserCircle } from "react-icons/fa";

const Navbar = () => {
  const [cookies, setCookie, removeCookie] = useCookies(["tokenId"]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const tokenId = cookies.tokenId;
    if (tokenId) {
      setIsLoggedIn(true);

      try {
        const decodedToken = jwtDecode(tokenId);
        setRole(decodedToken.role);
      } catch (error) {
        console.error("Invalid token", error);
      }
    } else {
      setIsLoggedIn(false);
    }
  }, [cookies]);

  const handleLogout = () => {
    removeCookie("tokenId"); // Remove token from cookies
    setRole(null);
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
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

          {(role) && (role === 'admin') && (
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
          {isLoggedIn && (
            <span className="text-blue-600 font-bold">
              {role.charAt(0).toUpperCase() + role.slice(1)} {/* Capitalize the role */}
            </span>
          )}

          {!isLoggedIn ? (
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

          {isLoggedIn && (
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
  );
};

export default Navbar;
