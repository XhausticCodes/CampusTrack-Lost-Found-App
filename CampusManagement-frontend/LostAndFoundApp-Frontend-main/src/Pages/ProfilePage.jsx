import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { getUserDetails } from "../Services/LoginService";
import {
  getLostItemsByUser,
  getFoundItemsByUser,
} from "../Services/ItemService";
import { ArrowLeft, UserCircle, Search, ArchiveRestore } from "lucide-react";
import { ThemeContext } from "../Context/ThemeContext";
import ReturnButton from "../Components/Buttons/ReturnButton";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [lostCount, setLostCount] = useState(0);
  const [foundCount, setFoundCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    Promise.all([getUserDetails(), getLostItemsByUser(), getFoundItemsByUser()])
      .then(([userRes, lostItemsRes, foundItemsRes]) => {
        setUser(userRes.data);
        setLostCount(lostItemsRes.data.length);
        setFoundCount(foundItemsRes.data.length);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to fetch your details and stats");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div
        className={`flex justify-center items-center h-screen ${
          theme === "light"
            ? "bg-gray-50 text-gray-600"
            : "bg-gray-900 text-gray-200"
        } font-medium`}
      >
        Loading your details...
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`flex justify-center items-center h-screen ${
          theme === "light" ? "bg-gray-50" : "bg-gray-900"
        } text-red-600 font-medium`}
      >
        {error}
      </div>
    );
  }

  return (
    <div
      className={`h-full p-4 sm:p-6 overflow-y-auto ${
        theme === "light" ? "bg-gray-50" : "bg-gray-900 text-white"
      }`}
    >
      <div className="max-w-6xl mx-auto">
        {/* Return Button */}
        <div className="mb-4">
          <ReturnButton />
        </div>

        <div
          className={`shadow-xl rounded-2xl overflow-hidden ${
            theme === "light" ? "bg-white" : "bg-gray-800"
          }`}
        >
          {/* Header */}
          <div
            className={`p-6 sm:p-8 ${
              theme === "light"
                ? "bg-gray-50 border-b border-gray-200"
                : "bg-gray-800 border-b border-gray-700"
            }`}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <UserCircle className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <h2
                    className={`text-2xl font-bold ${
                      theme === "light" ? "text-gray-800" : "text-white"
                    }`}
                  >
                    Personal Details
                  </h2>
                  <p
                    className={`text-sm ${
                      theme === "light" ? "text-gray-500" : "text-gray-400"
                    }`}
                  >
                    Your account information and activity summary.
                  </p>
                </div>
              </div>
              <div className="flex items-center">
              <h2
                    className={`text-4xl font-bold ${
                      theme === "light" ? "text-gray-800" : "text-white"
                    }`}
                  >
                    {user.username}
                  </h2>
              </div>
            </div>
          </div>

          {/* Details Table */}
          <div className="p-6 sm:p-8">
            <h3
              className={`text-lg font-bold mb-4 ${
                theme === "light" ? "text-gray-800" : "text-white"
              }`}
            >
              Account Information
            </h3>
            <table className="min-w-full">
              <tbody className="divide-y divide-gray-200">
                {[
                  { label: "Name", value: user.personName },
                  { label: "Email", value: user.email },
                  { label: "Role", value: user.role },
                ].map((item, index) => (
                  <tr key={index}>
                    <td
                      className={`py-4 pr-4 font-semibold w-1/3 ${
                        theme === "light" ? "text-gray-700" : "text-gray-300"
                      }`}
                    >
                      {item.label}
                    </td>
                    <td
                      className={`py-4 ${
                        theme === "light" ? "text-gray-800" : "text-gray-200"
                      }`}
                    >
                      {item.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Stats Section */}
          <div
            className={`grid grid-cols-1 sm:grid-cols-2 gap-4 p-6 sm:p-8 border-t ${
              theme === "light"
                ? "border-gray-200 bg-gray-50"
                : "border-gray-700 bg-gray-800"
            }`}
          >
            {/* Lost Items Card Button */}
            <button
              onClick={() => navigate("/LostReport")}
              className="w-full text-left transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 rounded-xl"
            >
              <div
                className={`${
                  theme === "light" ? "bg-red-50" : "bg-red-900/20"
                } rounded-xl p-4 flex items-center gap-4 h-full`}
              >
                <div className="bg-red-100 p-3 rounded-full">
                  <Search className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <p
                    className={`${
                      theme === "light"
                        ? "text-sm text-gray-600"
                        : "text-sm text-gray-300"
                    }`}
                  >
                    Items Reported Lost
                  </p>
                  <p
                    className={`text-2xl font-bold ${
                      theme === "light" ? "text-gray-800" : "text-white"
                    }`}
                  >
                    {lostCount}
                  </p>
                </div>
              </div>
            </button>

            {/* Found Items Card Button */}
            <button
              onClick={() => navigate("/FoundReport")}
              className="w-full text-left transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 rounded-xl"
            >
              <div
                className={`${
                  theme === "light" ? "bg-green-50" : "bg-green-900/20"
                } rounded-xl p-4 flex items-center gap-4 h-full`}
              >
                <div className="bg-green-100 p-3 rounded-full">
                  <ArchiveRestore className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p
                    className={`${
                      theme === "light"
                        ? "text-sm text-gray-600"
                        : "text-sm text-gray-300"
                    }`}
                  >
                    Items Reported Found
                  </p>
                  <p
                    className={`text-2xl font-bold ${
                      theme === "light" ? "text-gray-800" : "text-white"
                    }`}
                  >
                    {foundCount}
                  </p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
