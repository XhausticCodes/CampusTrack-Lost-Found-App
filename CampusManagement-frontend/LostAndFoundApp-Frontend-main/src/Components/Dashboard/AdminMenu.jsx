import React, { useState, useEffect, useRef, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAllStudents } from "../../Services/LoginService";
import { getAllLostItems, getAllFoundItems } from "../../Services/ItemService";
import {
  ChevronDown,
  Users,
  Archive,
  ArchiveRestore,
  LogOut,
} from "lucide-react";
import ThemeToggleButton from "../Buttons/ThemeToggleButton";
import { ThemeContext } from "../../Context/ThemeContext";

const AdminDashboard = () => {
  const { theme } = useContext(ThemeContext);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalLost: 0,
    totalFound: 0,
  });

  const navigate = useNavigate();
  const timeoutRef = useRef(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersResponse, lostResponse, foundResponse] = await Promise.all([
          getAllStudents(),
          getAllLostItems(),
          getAllFoundItems(),
        ]);
        setStats({
          totalUsers: usersResponse.data.length,
          totalLost: lostResponse.data.length,
          totalFound: foundResponse.data.length,
        });
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      }
    };
    fetchStats();
  }, []);

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

  return (
    <div
      className={`min-h-screen font-sans antialiased ${
        theme === "light" ? "bg-white" : "bg-gray-900 text-white"
      }`}
    >
      <nav
        className={`sticky top-0 z-50 shadow-md border-b ${
          theme === "light"
            ? "bg-white border-gray-200"
            : "bg-gray-800 border-gray-700"
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-10">
            <div className="flex items-center space-x-3">
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
            </div>

            {["Reports", "Students"].map((menu) => {
              const menuKey = menu.toLowerCase();
              const isOpen = openDropdown === menuKey;

              return (
                <div
                  key={menu}
                  className="relative"
                  onMouseEnter={() => handleMouseEnter(menuKey)}
                  onMouseLeave={handleMouseLeave}
                >
                  <button
                    className={`flex items-center font-medium text-base transition-colors duration-200 ${
                      theme === "light"
                        ? "text-gray-700 hover:text-blue-600 focus:text-blue-600"
                        : "text-gray-300 hover:text-blue-400 focus:text-blue-400"
                    }`}
                  >
                    {menu}
                    <ChevronDown
                      className={`ml-1 w-5 h-5 transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                      } ${
                        theme === "light" ? "text-gray-500" : "text-gray-400"
                      }`}
                    />
                  </button>

                  <div
                    className={`
                      absolute top-full left-0 mt-2 w-48 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50 overflow-hidden
                      transition-all ease-out duration-200
                      ${theme === "light" ? "bg-white" : "bg-gray-800"}
                      ${
                        isOpen
                          ? "opacity-100 scale-100 translate-y-0"
                          : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                      }
                    `}
                  >
                    <div className="py-1">
                      {menu === "Reports" && (
                        <>
                          <Link
                            to="/LostReport"
                            className={`block px-4 py-2 text-base transition-all duration-200 ${
                              theme === "light"
                                ? "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                                : "text-gray-300 hover:bg-gray-700 hover:text-blue-400"
                            }`}
                          >
                            Lost Items
                          </Link>
                          <Link
                            to="/FoundReport"
                            className={`block px-4 py-2 text-base transition-all duration-200 ${
                              theme === "light"
                                ? "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                                : "text-gray-300 hover:bg-gray-700 hover:text-blue-400"
                            }`}
                          >
                            Found Items
                          </Link>
                        </>
                      )}
                      {menu === "Students" && (
                        <Link
                          to="/DeleteStudentList"
                          className={`block px-4 py-2 text-base transition-all duration-200 ${
                            theme === "light"
                              ? "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                              : "text-gray-300 hover:bg-gray-700 hover:text-blue-400"
                          }`}
                        >
                          View Students
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center space-x-6">
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
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-16">
        <header className="text-center mb-16">
          <h1
            className={`text-5xl font-bold tracking-tight ${
              theme === "light" ? "text-gray-900" : "text-white"
            }`}
          >
            Lost & Found Dashboard
          </h1>
          <p
            className={`mt-3 text-lg ${
              theme === "light" ? "text-gray-500" : "text-gray-400"
            }`}
          >
            Manage reports, students, and more
          </p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div
            className={`p-8 rounded-2xl shadow-sm border hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer ${
              theme === "light"
                ? "bg-white border-gray-100"
                : "bg-gray-800 border-gray-700"
            }`}
            onClick={() => navigate("/DeleteStudentList")}
          >
            <div className="flex items-center justify-between mb-4">
              <p
                className={`text-base font-medium ${
                  theme === "light" ? "text-gray-600" : "text-gray-400"
                }`}
              >
                Total Users
              </p>
              <Users className="w-6 h-6 text-blue-500" />
            </div>
            <p
              className={`text-5xl font-bold ${
                theme === "light" ? "text-gray-900" : "text-white"
              }`}
            >
              {stats.totalUsers}
            </p>
          </div>

          <div
            className={`p-8 rounded-2xl shadow-sm border hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer ${
              theme === "light"
                ? "bg-white border-gray-100"
                : "bg-gray-800 border-gray-700"
            }`}
            onClick={() => navigate("/LostReport")}
          >
            <div className="flex items-center justify-between mb-4">
              <p
                className={`text-base font-medium ${
                  theme === "light" ? "text-gray-600" : "text-gray-400"
                }`}
              >
                Lost Items
              </p>
              <Archive className="w-6 h-6 text-red-500" />
            </div>
            <p
              className={`text-5xl font-bold ${
                theme === "light" ? "text-gray-900" : "text-white"
              }`}
            >
              {stats.totalLost}
            </p>
          </div>

          <div
            className={`p-8 rounded-2xl shadow-sm border hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer ${
              theme === "light"
                ? "bg-white border-gray-100"
                : "bg-gray-800 border-gray-700"
            }`}
            onClick={() => navigate("/FoundReport")}
          >
            <div className="flex items-center justify-between mb-4">
              <p
                className={`text-base font-medium ${
                  theme === "light" ? "text-gray-600" : "text-gray-400"
                }`}
              >
                Found Items
              </p>
              <ArchiveRestore className="w-6 h-6 text-green-500" />
            </div>
            <p
              className={`text-5xl font-bold ${
                theme === "light" ? "text-gray-900" : "text-white"
              }`}
            >
              {stats.totalFound}
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;
