import React, { useState, useEffect, useRef, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  getLostItemsByUser,
  getFoundItemsByUser,
} from "../../Services/ItemService";
import {
  ChevronDown,
  Package,
  CheckCircle,
  MapPin,
  FileText,
  User,
  LogOut,
  Menu,
  X,
  Archive,
  ArchiveRestore,
  Search,
  MessagesSquare,
  MessageSquare,
} from "lucide-react";
import ThemeToggleButton from "../Buttons/ThemeToggleButton";
import { ThemeContext } from "../../Context/ThemeContext";

const StudentMenuGoodUI = () => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const timeoutRef = useRef(null);
  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mobileDropdown, setMobileDropdown] = useState(null);

  const [stats, setStats] = useState({
    totalLost: 0,
    totalFound: 0,
  });

  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [lostResponse, foundResponse] = await Promise.all([
          getLostItemsByUser(),
          getFoundItemsByUser(),
        ]);
        setStats({
          totalLost: lostResponse.data.length,
          totalFound: foundResponse.data.length,
        });
      } catch (error) {
        console.error("Failed to fetch student stats:", error);
      }
    };
    fetchStats();
  }, []);

  const menuItems = [
    {
      title: "Items",
      icon: Package,
      items: [
        { name: "Lost Item Registration", href: "/LostSubmit", icon: MapPin },
        {
          name: "Found Item Submission",
          href: "/FoundSubmit",
          icon: CheckCircle,
        },
      ],
    },
    {
      title: "Reports",
      icon: FileText,
      items: [
        { name: "Lost Item Report", href: "/LostReport", icon: FileText },
        { name: "Found Item Report", href: "/FoundReport", icon: FileText },
      ],
    },
    {
      title: "Track",
      icon: Search,
      items: [
        { name: "Lost Item Track", href: "/LostItemTrack", icon: FileText },
        { name: "Found Item Track", href: "/FoundItemTrack", icon: FileText },
      ],
    },
    {
      title: "Chat",
      icon: MessagesSquare,
      items: [{ name: "Open Chat", href: "/chat", icon: MessageSquare }],
    },
    {
      title: "Profile",
      icon: User,
      items: [{ name: "Personal Details", href: "/Personal", icon: User }],
    },
  ];

  const handleMouseEnter = (menuKey) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpenDropdown(menuKey);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setOpenDropdown(null), 200);
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const toggleMobileDropdown = (name) => {
    setMobileDropdown(mobileDropdown === name ? null : name);
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
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
              <Package className="text-blue-600 w-6 h-6" />
            </div>
            <h1
              className={`text-2xl font-semibold ${
                theme === "light" ? "text-gray-900" : "text-white"
              }`}
            >
              Lost & Found
            </h1>
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
                      className={`ml-1 w-5 h-5 text-gray-500 transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                      }`}
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
                    className="flex items-center justify-between w-full px-3 py-2 text-base font-medium text-gray-700 hover:bg-blue-50 rounded-md"
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
                          className="flex items-center w-full px-3 py-2 text-base text-gray-700 hover:bg-blue-50 rounded-md"
                        >
                          <item.icon className="w-5 h-5 mr-3 text-gray-400" />
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div className="border-t pt-4 mt-4 border-gray-200 dark:border-gray-700">
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

      <main className="max-w-7xl mx-auto px-6 py-16">
        <header className="text-center mb-16">
          <h1
            className={`text-5xl font-bold tracking-tight ${
              theme === "light" ? "text-gray-900" : "text-white"
            }`}
          >
            Welcome, Student!
          </h1>
          <p
            className={`${
              theme === "light" ? "text-gray-500" : "text-gray-400"
            } mt-3 text-lg`}
          >
            Here is a summary of your reported items.
          </p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
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
                Your Lost Items
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
                Your Found Items
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

export default StudentMenuGoodUI;
