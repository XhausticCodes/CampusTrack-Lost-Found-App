import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../../Context/ThemeContext";
import { getUserDetails } from "../../Services/LoginService";
import { ArrowLeft, Home } from "lucide-react";

const ReturnHome = () => {
  const navigate = useNavigate();
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

  const handleHomeNavigation = () => {
    if (userRole === "Admin") {
      navigate("/AdminMenu");
    } else if (userRole === "Student") {
      navigate("/StudentMenu");
    } else {
      navigate("/");
    }
  };

  return (
    <button
      onClick={handleHomeNavigation}
      disabled={loading}
      className={`rounded-md flex items-center text-sm font-semibold transition-colors cursor-pointer ${
        theme === "light"
          ? "text-gray-600 hover:text-gray-800 bg-gray-200"
          : "text-gray-200 hover:text-gray-300 bg-white/20"
      } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      <div className="flex px-3 py-2 gap-2 hover:translate-x-1 duration-150">
        <ArrowLeft size={18} /> Return
      </div>
    </button>
  );
};

export default ReturnHome;
