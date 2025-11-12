// src/Components/ThemeToggleButton.js

import React, { useContext } from "react";
import { ThemeContext } from "../../Context/ThemeContext";
import { Sun, Moon } from "lucide-react";

const ThemeToggleButton = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      className={`relative inline-flex items-center h-8 w-16 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer ${
        // Swapped colors: blue for 'on' (dark), gray for 'off' (light)
        isDark ? "bg-blue-600" : "bg-gray-200"
      }`}
      aria-label="Toggle theme"
    >
      <span
        className={`absolute inset-y-0 left-1 my-auto h-6 w-6 rounded-full bg-white shadow-md transform transition-transform duration-300 flex items-center justify-center ${
          isDark ? "translate-x-8" : "translate-x-0"
        }`}
      >
        {isDark ? (
          // Adjusted moon icon color to match 'on' state
          <Moon className="h-4 w-4 text-blue-600" />
        ) : (
          // Adjusted sun icon color for better visibility
          <Sun className="h-4 w-4 text-yellow-500" />
        )}
      </span>
    </button>
  );
};

export default ThemeToggleButton;
