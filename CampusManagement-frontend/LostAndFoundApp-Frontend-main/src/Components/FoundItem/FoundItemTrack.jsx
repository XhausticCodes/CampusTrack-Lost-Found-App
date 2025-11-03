import React, { useEffect, useState, useContext, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  getFoundItemsByUser,
  getMatchingLostItems,
  searchLostItems,
} from "../../Services/ItemService";
import {
  Search,
  ChevronDown,
  Loader2,
  ArrowLeft,
  Eye,
  X,
  BookOpen,
  Clock,
  MapPin,
  Tag,
  Users,
} from "lucide-react";
import { ThemeContext } from "../../Context/ThemeContext";
import ReturnButton from "../Buttons/ReturnButton";

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
};

const LostItemTableRow = ({ item, onConnect, theme }) => (
  <tr
    className={`border-b transition-colors hover:bg-opacity-50 ${
      theme === "light"
        ? "border-gray-200 hover:bg-gray-50"
        : "border-gray-600 hover:bg-gray-700"
    }`}
  >
    <td className="py-3 px-4">
      <img
        src={
          item.imageUrl || "https://placehold.co/50x50/059669/ffffff?text=IMG"
        }
        alt={item.itemName}
        className="w-12 h-12 object-cover rounded-md flex-shrink-0 border border-red-400"
      />
    </td>
    <td className="py-3 px-4">
      <p
        className={`${
          theme === "light" ? "text-gray-900" : "text-white"
        } font-medium`}
      >
        {item.itemName}
      </p>
    </td>
    <td className="py-3 px-4">
      <p className={`${theme === "light" ? "text-gray-700" : "text-gray-300"}`}>
        {item.brand || "N/A"}
      </p>
    </td>
    <td className="py-3 px-4">
      <p className={`${theme === "light" ? "text-gray-700" : "text-gray-300"}`}>
        {item.color || "N/A"}
      </p>
    </td>
    <td className="py-3 px-4">
      <p className={`${theme === "light" ? "text-gray-700" : "text-gray-300"}`}>
        {item.category || "N/A"}
      </p>
    </td>
    <td className="py-3 px-4">
      <div
        className={`flex items-center gap-1 ${
          theme === "light" ? "text-gray-700" : "text-gray-300"
        }`}
      >
        <MapPin size={16} className="text-red-500" />
        {item.location}
      </div>
    </td>
    <td className="py-3 px-4">
      <div
        className={`flex items-center gap-1 ${
          theme === "light" ? "text-gray-700" : "text-gray-300"
        }`}
      >
        <Clock size={16} className="text-green-500" />
        {item.lostDate || "N/A"}
      </div>
    </td>
    <td className="py-3 px-4">
      <p className={`${theme === "light" ? "text-gray-700" : "text-gray-300"}`}>
        {item.reportedBy || item.username || "N/A"}
      </p>
    </td>
    <td className="py-3 px-4">
      <button
        onClick={() => onConnect && onConnect(item)}
        className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all shadow-md transform hover:scale-105 ${
          theme === "light"
            ? "bg-green-100 text-green-700 border border-green-200 hover:bg-green-200"
            : "bg-green-800/20 text-green-400 border border-green-600/50 hover:bg-green-800/30"
        }`}
      >
        <Users size={16} />
        Connect
      </button>
    </td>
  </tr>
);

const FoundItemRow = ({ item, onViewDetails, onConnect, theme }) => {
  const [matches, setMatches] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  const handleRowClick = async (e) => {
    if (!hasLoaded) {
      setIsLoading(true);
      try {
        const res = await getMatchingLostItems(item.foundItemId);
        setMatches(res.data);
        setHasLoaded(true);
      } catch (err) {
        console.error("Failed to get matches:", err);
      } finally {
        setIsLoading(false);
      }
    }
    setIsExpanded(!isExpanded);
    onViewDetails && onViewDetails(item);
  };

  const rowClasses =
    theme === "light"
      ? "bg-white border-gray-200 hover:bg-gray-50"
      : "bg-gray-800 border-gray-700 hover:bg-gray-700";

  return (
    <div
      className={`shadow-md rounded-xl overflow-hidden mb-4 transition-all duration-300 ${
        theme === "light" ? "border border-gray-200" : "border border-gray-700"
      }`}
    >
      <div
        className={`flex items-center p-4 cursor-pointer ${rowClasses}`}
        onClick={handleRowClick}
      >
        <img
          src={
            item.imageUrl || "https://placehold.co/48x48/111827/ffffff?text=FG"
          }
          alt={item.itemName}
          className="w-12 h-12 object-cover rounded-md mr-4 flex-shrink-0 shadow-inner"
        />
        <div className="flex-1 min-w-0 grid grid-cols-2 sm:grid-cols-3 gap-2">
          <div className="col-span-2 sm:col-span-1 truncate">
            <p
              className={`font-bold truncate ${
                theme === "light" ? "text-gray-900" : "text-white"
              }`}
            >
              {item.itemName}
            </p>
            <p
              className={`text-xs ${
                theme === "light" ? "text-gray-500" : "text-gray-400"
              }`}
            >
              {item.category || "Item"}
            </p>
          </div>
          <div className="hidden sm:block truncate">
            <p
              className={`font-medium ${
                theme === "light" ? "text-gray-700" : "text-gray-300"
              }`}
            >
              <MapPin size={14} className="inline mr-1 text-blue-500" />{" "}
              {item.location}
            </p>
            <p
              className={`text-xs ${
                theme === "light" ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Location
            </p>
          </div>
          <div className="hidden sm:block truncate">
            <p
              className={`font-medium ${
                theme === "light" ? "text-gray-700" : "text-gray-300"
              }`}
            >
              <Clock size={14} className="inline mr-1 text-green-500" />{" "}
              {item.foundDate}
            </p>
            <p
              className={`text-xs ${
                theme === "light" ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Date Found
            </p>
          </div>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <ChevronDown
            size={20}
            className={`${
              theme === "light" ? "text-gray-500" : "text-gray-400"
            } transition-transform ${isExpanded ? "rotate-180" : ""}`}
          />
          {isLoading && <Loader2 className="animate-spin" size={20} />}
        </div>
      </div>
      {isExpanded && (
        <div
          className={`max-h-72 overflow-y-auto p-4 transition-max-height duration-500 ease-in-out ${
            theme === "light"
              ? "bg-blue-50 border-t border-blue-100"
              : "bg-gray-700 border-t border-gray-600"
          }`}
        >
          {matches.length > 0 ? (
            <div>
              <h4
                className={`text-base font-bold mb-3 ${
                  theme === "light" ? "text-gray-700" : "text-white"
                } flex items-center gap-1`}
              >
                <Tag size={16} className="text-red-500" /> {matches.length}{" "}
                Potential Matches Found
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full table-auto">
                  <thead>
                    <tr
                      className={`${
                        theme === "light"
                          ? "bg-blue-50 text-gray-700"
                          : "bg-gray-600 text-gray-200"
                      }`}
                    >
                      <th className="py-3 px-4 text-left font-semibold">
                        Image
                      </th>
                      <th className="py-3 px-4 text-left font-semibold">
                        Name
                      </th>
                      <th className="py-3 px-4 text-left font-semibold">
                        Brand
                      </th>
                      <th className="py-3 px-4 text-left font-semibold">
                        Color
                      </th>
                      <th className="py-3 px-4 text-left font-semibold">
                        Category
                      </th>
                      <th className="py-3 px-4 text-left font-semibold">
                        Location
                      </th>
                      <th className="py-3 px-4 text-left font-semibold">
                        Date
                      </th>
                      <th className="py-3 px-4 text-left font-semibold">
                        Reported by
                      </th>
                      <th className="py-3 px-4 text-left font-semibold">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {matches.map((lost) => (
                      <LostItemTableRow
                        key={lost.lostItemId}
                        item={lost}
                        onConnect={onConnect}
                        theme={theme}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <p
              className={`text-center py-2 ${
                theme === "light" ? "text-gray-600" : "text-gray-400"
              }`}
            >
              No potential matches found yet.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

const FoundItemTrack = () => {
  const navigate = useNavigate();
  const [foundItems, setFoundItems] = useState([]);
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { theme } = useContext(ThemeContext);

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  useEffect(() => {
    getFoundItemsByUser()
      .then((res) => {
        setFoundItems(res.data);
        if (res.data.length > 0) setUsername(res.data[0].username);
      })
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, []);

  const handleSearch = useCallback(async (query, user) => {
    if (!query.trim() || !user) return setSearchResults([]);
    setSearchLoading(true);
    try {
      const res = await searchLostItems(query, user);
      setSearchResults(res.data);
    } catch (err) {
      console.error(err);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debouncedSearchQuery && username)
      handleSearch(debouncedSearchQuery, username);
    else setSearchResults([]);
  }, [debouncedSearchQuery, username, handleSearch]);

  const openModal = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleConnect = (item) => {
    console.log("Connecting to user:", item.reportedBy || item.username);
    openModal(item);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };
  const handleClearSearch = () => setSearchQuery("");
  const isSearching = searchQuery.trim() !== "";

  if (isLoading)
    return (
      <div
        className={`flex justify-center items-center h-screen ${
          theme === "light"
            ? "bg-gray-50 text-gray-600"
            : "bg-gray-900 text-gray-200"
        } font-medium`}
      >
        <Loader2 className="animate-spin mr-2" size={24} />
        Loading...
      </div>
    );

  return (
    <div
      className={`h-full p-4 sm:p-6 overflow-y-auto ${
        theme === "light" ? "bg-gray-50" : "bg-gray-900 text-white"
      }`}
    >
      <div className="max-w-6xl mx-auto">
        <div className="mb-4 flex justify-between items-center">
          <ReturnButton />
        </div>
        <div className="text-center mb-8">
          <h2
            className={`text-3xl sm:text-4xl font-extrabold mb-2 ${
              theme === "light" ? "text-gray-900" : "text-white"
            }`}
          >
            Found Item Tracker
          </h2>
          <p
            className={`${
              theme === "light" ? "text-gray-500" : "text-gray-400"
            } max-w-2xl mx-auto text-lg`}
          >
            View your found items and check for potential matches.
          </p>
        </div>
        <div className="mb-12 relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search lost items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-12 pr-12 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-lg transition-shadow text-base ${
              theme === "light"
                ? "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                : "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
            }`}
          />
          {searchLoading && (
            <Loader2
              className="animate-spin text-blue-500 absolute right-12 top-1/2 transform -translate-y-1/2"
              size={20}
            />
          )}
          {searchQuery && (
            <button
              onClick={handleClearSearch}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 p-1 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          )}
        </div>
        {!isSearching ? (
          <>
            <h3
              className={`text-2xl font-bold mb-6 ${
                theme === "light" ? "text-gray-800" : "text-white"
              } flex items-center gap-2`}
            >
              <BookOpen size={24} className="text-blue-500" /> Your Reported
              Found Items ({foundItems.length})
            </h3>
            {foundItems.length > 0 ? (
              <div className="space-y-4">
                {foundItems.map((item) => (
                  <FoundItemRow
                    key={item.foundItemId}
                    item={item}
                    onViewDetails={openModal}
                    onConnect={handleConnect}
                    theme={theme}
                  />
                ))}
              </div>
            ) : (
              <p className="text-center py-16">No found items reported yet.</p>
            )}
          </>
        ) : (
          <>
            <h3
              className={`text-2xl font-bold mb-6 ${
                theme === "light" ? "text-gray-800" : "text-white"
              }`}
            >
              Search Results ({searchResults.length})
            </h3>
            {searchLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="animate-spin mr-2" size={24} /> Searching...
              </div>
            ) : searchResults.length > 0 ? (
              <div className="max-h-[70vh] overflow-y-auto">
                <div className="overflow-x-auto">
                  <table className="w-full table-auto">
                    <thead>
                      <tr
                        className={`${
                          theme === "light"
                            ? "bg-blue-50 text-gray-700"
                            : "bg-gray-600 text-gray-200"
                        }`}
                      >
                        <th className="py-3 px-4 text-left font-semibold">
                          Image
                        </th>
                        <th className="py-3 px-4 text-left font-semibold">
                          Name
                        </th>
                        <th className="py-3 px-4 text-left font-semibold">
                          Brand
                        </th>
                        <th className="py-3 px-4 text-left font-semibold">
                          Color
                        </th>
                        <th className="py-3 px-4 text-left font-semibold">
                          Category
                        </th>
                        <th className="py-3 px-4 text-left font-semibold">
                          Location
                        </th>
                        <th className="py-3 px-4 text-left font-semibold">
                          Date
                        </th>
                        <th className="py-3 px-4 text-left font-semibold">
                          Reported by
                        </th>
                        <th className="py-3 px-4 text-left font-semibold">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {searchResults.map((item) => (
                        <LostItemTableRow
                          key={item.lostItemId}
                          item={item}
                          onConnect={handleConnect}
                          theme={theme}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <p className="text-center py-12">
                No items found matching "{searchQuery}".
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default FoundItemTrack;
