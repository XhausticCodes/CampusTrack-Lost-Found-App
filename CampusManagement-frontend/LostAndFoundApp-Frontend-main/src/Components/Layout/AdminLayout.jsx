import React from "react";
import { Outlet, Link } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div>
      {/* 
        TODO: Move the navbar from your AdminMenu.jsx component here.
        It should be a fixed or sticky navbar.
      */}
      <nav className="sticky top-0 bg-gray-800 text-white p-4 shadow-md z-50 flex justify-between">
        <span>Admin Navbar (Replace with your actual Admin Navbar)</span>
        <div>
          <Link to="/DeleteStudentList" className="px-4">
            Delete Students
          </Link>
          <Link to="/" className="px-4">
            Logout
          </Link>
        </div>
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
