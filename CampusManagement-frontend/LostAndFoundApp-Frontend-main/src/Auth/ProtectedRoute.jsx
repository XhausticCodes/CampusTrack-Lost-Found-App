import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserDetails } from '../Services/LoginService';

const LoadingScreen = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f3f4f6' }}>
    <h2 style={{ color: '#4b5563' }}>Loading...</h2>
  </div>
);


const ProtectedRoute = ({ children, allowedRoles }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
     if (!allowedRoles || allowedRoles.length === 0) {
       console.error("ProtectedRoute requires 'allowedRoles' prop.");
       navigate('/');
       return;
     }

    getUserDetails()
      .then(response => {
         const user = response.data;
         if (user && user.role && allowedRoles.includes(user.role)) {
           setIsAuthorized(true);
         } else {
           console.warn(`Unauthorized access attempt to route requiring: ${allowedRoles}. User role: ${user?.role}`);
           if (user && user.role === 'Admin') {
             navigate('/AdminMenu');
           } else if (user && user.role === 'Student') {
             navigate('/StudentMenu');
           } else {
             navigate('/');
           }
         }
      })
      .catch(error => {
         console.error("Auth Error (ProtectedRoute):", error);
         navigate('/');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [allowedRoles, navigate]);

   if (isLoading) {
     return <LoadingScreen />;
   }
   return isAuthorized ? children : null;
};

export default ProtectedRoute;