import React from "react";
import { Link } from "react-router-dom";
import { useGetProductsQuery } from "../api/productApi";

const DashboardPage: React.FC = () => {
  const { data: productsData, isLoading } = useGetProductsQuery();

  // Determine the array of products:
  const products = Array.isArray(productsData) ? productsData : [];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Price Optimization Tool</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">
            Create and Manage Product
          </h2>
          <p className="text-gray-600 mb-4">
            Create, view, update, and delete products. Manage product details
            and track inventory.
          </p>
          <Link
            to="/products"
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Go to Products
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Pricing Optimization</h2>
          <p className="text-gray-600 mb-4">
            Determine the best product prices based on demand forecasts and
            market conditions.
          </p>
          <Link
            to="/price-optimization"
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Go to Pricing
          </Link>
        </div>
      </div>

      {!isLoading && products && products.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Recent Products</h2>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.slice(0, 10).map((product) => (
                  <tr key={product.product_id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {product.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {product.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {product.selling_price
                        ? `$${Number(product.selling_price).toFixed(2)}`
                        : "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {product.stock_available}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
