import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useLoginMutation } from "../api/authApi";
import { setToken, setUser } from "../utils/authUtils";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { setCredentials } from "../features/auth/authSlice";

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [login, { isLoading }] = useLoginMutation();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  // This effect handles redirection after authentication state changes
  useEffect(() => {
    if (isAuthenticated) {
      // Navigate to the intended location or dashboard
      const from = location.state?.from?.pathname || "/dashboard";
      console.log("Auth state changed, redirecting to:", from);
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    console.log("Attempting login with:", { username, password });

    try {
      const response = await login({ username, password }).unwrap();
      console.log("Login successful:", response);

      // Store the token in localStorage
      setToken(response.access);
      setUser(response.user);
      // Update Redux state - IMPORTANT: Uncommented this!
      dispatch(
        setCredentials({
          user: response.user,
          token: response.access,
        })
      );

      // NOTE: Removed direct navigation here - it's now handled by the useEffect above
      // This prevents race conditions between state updates and navigation
    } catch (err) {
      console.error("Login unwrap error:", err);

      if (err && typeof err === "object" && "data" in err) {
        const errorData = err.data as any;
        setErrorMsg(
          errorData?.error ||
            errorData?.detail ||
            errorData?.non_field_errors?.[0] ||
            "Login failed. Please check your credentials."
        );
      } else {
        setErrorMsg("Network error. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-blue-600 p-6">
          <h2 className="text-xl font-bold text-white text-center">
            Price Optimization Tool
          </h2>
        </div>
        <div className="p-6">
          <h3 className="text-xl font-semibold mb-4 text-center">Login</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="username"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            <div className="mb-6">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="password"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            <div className="flex items-center justify-between">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                {isLoading ? "Logging in..." : "Sign In"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
