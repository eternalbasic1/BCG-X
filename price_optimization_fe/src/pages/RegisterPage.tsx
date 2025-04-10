// src/components/RegisterPage.tsx

import React from "react";
import { useNavigate } from "react-router-dom";

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-blue-600 p-6">
          <h2 className="text-xl font-bold text-white text-center">
            Price Optimization Tool
          </h2>
        </div>
        <div className="p-6">
          <h3 className="text-xl font-semibold mb-4 text-center">Register</h3>
          <p className="text-center text-gray-700 mb-6">
            Account registration is not available via this page.
          </p>
          <p className="text-center text-gray-600">
            Please contact the administrator or email:
            <br />
            <span className="text-blue-600 font-medium">
              kancharakuntlavineethreddy@gmail.com
            </span>
          </p>
          <div className="mt-6 text-center">
            <button
              onClick={() => navigate("/login")}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
