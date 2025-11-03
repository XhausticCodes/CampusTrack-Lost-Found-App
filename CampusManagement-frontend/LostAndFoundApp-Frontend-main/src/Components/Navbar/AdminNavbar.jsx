import React, { useState, useRef, useContext } from "react";
import { Link } from "react-router-dom";
import {
  ChevronDown,
  Users,
  Archive,
  ArchiveRestore,
  LogOut,
  FileText,
  UserCheck,
  Menu,
  X,
} from "lucide-react";
import ThemeToggleButton from "../Buttons/ThemeToggleButton";
import { ThemeContext } from "../../Context/ThemeContext";

const AdminNavbar = () => {
  const { theme } = useContext(ThemeContext);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mobileDropdown, setMobileDropdown] = useState(null);
  const timeoutRef = useRef(null);

  const menuItems = [
    {
      title: "Reports",
      icon: FileText,
      items: [
        { name: "Lost Items", href: "/LostReport", icon: Archive },
        { name: "Found Items", href: "/FoundReport", icon: ArchiveRestore },
      ],
    },
    {
      title: "Students",
      icon: Users,
      items: [
        { name: "View Students", href: "/DeleteStudentList", icon: UserCheck },
      ],
    },
  ];

  const handleMouseEnter = (menuKey) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setOpenDropdown(menuKey);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 200);
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const toggleMobileDropdown = (name) => {
    setMobileDropdown(mobileDropdown === name ? null : name);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 shadow-md border-b ${
        theme === "light"
          ? "bg-white border-gray-200"
          : "bg-gray-800 border-gray-700"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-3">
          <Link to="/AdminMenu" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
              <Users className="text-blue-600 w-6 h-6" />
            </div>
            <h1
              className={`text-2xl font-semibold ${
                theme === "light" ? "text-gray-900" : "text-white"
              }`}
            >
              Admin Dashboard
            </h1>
          </Link>
        </div>

        <div className="hidden md:flex items-center space-x-8">
          {menuItems.map((menu) => {
            const isOpen = openDropdown === menu.title;
            return (
              <div
                key={menu.title}
                className="relative"
                onMouseEnter={() => handleMouseEnter(menu.title)}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  className={`flex items-center font-medium text-base transition-colors duration-200 ${
                    theme === "light"
                      ? "text-gray-700 hover:text-blue-600 focus:text-blue-600"
                      : "text-gray-300 hover:text-blue-400 focus:text-blue-400"
                  }`}
                >
                  <menu.icon className="w-5 h-5 mr-2" />
                  {menu.title}
                  <ChevronDown
                    className={`ml-1 w-5 h-5 transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    } ${theme === "light" ? "text-gray-500" : "text-gray-400"}`}
                  />
                </button>
                <div
                  className={`absolute top-full left-0 mt-2 w-64 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50 overflow-hidden transition-all ease-out duration-200 ${
                    theme === "light" ? "bg-white" : "bg-gray-800"
                  } ${
                    isOpen
                      ? "opacity-100 scale-100 translate-y-0"
                      : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                  }`}
                >
                  <div className="py-1">
                    {menu.items.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={`flex items-center w-full px-4 py-2 text-base transition-all duration-200 ${
                          theme === "light"
                            ? "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                            : "text-gray-300 hover:bg-gray-700 hover:text-blue-400"
                        }`}
                      >
                        <item.icon className="w-5 h-5 mr-3 text-gray-400" />
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex items-center">
          <div className="hidden md:flex items-center space-x-6">
            <ThemeToggleButton />
            <Link
              to="/"
              className={`flex items-center text-base font-medium transition-colors duration-200 ${
                theme === "light"
                  ? "text-gray-700 hover:text-blue-600"
                  : "text-gray-300 hover:text-blue-400"
              }`}
            >
              <LogOut className="w-5 h-5 mr-2" /> Sign Out
            </Link>
          </div>
          <div className="md:hidden ml-4">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div
          className={`md:hidden ${
            theme === "light"
              ? "bg-white border-t border-gray-200"
              : "bg-gray-800 border-t border-gray-700"
          }`}
        >
          <div className="px-2 pt-2 pb-3 space-y-1">
            {menuItems.map((menu) => (
              <div key={menu.title}>
                <button
                  onClick={() => toggleMobileDropdown(menu.title)}
                  className={`flex items-center justify-between w-full px-3 py-2 text-base font-medium rounded-md ${
                    theme === "light"
                      ? "text-gray-700 hover:bg-blue-50"
                      : "text-gray-300 hover:bg-gray-700"
                  }`}
                >
                  <div className="flex items-center">
                    <menu.icon className="w-5 h-5 mr-3" />
                    {menu.title}
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 transition-transform duration-200 ${
                      mobileDropdown === menu.title ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {mobileDropdown === menu.title && (
                  <div className="mt-2 pl-6 space-y-1">
                    {menu.items.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={`flex items-center w-full px-3 py-2 text-base rounded-md ${
                          theme === "light"
                            ? "text-gray-700 hover:bg-blue-50"
                            : "text-gray-300 hover:bg-gray-700"
                        }`}
                      >
                        <item.icon className="w-5 h-5 mr-3 text-gray-400" />
                        {item.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div
              className={`border-t pt-4 mt-4 ${
                theme === "light" ? "border-gray-200" : "border-gray-700"
              }`}
            >
              <div className="px-2 space-y-2">
                <div className="flex items-center justify-between rounded-md px-3 py-2">
                  <span
                    className={`font-medium ${
                      theme === "light" ? "text-gray-700" : "text-gray-300"
                    }`}
                  >
                    Theme
                  </span>
                  <ThemeToggleButton />
                </div>
                <Link
                  to="/"
                  className={`flex items-center px-3 py-2 text-base font-medium rounded-md ${
                    theme === "light"
                      ? "text-gray-700 hover:bg-blue-50"
                      : "text-gray-300 hover:bg-gray-700"
                  }`}
                >
                  <LogOut className="w-5 h-5 mr-3" /> Sign Out
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default AdminNavbar;
