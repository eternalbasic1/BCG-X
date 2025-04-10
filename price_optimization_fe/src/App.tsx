import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAppSelector } from "./app/hooks";

// Layouts
import MainLayout from "./layouts/MainLayout";

// Pages
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import DemandForecastPage from "./pages/DemandForecastPage";
import PriceOptimizationPage from "./pages/PriceOptimizationPage";
import RegisterPage from "./pages/RegisterPage";
import UserManagementPage from "./pages/UserManagementPage";

const App: React.FC = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            isAuthenticated ? <Navigate to="/dashboard" /> : <LoginPage />
          }
        />

        <Route
          path="/register"
          element={
            isAuthenticated ? <Navigate to="/dashboard" /> : <RegisterPage />
          }
        />

        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="/dashboard" />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="products/:id" element={<ProductDetailPage />} />
          <Route path="demand-forecast" element={<DemandForecastPage />} />
          <Route
            path="price-optimization"
            element={<PriceOptimizationPage />}
          />
          <Route path="users" element={<UserManagementPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
