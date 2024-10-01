import React from 'react';
import './App.css'
import { Toaster } from "react-hot-toast";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/User/Home';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Restaurant from './pages/User/Restaurant';
import Profile from './pages/User/Profile';
import BookingForm from './components/BookingForm';
import AddRestaurant from './pages/Admin/AddRestaurant';

function App() {

  return (
    <Router>
      <div>
        <Toaster toastOptions={{ duration: 4000 }} />
        <Navbar />
        <Routes>
        {/* User */}
          <Route path="/" element={<Home/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/register" element={<Register/>} />
          <Route path="/profile" element={<Profile/>} />
          <Route path="/restaurants" element={<Restaurant/>} />
          <Route path="/booking" element={<BookingForm/>} />


          {/* Admin */}
          <Route path="/add-restaurant" element={<AddRestaurant />} />
          {/* <Route path="/edit-restaurant" element={<Home />} />
          <Route path="/admin/users" element={<Home />} /> */}

          {/*Testing */}
          <Route path="/test/booking" element={<BookingForm />} />

          
        </Routes>
      </div>
    </Router>
  );
}

export default App;