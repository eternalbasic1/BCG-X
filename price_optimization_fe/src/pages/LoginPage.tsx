import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppSelector } from "../app/hooks";

// You'll need to create this function in your API utilities
const getHealth = async (): Promise<any> => {
  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}api/health/`
  );
  if (!response.ok) {
    throw new Error("Backend server is not responding");
  }
  return response.json();
};

const HomePage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to dashboard if already logged in
    if (isAuthenticated) {
      navigate("/dashboard");
      return;
    }

    const fetchHealth = async () => {
      try {
        await getHealth();
        setLoading(false);
      } catch (error) {
        console.error("Error connecting to the backend:", error);
        // Still set loading to false after a timeout to allow user interaction
        setTimeout(() => setLoading(false), 10000);
      }
    };

    fetchHealth();
  }, [isAuthenticated, navigate]);

  return (
    <div className="flex justify-center items-center w-screen h-screen bg-gray-100">
      {loading ? (
        <div className="flex flex-col items-center p-8 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-blue-600 mb-4">
            Price Optimization Tool
          </h2>
          <p className="text-xl font-medium text-gray-800 text-center">
            Please wait a moment, we're getting things ready for you.
          </p>
          <p className="mt-2 text-sm text-gray-600 text-center max-w-md">
            As this app is hosted on a free tier service, it may take a minute
            to wake up from its cold start state. Your application will be up
            and running soon.
          </p>
          <span className="block mt-4 w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></span>
        </div>
      ) : (
        <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Price Optimization Tool
          </h1>
          <p className="mt-3 text-gray-600">
            Make data-driven pricing decisions to maximize your revenue and
            profitability.
          </p>
          <div className="mt-6 space-y-3">
            <Link to="/login">
              <button className="w-full px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition">
                Login
              </button>
            </Link>
            <Link to="/register">
              <button className="w-full px-6 py-2 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 transition">
                Register
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
