// src/components/pricing/DemandVisualizationProps.tsx
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { useGetVisualizationDataQuery } from "../../services/api";

interface DemandVisualizationProps {
  productId?: number;
  showAll?: boolean;
}

const DemandVisualization: React.FC<DemandVisualizationProps> = ({
  productId,
  showAll = false,
}) => {
  // If we have a specific productId, fetch data for that product
  // Otherwise, we'll show comparative data for multiple products
  const {
    data: visualizationData,
    isLoading,
    error,
  } = productId
    ? useGetVisualizationDataQuery(productId)
    : { data: null, isLoading: false, error: null };

  // Mock data for multiple products comparison
  const mockYearlyData = [
    {
      name: "2020",
      "Product 1": 4000,
      "Product 2": 2400,
      "Product 3": 1800,
      "Product 4": 3200,
    },
    {
      name: "2021",
      "Product 1": 3000,
      "Product 2": 3200,
      "Product 3": 2200,
      "Product 4": 3400,
    },
    {
      name: "2022",
      "Product 1": 5000,
      "Product 2": 4800,
      "Product 3": 3800,
      "Product 4": 4000,
    },
    {
      name: "2023",
      "Product 1": 4000,
      "Product 2": 4200,
      "Product 3": 4100,
      "Product 4": 3800,
    },
    {
      name: "2024",
      "Product 1": 6000,
      "Product 2": 5500,
      "Product 3": 4800,
      "Product 4": 5200,
    },
  ];

  // Mock data for price vs demand visualization
  const priceVsDemandData = [
    { price: 1.5, demand: 5000 },
    { price: 2.0, demand: 4500 },
    { price: 2.5, demand: 4000 },
    { price: 3.0, demand: 3000 },
    { price: 3.5, demand: 2000 },
    { price: 4.0, demand: 1000 },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        Loading visualization data...
      </div>
    );
  }

  if (error && productId) {
    return (
      <div
        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
        role="alert"
      >
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline">
          {" "}
          Failed to load visualization data.
        </span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-6">Demand Forecast</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Year-over-year demand comparison */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <h3 className="text-lg font-medium mb-4">Yearly Demand Comparison</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={mockYearlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Product 1" fill="#8884d8" />
              <Bar dataKey="Product 2" fill="#82ca9d" />
              <Bar dataKey="Product 3" fill="#ffc658" />
              <Bar dataKey="Product 4" fill="#ff8042" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Price vs Demand curve */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <h3 className="text-lg font-medium mb-4">
            Product Demand vs Selling Price
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={visualizationData?.demand_curve || priceVsDemandData}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="price"
                label={{
                  value: "Price ($)",
                  position: "insideBottom",
                  offset: -5,
                }}
              />
              <YAxis
                label={{ value: "Demand", angle: -90, position: "insideLeft" }}
              />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="demand"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-medium mb-4">
          Product Data with Demand Forecast
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cost Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Selling Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Available Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Units Sold
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Calculated Demand Forecast
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {/* Example rows - these would come from your API */}
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">Gio - Note Pad</td>
                <td className="px-6 py-4 whitespace-nowrap">Stationary</td>
                <td className="px-6 py-4 whitespace-nowrap">$ 1.2</td>
                <td className="px-6 py-4 whitespace-nowrap">$ 2.7</td>
                <td className="px-6 py-4 whitespace-nowrap">1,21,2123</td>
                <td className="px-6 py-4 whitespace-nowrap">131244</td>
                <td className="px-6 py-4 whitespace-nowrap">2342</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  Jazz - Sticky Notes
                </td>
                <td className="px-6 py-4 whitespace-nowrap">Stationary</td>
                <td className="px-6 py-4 whitespace-nowrap">$ 2.5</td>
                <td className="px-6 py-4 whitespace-nowrap">$ 3.3</td>
                <td className="px-6 py-4 whitespace-nowrap">21,200</td>
                <td className="px-6 py-4 whitespace-nowrap">653121</td>
                <td className="px-6 py-4 whitespace-nowrap">12152</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DemandVisualization;
