import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAllStudents,
  deleteStudentByUsername,
} from "../Services/LoginService";
import { getAllLostItems, getAllFoundItems } from "../Services/ItemService";
import { User, Search, ArchiveRestore, X, AlertTriangle } from "lucide-react";
import { ThemeContext } from "../Context/ThemeContext";
import ReturnButton from "./Buttons/ReturnButton";
import ReturnHome from "./Buttons/ReturnHome";

const DeleteStudentList = () => {
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);
  const [students, setStudents] = useState([]);
  const [allItems, setAllItems] = useState({ lost: [], found: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [studentToDelete, setStudentToDelete] = useState(null);
  const [studentToView, setStudentToView] = useState(null);
  const [studentStats, setStudentStats] = useState({ lost: 0, found: 0 });

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        const [studentsRes, lostItemsRes, foundItemsRes] = await Promise.all([
          getAllStudents(),
          getAllLostItems(),
          getAllFoundItems(),
        ]);
        setStudents(studentsRes.data);
        setAllItems({ lost: lostItemsRes.data, found: foundItemsRes.data });
      } catch (err) {
        setError("Failed to fetch data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, []);

  const handleViewDetails = (student) => {
    const lostCount = allItems.lost.filter(
      (item) => item.username === student.username
    ).length;
    const foundCount = allItems.found.filter(
      (item) => item.username === student.username
    ).length;
    setStudentStats({ lost: lostCount, found: foundCount });
    setStudentToView(student);
  };

  const handleDelete = async () => {
    if (!studentToDelete) return;
    try {
      await deleteStudentByUsername(studentToDelete.username);
      setStudents(
        students.filter((s) => s.username !== studentToDelete.username)
      );
      setStudentToDelete(null);
    } catch (err) {
      alert("Failed to delete student");
      console.error(err);
    }
  };

  if (loading)
    return (
      <div
        className={`h-full flex justify-center items-center ${
          theme === "light"
            ? "bg-gray-50 text-gray-600"
            : "bg-gray-900 text-gray-300"
        }`}
      >
        <p className="text-lg font-medium">Loading...</p>
      </div>
    );

  if (error)
    return (
      <div
        className={`h-full flex justify-center items-center ${
          theme === "light"
            ? "bg-gray-50 text-red-600"
            : "bg-gray-900 text-red-400"
        }`}
      >
        <p className="text-lg font-medium">{error}</p>
      </div>
    );

  return (
    <div
      className={`h-full w-full overflow-y-auto ${
        theme === "light" ? "bg-gray-50" : "bg-gray-900"
      }`}
    >
      <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div
          className={`p-6 shadow-xl rounded-xl ${
            theme === "light" ? "bg-white" : "bg-gray-800 text-white"
          }`}
        >
          <div className="mb-4">
            <ReturnHome />
          </div>

          <h2
            className={`text-3xl font-extrabold mb-6 text-center ${
              theme === "light" ? "text-gray-800" : "text-white"
            }`}
          >
            Student Management
          </h2>

          <div className="overflow-x-auto">
            <table
              className={`min-w-full border divide-y ${
                theme === "light"
                  ? "divide-gray-200 border-gray-200"
                  : "divide-gray-700 border-gray-700"
              }`}
            >
              <thead
                className={theme === "light" ? "bg-gray-50" : "bg-gray-700"}
              >
                <tr>
                  <th
                    className={`px-6 py-3 text-left text-sm font-semibold ${
                      theme === "light" ? "text-gray-700" : "text-gray-300"
                    }`}
                  >
                    Username
                  </th>
                  <th
                    className={`px-6 py-3 text-left text-sm font-semibold ${
                      theme === "light" ? "text-gray-700" : "text-gray-300"
                    }`}
                  >
                    Name
                  </th>
                  <th
                    className={`px-6 py-3 text-left text-sm font-semibold ${
                      theme === "light" ? "text-gray-700" : "text-gray-300"
                    }`}
                  >
                    Email
                  </th>
                  <th
                    className={`px-6 py-3 text-left text-sm font-semibold ${
                      theme === "light" ? "text-gray-700" : "text-gray-300"
                    }`}
                  >
                    Role
                  </th>
                  <th
                    className={`px-6 py-3 text-center text-sm font-semibold ${
                      theme === "light" ? "text-gray-700" : "text-gray-300"
                    }`}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody
                className={
                  theme === "light"
                    ? "bg-white divide-y divide-gray-200"
                    : "bg-gray-800 divide-y divide-gray-700"
                }
              >
                {students.length > 0 ? (
                  students.map((student) => (
                    <tr
                      key={student.username}
                      className={`transition duration-150 cursor-pointer ${
                        theme === "light"
                          ? "hover:bg-gray-50"
                          : "hover:bg-gray-700"
                      }`}
                      onClick={() => handleViewDetails(student)}
                    >
                      <td className="px-6 py-4">{student.username}</td>
                      <td className="px-6 py-4">{student.personName}</td>
                      <td className="px-6 py-4">{student.email}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            student.role === "Admin"
                              ? theme === "light"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-blue-900 text-blue-200"
                              : theme === "light"
                              ? "bg-green-100 text-green-800"
                              : "bg-green-900 text-green-200"
                          }`}
                        >
                          {student.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setStudentToDelete(student);
                          }}
                          className={`px-4 py-2 rounded shadow-sm transition duration-200 cursor-pointer ${
                            theme === "light"
                              ? "bg-red-500 hover:bg-red-600 text-white"
                              : "bg-red-600 hover:bg-red-700 text-white"
                          }`}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-6 text-gray-500">
                      No students found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Student Details Modal */}
      {studentToView && (
        <div
          className={`fixed inset-0 backdrop-blur-md flex items-center justify-center z-50 p-4 transition-opacity duration-300  ${
            theme === "light" ? " bg-black/50" : " bg-black/10"
          }`}
        >
          <div
            className={`${
              theme === "light" ? "bg-white" : "bg-gray-800 text-white"
            } rounded-xl shadow-2xl w-full max-w-md animate-fade-in-up`}
          >
            <div className="p-6 relative">
              <button
                onClick={() => setStudentToView(null)}
                className={`absolute top-4 right-4 cursor-pointer ${
                  theme === "light"
                    ? "text-gray-400 hover:text-red-500"
                    : "text-gray-300 hover:text-red-500"
                }`}
              >
                <X size={24} />
              </button>
              <div className="flex items-center gap-4 mb-6">
                <div
                  className={`${
                    theme === "light" ? "bg-blue-100" : "bg-blue-900"
                  } p-3 rounded-full`}
                >
                  <User className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <h3
                    className={`${
                      theme === "light"
                        ? "text-2xl font-bold text-gray-800"
                        : "text-2xl font-bold text-white"
                    }`}
                  >
                    {studentToView.personName}
                  </h3>
                  <p
                    className={`${
                      theme === "light"
                        ? "text-sm text-gray-500"
                        : "text-sm text-gray-300"
                    }`}
                  >
                    {studentToView.email}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div
                  className={`${
                    theme === "light" ? "bg-red-50" : "bg-red-900/10"
                  } p-4 rounded-lg text-center`}
                >
                  <Search className="h-6 w-6 text-red-600 mx-auto mb-2" />
                  <p
                    className={`${
                      theme === "light"
                        ? "text-sm text-red-800 font-semibold"
                        : "text-sm text-red-200 font-semibold"
                    }`}
                  >
                    Items Lost
                  </p>
                  <p
                    className={`${
                      theme === "light"
                        ? "text-4xl font-bold text-red-900"
                        : "text-4xl font-bold text-red-200"
                    }`}
                  >
                    {studentStats.lost}
                  </p>
                </div>
                <div
                  className={`${
                    theme === "light" ? "bg-green-50" : "bg-green-900/10"
                  } p-4 rounded-lg text-center`}
                >
                  <ArchiveRestore className="h-6 w-6 text-green-600 mx-auto mb-2" />
                  <p
                    className={`${
                      theme === "light"
                        ? "text-sm text-green-800 font-semibold"
                        : "text-sm text-green-200 font-semibold"
                    }`}
                  >
                    Items Found
                  </p>
                  <p
                    className={`${
                      theme === "light"
                        ? "text-4xl font-bold text-green-900"
                        : "text-4xl font-bold text-green-200"
                    }`}
                  >
                    {studentStats.found}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {studentToDelete && (
        <div
          className={`fixed inset-0 backdrop-blur-md flex items-center justify-center z-50 ${
            theme === "light"
              ? "bg-black/50 bg-opacity-40"
              : "bg-black/10 bg-opacity-70"
          }`}
        >
          <div
            className={`${
              theme === "light"
                ? "bg-white text-gray-800"
                : "bg-gray-800 text-white"
            } rounded-xl shadow-lg p-6 max-w-sm w-full text-center`}
          >
            <div
              className={`${
                theme === "light" ? "bg-red-100" : "bg-red-900/10"
              } mx-auto rounded-full h-12 w-12 flex items-center justify-center`}
            >
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <h3
              className={`${
                theme === "light"
                  ? "text-xl font-bold my-4 text-gray-800"
                  : "text-xl font-bold my-4 text-white"
              }`}
            >
              Delete Student?
            </h3>
            <p
              className={`${
                theme === "light" ? "mb-6 text-gray-600" : "mb-6 text-gray-300"
              }`}
            >
              Are you sure you want to delete{" "}
              <strong>{studentToDelete.username}</strong>? This action cannot be
              undone.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleDelete}
                className={`px-6 py-2 rounded-lg transition duration-200 cursor-pointer ${
                  theme === "light"
                    ? "bg-red-600 hover:bg-red-700 text-white"
                    : "bg-red-600 hover:bg-red-700 text-white"
                }`}
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setStudentToDelete(null)}
                className={`px-6 py-2 rounded-lg transition duration-200 cursor-pointer ${
                  theme === "light"
                    ? "bg-gray-200 hover:bg-gray-300 text-gray-800"
                    : "bg-gray-700 hover:bg-gray-600 text-gray-200"
                }`}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeleteStudentList;
