import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../../Context/ThemeContext";
import { ArrowLeft } from "lucide-react";

const ReturnButton = () => {
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);
  return (
    <button
      onClick={() => navigate(-1)}
      className={` rounded-md flex items-center text-sm font-semibold transition-colors cursor-pointer ${
        theme === "light"
          ? "text-gray-600 hover:text-gray-800 bg-gray-200"
          : "text-gray-200 hover:text-gray-300 bg-white/20"
      }`}
    >
      <div className="flex px-3 py-2 gap-2 hover:translate-x-1 duration-150">
        <ArrowLeft size={18} /> Return
      </div>
    </button>
  );
};

export default ReturnButton;
