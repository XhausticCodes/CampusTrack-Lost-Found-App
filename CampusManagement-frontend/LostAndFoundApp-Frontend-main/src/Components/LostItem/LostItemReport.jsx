import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAllLostItems,
  getLostItemsByUser,
} from "../../Services/ItemService";
import { getUserDetails } from "../../Services/LoginService";
import { Search, ArrowLeft, X, User } from "lucide-react";
import { ThemeContext } from "../../Context/ThemeContext";
import ReturnButton from "../Buttons/ReturnButton";
import ReturnHome from "../Buttons/ReturnHome";

// Compact detail item for grid layout
const DetailItem = ({ label, value }) => (
  <div>
    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
      {label}
    </p>
    <p className="font-medium text-gray-800">{value || "N/A"}</p>
  </div>
);

const LostItemReport = () => {
  const [lostItems, setLostItems] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    getUserDetails()
      .then((res) => setCurrentUser(res.data))
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!currentUser) return;
    const fetchItems =
      currentUser.role === "Admin" ? getAllLostItems : getLostItemsByUser;
    fetchItems()
      .then((res) => setLostItems(res.data))
      .catch(() => console.error("Failed to load items"))
      .finally(() => setLoading(false));
  }, [currentUser]);

  if (loading) {
    return (
      <div
        className={`flex justify-center items-center h-screen ${
          theme === "light"
            ? "bg-gray-50 text-gray-600"
            : "bg-gray-900 text-gray-200"
        } font-medium`}
      >
        Loading report...
      </div>
    );
  }

  return (
    <div
      className={`h-full p-4 sm:p-6 ${
        theme === "light" ? "bg-gray-50" : "bg-gray-900 text-white"
      }`}
    >
      <div className="max-w-7xl mx-auto h-full flex flex-col">
        <div className="mb-4">
          {/* <ReturnButton /> */}
          <ReturnHome />
        </div>
        <div
          className={`shadow-xl rounded-2xl overflow-hidden flex-1 flex flex-col ${
            theme === "light" ? "bg-white" : "bg-gray-800"
          }`}
        >
          <div
            className={`p-4 sm:p-6 border-b flex-shrink-0 ${
              theme === "light" ? "border-gray-200" : "border-gray-700"
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="bg-red-100 p-3 rounded-full">
                <Search className="h-8 w-8 text-red-600" />
              </div>
              <div>
                <h2
                  className={`text-xl font-bold ${
                    theme === "light" ? "text-gray-800" : "text-white"
                  }`}
                >
                  Lost Item Report
                </h2>
                <p
                  className={`text-sm ${
                    theme === "light" ? "text-gray-500" : "text-gray-400"
                  }`}
                >
                  All items currently reported as lost.
                </p>
              </div>
            </div>
          </div>

          <div className="overflow-auto flex-1">
            <table
              className={`min-w-full divide-y ${
                theme === "light" ? "divide-gray-200" : "divide-gray-700"
              }`}
            >
              <thead
                className={theme === "light" ? "bg-gray-50" : "bg-gray-800"}
              >
                <tr>
                  {[
                    "Item Name",
                    "Category",
                    "Location Lost",
                    "Lost Date",
                    "Reported By",
                  ]
                    .concat(currentUser?.role === "Student" ? ["Action"] : [])
                    .map((header) => (
                      <th
                        key={header}
                        className={`px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider ${
                          theme === "light" ? "text-gray-600" : "text-gray-300"
                        }`}
                      >
                        {header}
                      </th>
                    ))}
                </tr>
              </thead>
              <tbody
                className={
                  theme === "light"
                    ? "bg-white divide-y divide-gray-200"
                    : "bg-gray-800 divide-y divide-gray-700"
                }
              >
                {lostItems.length > 0 ? (
                  lostItems.map((item) => (
                    <tr
                      key={item.lostItemId}
                      className={`${
                        theme === "light"
                          ? "hover:bg-gray-50"
                          : "hover:bg-gray-700"
                      } cursor-pointer transition-colors`}
                      onClick={() => setSelectedItem(item)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                        {item.itemName}
                      </td>
                      <td
                        className={`px-6 py-4 whitespace-nowrap text-sm ${
                          theme === "light" ? "text-gray-700" : "text-gray-200"
                        }`}
                      >
                        {item.category}
                      </td>
                      <td
                        className={`px-6 py-4 whitespace-nowrap text-sm ${
                          theme === "light" ? "text-gray-700" : "text-gray-200"
                        }`}
                      >
                        {item.location}
                      </td>
                      <td
                        className={`px-6 py-4 whitespace-nowrap text-sm ${
                          theme === "light" ? "text-gray-700" : "text-gray-200"
                        }`}
                      >
                        {item.lostDate}
                      </td>
                      <td
                        className={`px-6 py-4 whitespace-nowrap text-sm ${
                          theme === "light" ? "text-gray-700" : "text-gray-200"
                        }`}
                      >
                        {item.username}
                      </td>

                      {currentUser?.role === "Student" && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {item.username === currentUser.username && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/mark-found/${item.lostItemId}`);
                              }}
                              className="bg-green-600 text-white py-1.5 px-3 rounded-md hover:bg-green-700 transition font-semibold text-xs"
                            >
                              Mark as Found
                            </button>
                          )}
                        </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={currentUser?.role === "Student" ? "6" : "5"}
                      className="px-6 py-10 text-center text-gray-500"
                    >
                      No lost items reported.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {selectedItem && (
        <div
          className={`fixed inset-0 backdrop-blur-xl flex items-center justify-center z-50 p-4 transition-opacity duration-300 ${
            theme === "light" ? " bg-black/50" : " bg-black/10"
          }`}
        >
          <div
            className="bg-white rounded-lg shadow-xl w-full max-w-3xl flex flex-col sm:flex-row animate-scale-in"
            onClick={(e) => e.stopPropagation()} // prevent clicks inside from closing
          >
            <div className="w-full sm:w-2/5 bg-gray-100 rounded-t-lg sm:rounded-l-lg sm:rounded-t-none flex items-center justify-center p-6">
              <img
                src={
                  selectedItem.imageUrl ||
                  "https://placehold.co/400x400/e2e8f0/cbd5e0?text=Image"
                }
                alt={selectedItem.itemName}
                className="max-h-80 w-auto object-contain rounded-md"
              />
            </div>

            <div className="w-full sm:w-3/5 p-6 flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-xs font-bold bg-red-100 text-red-800 px-3 py-1 rounded-full uppercase tracking-wider">
                    Lost Item
                  </span>
                  <h2 className="text-3xl font-bold text-gray-900 mt-2">
                    {selectedItem.itemName}
                  </h2>
                </div>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="text-gray-400 hover:text-red-500 cursor-pointer"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 my-4 flex-grow">
                <DetailItem label="Category" value={selectedItem.category} />
                <DetailItem label="Brand" value={selectedItem.brand} />
                <DetailItem label="Color" value={selectedItem.color} />
                <DetailItem
                  label="Location Lost"
                  value={selectedItem.location}
                />
                <DetailItem label="Date Lost" value={selectedItem.lostDate} />
              </div>

              <div className="border-t border-gray-200 pt-4 mt-auto">
                <div className="flex items-center gap-3">
                  <User size={24} className="text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-500">Reported By</p>
                    <p className="font-semibold text-gray-800">
                      {selectedItem.username}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Floating Track Button - Only show for Students */}
      {currentUser?.role !== "Admin" && (
        <button
          onClick={() => navigate("/LostItemTrack")}
          className="fixed bottom-8 right-8 bg-red-600 text-white px-5 py-3 rounded-full shadow-lg transform transition-all duration-300 hover:scale-110 hover:shadow-2xl flex items-center gap-2 cursor-pointer"
        >
          <Search className="h-5 w-5" />
          Track Your Lost Item
        </button>
      )}
    </div>
  );
};

export default LostItemReport;
