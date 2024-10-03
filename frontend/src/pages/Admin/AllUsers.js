import React, { useEffect, useState } from 'react';
import { server_origin } from '../../utils/constant';
import { toast } from 'react-hot-toast';
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { jwtDecode } from "jwt-decode";


const AllUsersPage = () => {
  const [cookies, setCookie, removeCookie] = useCookies(["tokenId"]);
  const [users, setUsers] = useState([]);
  const [isAdmin , setIsAdmin] = useState(false);
  const navigate = useNavigate();
  // let isAdmin = false;

  useEffect(() => {
    const tokenId = cookies.tokenId;
    if (tokenId) {
      const decodedToken = jwtDecode(tokenId);
      setIsAdmin(decodedToken.role === 'admin');
    }

    if (!isAdmin) {
      toast.error('Unauthorized: Only admin can access');
      navigate('/');
    }

    const fetchUsers = async () => {
      try {
        const response = await fetch(`${server_origin}/admin/users`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }

        const data = await response.json();
        setUsers(data);
      } catch (error) {
        toast.error(`Error: ${error.message}`);
      }
    };

    fetchUsers();
  }, []);

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
            {/* You can add more user details here if necessary */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllUsersPage;
