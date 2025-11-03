import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getLostItemById,
  deleteLostItemById,
  foundItemSubmission,
} from "../Services/ItemService";
import { getUserDetails } from "../Services/LoginService";
import { CheckCircle, ArrowLeft } from "lucide-react";
import ReturnButton from "./Buttons/ReturnButton";

const MarkAsFound = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lostItem, setLostItem] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [foundDate, setFoundDate] = useState("");

  useEffect(() => {
    Promise.all([getUserDetails(), getLostItemById(id)])
      .then(([userRes, itemRes]) => {
        setUser(userRes.data);
        setLostItem(itemRes.data);
      })
      .catch(() => alert("Failed to load item details"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleMarkAsFound = async () => {
    // ... (your existing logic is fine)
    if (!lostItem || !user) return;
    if (!foundDate) {
      alert("Please select a found date before confirming.");
      return;
    }
    if (new Date(foundDate) < new Date(lostItem.lostDate)) {
      alert("Found date cannot be earlier than the lost date.");
      return;
    }
    setIsSubmitting(true);
    const foundItem = {
      ...lostItem,
      username: user.username,
      userEmail: user.email,
      foundDate: foundDate,
    };
    try {
      await foundItemSubmission(foundItem);
      await deleteLostItemById(lostItem.lostItemId);
      alert("Item marked as found successfully!");
      navigate("/LostReport");
    } catch (error) {
      console.error(error);
      alert("Operation failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-400 font-medium">
        Loading item details...
      </div>
    );
  }

  if (!lostItem) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50 dark:bg-gray-900 text-red-600 dark:text-red-500 font-medium">
        Item not found.
      </div>
    );
  }

  return (
    <div className="h-full bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 overflow-y-auto flex items-center justify-center">
      <div className="max-w-2xl w-full py-4">
        <div className="mb-4">
          <ReturnButton />
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl overflow-hidden">
          <div className="p-8 text-center">
            <CheckCircle className="h-12 w-12 text-green-500 dark:text-green-400 mx-auto bg-green-100 dark:bg-green-900/50 p-2 rounded-full mb-4" />
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              Confirm Item Found
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Choose the date when this item was found and confirm the update.
            </p>
          </div>

          <div className="p-8 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <img
                src={lostItem.imageUrl}
                alt={lostItem.itemName}
                className="w-40 h-40 object-cover rounded-lg shadow-md border dark:border-gray-700"
              />
              {/* This text was likely invisible, added dark:text-gray-300 */}
              <div className="space-y-2 text-gray-700 dark:text-gray-300 text-sm w-full">
                <p>
                  <strong>Item Name:</strong> {lostItem.itemName}
                </p>
                <p>
                  <strong>Category:</strong> {lostItem.category}
                </p>
                <p>
                  <strong>Location Lost:</strong> {lostItem.location}
                </p>
                <p>
                  <strong>Lost Date:</strong> {lostItem.lostDate}
                </p>

                <div className="mt-3 w-full md:w-2/3">
                  <label className="font-semibold text-gray-800 dark:text-gray-100 block mb-1">
                    Found Date <span className="text-red-500">*</span>
                  </label>
                  <div
                    className="relative w-full cursor-pointer"
                    onClick={() =>
                      document.getElementById("foundDateInput").showPicker?.()
                    }
                  >
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg
                        className="h-5 w-5 text-gray-400 dark:text-gray-500"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <input
                      id="foundDateInput"
                      type="date"
                      value={foundDate}
                      onChange={(e) => setFoundDate(e.target.value)}
                      min={lostItem.lostDate}
                      max={new Date().toISOString().slice(0, 10)}
                      required
                      className="block w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-900/50 px-8 py-4 flex justify-end">
            <button
              onClick={handleMarkAsFound}
              disabled={isSubmitting}
              className="bg-green-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-green-700 disabled:opacity-60 transition-colors cursor-pointer"
            >
              {isSubmitting ? "Confirming..." : "Confirm & Mark Found"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarkAsFound;
