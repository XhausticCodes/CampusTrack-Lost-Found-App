import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  getLostItemsByUser,
  getFoundItemsByUser,
} from "../../Services/ItemService";
import { Archive, ArchiveRestore } from "lucide-react";
import { ThemeContext } from "../../Context/ThemeContext";

const StudentMenuGoodUI = () => {
  const navigate = useNavigate();
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

  return (
    <div className="h-full">
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
