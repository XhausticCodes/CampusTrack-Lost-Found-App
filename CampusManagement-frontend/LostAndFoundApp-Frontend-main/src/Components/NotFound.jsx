import React, { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertTriangle, Home, LogIn } from 'lucide-react';
import { getUserDetails } from '../Services/LoginService'; // Assuming this checks auth status
import { ThemeContext } from '../Context/ThemeContext'; // Assuming you have a theme context

const NotFound = () => {
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext); // Use theme context

  useEffect(() => {
    getUserDetails()
      .then(response => {
        setUserRole(response.data?.role || null);
      })
      .catch(() => {
        setUserRole(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []); 

  const getRedirectPath = () => {
    if (userRole === 'Admin') {
      return '/AdminMenu';
    } else if (userRole === 'Student') {
      return '/StudentMenu';
    } else {
      return '/'; 
    }
  };

  const getRedirectText = () => {
    if (userRole) {
      return 'Go to Dashboard';
    } else {
      return 'Go to Login';
    }
  };

   const getRedirectIcon = () => {
     if (userRole) {
       return <Home size={18} className="mr-2" />;
     } else {
       return <LogIn size={18} className="mr-2" />;
     }
   };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${theme === 'light' ? 'bg-gradient-to-br from-gray-100 to-gray-200' : 'bg-gradient-to-br from-gray-800 to-gray-900 text-gray-200'}`}>
      <div className={`text-center p-8 sm:p-12 rounded-2xl shadow-2xl max-w-lg w-full ${theme === 'light' ? 'bg-white' : 'bg-gray-800 border border-gray-700'}`}>
        <AlertTriangle className={`h-16 w-16 mx-auto mb-6 ${theme === 'light' ? 'text-yellow-500' : 'text-yellow-400'}`} />
        <h1 className={`text-5xl sm:text-6xl font-extrabold mb-3 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
          404
        </h1>
        <h2 className={`text-2xl sm:text-3xl font-semibold mb-4 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
          Page Not Found
        </h2>
        <p className={`mb-8 text-base sm:text-lg ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
          The page you're looking for doesn't seem to exist.
        </p>
        {!isLoading && (
          <Link
            to={getRedirectPath()}
            className={`inline-flex items-center justify-center px-6 py-3 rounded-lg font-semibold transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              theme === 'light'
                ? 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500'
                : 'bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-400 focus:ring-offset-gray-800'
            }`}
          >
            {getRedirectIcon()}
            {getRedirectText()}
          </Link>
        )}
        {isLoading && (
           <div className="flex justify-center items-center mt-6">
             <div className={`animate-spin rounded-full h-6 w-6 border-b-2 ${theme === 'light' ? 'border-gray-900': 'border-gray-100'}`}></div>
           </div>
        )}
      </div>
    </div>
  );
};

export default NotFound;
