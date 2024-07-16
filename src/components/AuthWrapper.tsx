import React from 'react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

interface AuthWrapperProps {
  children: React.ReactNode;
}

const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState('pending');
  const router = useRouter();

  const isAuthenticated = async () => {
    try {
      const res = await axios.get('http://localhost:3001/user/verify', {
        withCredentials: true,
      });
      if (res.status === 200) {
        setIsLoggedIn('true');
        return;
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 403) {
        try {
          await axios.post('http://localhost:3001/user/refresh', {
            withCredentials: true,
          });
          setIsLoggedIn('true');
          return;
        } catch (error) {
          setIsLoggedIn('false');
          return;
        }
      } else {
        setIsLoggedIn('false');
        return;
      }
    }
  };

  useEffect(() => {
    isAuthenticated();
  });

  if (isLoggedIn === 'pending') {
    return <div>Loading...</div>;
  }
  if (isLoggedIn === 'true') {
    return children;
  }
  router.replace('/login');
  return null;
};

export default AuthWrapper;
