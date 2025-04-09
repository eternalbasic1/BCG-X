// src/components/product/ProductList.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetProductsQuery } from "../../services/api";

const ProductList: React.FC = () => {
  const { data: products, isLoading, error } = useGetProductsQuery();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("Stationary"); // Default to Stationary as per UI
  const navigate = useNavigate();

  // Filter products based on search term and category
  const filteredProducts = products?.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      !categoryFilter || product.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        Loading products...
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
        <span className="block sm:inline"> Failed to load products.</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold">Create and Manage Product</h2>
            <p className="text-gray-500">With Demand Forecast</p>
          </div>
          <div className="flex space-x-4">
            <button
              className="px-4 py-2 bg-white border border-gray-300 rounded shadow text-gray-700"
              onClick={() => setCategoryFilter("Stationary")}
            >
              {categoryFilter || "Filter"}
            </button>
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded shadow"
              onClick={() => navigate("/products/new")}
            >
              Add New Products
            </button>
            <button
              className="px-4 py-2 bg-green-500 text-white rounded shadow"
              onClick={() => navigate("/demand-forecast")}
            >
              Demand Forecast
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
                  Cost Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Selling Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Available Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Units Sold
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts?.map((product) => (
                <tr key={product.product_id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {product.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {product.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    $ {product.cost_price.toFixed(1)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    $ {product.selling_price.toFixed(1)}
                  </td>
                  <td className="px-6 py-4 max-w-md truncate">
                    {product.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {product.stock_available.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {product.units_sold.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      className="text-indigo-600 hover:text-indigo-900"
                      onClick={() =>
                        navigate(`/products/${product.product_id}`)
                      }
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
