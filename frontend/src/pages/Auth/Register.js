import React, { useState } from 'react';
import serverOrigin from '../../utils/constant';
import { useNavigate } from 'react-router-dom';
import { toast, } from "react-hot-toast";


const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    mobile: ''
  });

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {

    if (formData.name.length  === 0 ) {
      toast.error('Name should have Alphabets');
      return false;
    }
    if (formData.name.length  < 5 ) {
      toast.error('Name must be at least 5 characters long.');
      return false;
    }
    if (!/^[a-zA-Z]/.test(formData.name)) {
      toast.error('Name should not start with a number.');
      return false;
    }
    if (formData.email.length < 5 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error('Email is not valid.');
      return false;
    }
    if (formData.password.length < 5) {
      toast.error('Password must be at least 5 characters long.');
      return false;
    }
    if (!/^\d{10}$/.test(formData.mobile)) {
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

    try {
      const response = await fetch(`${serverOrigin}/user/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        credentials: 'include'
      });
      if (!response.ok) {
        const errorData = await response.json();
        // console.log(errorData);
        const errorMessage = errorData.errors ? errorData.errors[0] : 'Failed to create user';
        throw new Error(errorMessage);
      }

      const userData = await response.json();

      console.log('User created successfully:', userData);
      toast.success('User registration and LoggedIn successful');
      // navigate("/login");
      navigate("/");

    } catch (error) {
      console.error('Error during registration:', error.message);
      toast.error(`Registration failed: ${error.message}`);
    }
  };


  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded px-8 py-6 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Register</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Your Name"
            />
          </div>
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
          <div>
            <label className="block text-gray-700">Mobile Number</label>
            <input
              type="text"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Your Mobile Number"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-semibold py-2 rounded-lg hover:bg-blue-600"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
