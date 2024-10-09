import React, { useEffect, useState } from 'react';
import serverOrigin from '../../utils/constant';
import { toast } from 'react-hot-toast';
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { jwtDecode } from "jwt-decode";


import { useAuth } from '../../utils/AuthContext';



const AllUsersPage = () => {
  const { authState, logout } = useAuth();
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const [cookies] = useCookies(["tokenId"]);
  let isAdmin = false;

  useEffect(() => {

    const tokenId = cookies.tokenId;

    if(!(tokenId)){
      toast.error('Please login First to View All users');
      return navigate('/login');
    }
    else{
      const decodedToken = jwtDecode(tokenId);
      isAdmin = (decodedToken.role == 'admin');
    }
    if(!isAdmin){
      toast.error('Unauthorized! You need to have Admin Access');
      return navigate('/');
    }

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
          const errorData = await response.json();
          // console.log(errorData);
          const errorMessage = errorData.errors ? errorData.errors[0] : 'Failed to Fetch all User';
          throw new Error(errorMessage);
        }

        const data = await response.json();
        setUsers(data);
      } catch (error) {
        toast.error(`Error: ${error.message}`);
      }
    };

    fetchUsers();
  }, [authState.isAdmin]);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">All Users</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => (
          <div key={user.userId} className="bg-white shadow-md rounded-md p-4 border">
            <h2 className="font-bold text-xl">{user.name}</h2>
            <p className="text-gray-700">Email: {user.email}</p>
            <p className="text-gray-700">Mobile: {user.mobile}</p>
            <p className="text-gray-700">Role: {user.role}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllUsersPage;
