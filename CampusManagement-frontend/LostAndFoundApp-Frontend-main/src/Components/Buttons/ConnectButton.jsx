import React, { useContext } from "react";
import { Users } from "lucide-react";
import { ThemeContext } from "../../Context/ThemeContext";

const ConnectButton = ({ onClick, onConnect, item, className = "" }) => {
  const { theme } = useContext(ThemeContext);

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (onConnect && item) {
      onConnect(item);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all shadow-md transform hover:scale-105 cursor-pointer ${
        theme === "light"
          ? "bg-green-100 text-green-700 border border-green-200 hover:bg-green-200"
          : "bg-green-800/20 text-green-400 border border-green-600/50 hover:bg-green-800/30"
      } ${className}`}
    >
      <Users size={16} />
      Connect
    </button>
  );
};

export default ConnectButton;
