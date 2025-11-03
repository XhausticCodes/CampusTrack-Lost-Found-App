import React, { useState, useEffect, useContext } from "react";
import { getUserDetails } from "../../Services/LoginService";
import StudentNavbar from "../Navbar/StudentNavbar";
import AdminNavbar from "../Navbar/AdminNavbar";
import { ThemeContext } from "../../Context/ThemeContext";

const RoleBasedLayout = ({ children }) => {
  const { theme } = useContext(ThemeContext);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUserDetails()
      .then((response) => {
        const role = response.data?.role;
        setUserRole(role);
      })
      .catch((error) => {
        console.error("Failed to fetch user details:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div
        className={`flex justify-center items-center h-screen ${
          theme === "light" ? "bg-gray-50" : "bg-gray-900"
        }`}
      >
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div
      className={`h-screen font-sans antialiased flex flex-col overflow-hidden ${
        theme === "light" ? "bg-white" : "bg-gray-900 text-white"
      }`}
    >
      {userRole === "Admin" ? <AdminNavbar /> : <StudentNavbar />}
      <div className="flex-1 overflow-y-auto pt-20">{children}</div>
    </div>
  );
};

export default RoleBasedLayout;
