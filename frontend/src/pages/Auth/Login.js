import React, { useState } from 'react';
import serverOrigin from '../../utils/constant';
import { useNavigate } from 'react-router-dom';
import { toast, } from "react-hot-toast";


const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    console.log(formData);
    if (formData.email.length < 5|| !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error('Email is not valid.');
      return false;
    }
    else if (formData.password.length < 5) {
      toast.error('Password must be at least 5 characters long.');
      return false;
    }
    return true; 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(!validateForm()){
      return ;
    }

    try {
      const response = await fetch(`${serverOrigin}/user/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json();

        if (response.status === 404) {
          throw new Error('Invalid email');
        } else if (response.status === 401) {
          throw new Error('Invalid password');
        } else {
          // console.log(errorData);
          const errorMessage = errorData.errors ? errorData.errors[0] : 'Failed to Login';
          throw new Error(errorMessage);
        }
    
      }

      const userData = await response.json();

      console.log('User Logged In successfully:', userData);
      toast.success('User logged in successfully!');
      navigate("/");

    } catch (error) {
      console.error('Error during login:', error.message);
      toast.error(`Login failed: ${error.message}`);
    }
  };


  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded px-8 py-6 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Your Email"
            />
          </div>
          <div>
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Your Password"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-semibold py-2 rounded-lg hover:bg-blue-600"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
