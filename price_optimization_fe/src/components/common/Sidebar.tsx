import React from "react";
import { NavLink } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";

const Sidebar: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);

  const isAdmin = user?.profile?.user_type === "admin";
  const isAnalyst = user?.profile?.user_type === "analyst";
  const isBuyer = user?.profile?.user_type === "buyer";
  const canViewPricing = isAdmin || isAnalyst || isBuyer;

  return (
    <div className="h-full min-h-screen w-64 bg-gray-800 text-white">
      <div className="p-4">
        <h2 className="text-lg font-semibold">Menu</h2>
        <ul className="mt-6 space-y-2">
          <li>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `block py-2 px-4 rounded ${
                  isActive ? "bg-indigo-600" : "hover:bg-gray-700"
                }`
              }
            >
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/products"
              className={({ isActive }) =>
                `block py-2 px-4 rounded ${
                  isActive ? "bg-indigo-600" : "hover:bg-gray-700"
                }`
              }
            >
              Create and Manage Products
            </NavLink>
          </li>
          {canViewPricing && (
            <li>
              <NavLink
                to="/demand-forecast"
                className={({ isActive }) =>
                  `block py-2 px-4 rounded ${
                    isActive ? "bg-indigo-600" : "hover:bg-gray-700"
                  }`
                }
              >
                Demand Forecast
              </NavLink>
            </li>
          )}
          {canViewPricing && !isBuyer && (
            <li>
              <NavLink
                to="/price-optimization"
                className={({ isActive }) =>
                  `block py-2 px-4 rounded ${
                    isActive ? "bg-indigo-600" : "hover:bg-gray-700"
                  }`
                }
              >
                Price Optimization
              </NavLink>
            </li>
          )}
          {isAdmin && (
            <li>
              <NavLink
                to="/users"
                className={({ isActive }) =>
                  `block py-2 px-4 rounded ${
                    isActive ? "bg-indigo-600" : "hover:bg-gray-700"
                  }`
                }
              >
                User Management
              </NavLink>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
