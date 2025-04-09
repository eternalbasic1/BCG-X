// src/components/pricing/PriceOptimizationList.tsx
import React, { useState } from "react";
import { useBulkOptimizePricesQuery } from "../../services/api";
import { Product, PriceOptimizationParams } from "../../types";

const PriceOptimizationList: React.FC = () => {
  // Optimization parameters
  const [params, setParams] = useState<PriceOptimizationParams>({
    margin_target: 30, // Example default values
    price_sensitivity: 0.7,
    consider_market: true,
  });

  // Fetch optimized prices
  const {
    data: optimizedProducts,
    isLoading,
    error,
    refetch,
  } = useBulkOptimizePricesQuery(params);

  // Handle parameter changes
  const handleParamChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setParams({
      ...params,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : type === "number"
          ? parseFloat(value)
          : value,
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        Calculating optimized prices...
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
        role="alert"
      >
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> Failed to optimize prices.</span>
      </div>
    );
  }

  // Mock data for display purposes
  const mockOptimizedProducts: Product[] = [
    {
      product_id: 1,
      name: "Gio - Note Pad",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tpor incididun labodolore.",
      cost_price: 1.2,
      selling_price: 2.7,
      category: "Stationary",
      stock_available: 121213,
      units_sold: 131244,
      created_at: "2023-01-01",
      updated_at: "2023-01-01",
      optimized_price: 1.01,
    },
    {
      product_id: 2,
      name: "Jazz - Sticky Notes",
      description: "Sed do eiusmod tpor incididun.",
      cost_price: 2.5,
      selling_price: 3.3,
      category: "Stationary",
      stock_available: 21200,
      units_sold: 653121,
      created_at: "2023-01-01",
      updated_at: "2023-01-01",
      optimized_price: 1.3,
    },
  ];

  const displayProducts = optimizedProducts || mockOptimizedProducts;

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold">Pricing Optimization</h2>
            <p className="text-gray-500">With Demand Forecast</p>
          </div>
          <div>
            <button className="px-4 py-2 bg-white border border-gray-300 rounded shadow text-gray-700">
              Filter
            </button>
          </div>
        </div>

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
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cost Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Selling Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Optimized Price
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {displayProducts.map((product) => (
                <tr key={product.product_id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {product.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {product.category}
                  </td>
                  <td className="px-6 py-4 max-w-md truncate">
                    {product.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    $ {product.cost_price.toFixed(1)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    $ {product.selling_price.toFixed(1)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-green-600">
                    $ {product.optimized_price?.toFixed(2) || "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end mt-6 space-x-4">
          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md">
            Cancel
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default PriceOptimizationList;
