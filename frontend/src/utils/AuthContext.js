import React, { createContext, useContext, useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import {jwtDecode} from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [cookies, setCookie, removeCookie] = useCookies(['tokenId']);
  const [authState, setAuthState] = useState({
    isLoggedIn: false,
    isAdmin: false,
    userId: null,
    userName: null,
    role: null,
  });


  useEffect(() => {
    // setCookie('working', 'authContext_dummy_token'); // just to check 
    if (cookies.tokenId) {
      try {
        const decodedToken = jwtDecode(cookies.tokenId);
        setAuthState({
          isLoggedIn: true,
          isAdmin: decodedToken.role === 'admin',
          userId: decodedToken.userId,    
          userName: decodedToken.name,
          role: decodedToken.role,
        });
      } catch (error) {
        console.error('Invalid token', error);
        setAuthState({
          isLoggedIn: false,
          isAdmin: false,
          userId: null,
          userName: null,
          role: null,
        });
      }
    }
  }, [cookies.tokenId]);

  
  const logout = () => {
    removeCookie('tokenId');
    setAuthState({
      isLoggedIn: false,
      isAdmin: false,
      userId: null,
      userName: null,
      role: null,
    });
  };

  return (
    <AuthContext.Provider value={{ authState, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

