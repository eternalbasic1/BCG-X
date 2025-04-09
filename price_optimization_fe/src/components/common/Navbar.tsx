// src/components/common/Navbar.tsx

import React from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { logout } from "../../features/auth/authSlice";

const Navbar: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <nav className="bg-indigo-600 px-4 py-3">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-white text-xl font-bold">
            Price Optimization Tool
          </h1>
        </div>
        <div className="flex items-center">
          {user && (
            <div className="flex items-center">
              <span className="text-white mr-4">
                Welcome, {user.first_name} {user.last_name}
              </span>
              <button
                onClick={handleLogout}
                className="bg-white text-indigo-600 px-3 py-1 rounded-md text-sm font-medium"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
