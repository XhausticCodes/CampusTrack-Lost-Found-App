import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { ThemeContext } from "../../Context/ThemeContext";
import { logoutUser } from "../../Services/LoginService";

const LogoutButton = ({ variant = "desktop" }) => {
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Call logout API
      await logoutUser();
    } catch (error) {
      console.error("Logout error:", error);
      // Continue with logout even if API call fails
    } finally {
      // Clear localStorage and dispatch logout event
      localStorage.removeItem("currentUser");
      window.dispatchEvent(new Event("userLogout"));

      // Navigate to login page
      navigate("/");
    }
  };

  if (variant === "desktop") {
    return (
      <button
        onClick={handleLogout}
        className={`flex items-center text-base font-medium transition-colors duration-200 cursor-pointer ${
          theme === "light"
            ? "text-gray-700 hover:text-red-600"
            : "text-gray-300 hover:text-red-400"
        }`}
      >
        <LogOut className="w-5 h-5 mr-2" /> Sign Out
      </button>
    );
  }

  return (
    <button
      onClick={handleLogout}
      className={`flex items-center w-full px-3 py-2 text-base font-medium rounded-md ${
        theme === "light"
          ? "text-gray-700 hover:bg-blue-50"
          : "text-gray-300 hover:bg-gray-700"
      }`}
    >
      <LogOut className="w-5 h-5 mr-3" /> Sign Out
    </button>
  );
};

export default LogoutButton;
