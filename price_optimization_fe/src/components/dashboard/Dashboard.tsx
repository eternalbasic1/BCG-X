import React from "react";
import Card from "../common/Card";
import { useGetProductsQuery } from "../../api/productApi";

const Dashboard: React.FC = () => {
  const { data: products, isLoading } = useGetProductsQuery();

  const totalProducts = products ? products.length : 0;
  const totalStock = products
    ? products.reduce((acc, product) => acc + product.stock_available, 0)
    : 0;
  const avgRating =
    products && products.length > 0
      ? (
          products.reduce(
            (acc, product) => acc + (product.customer_rating || 0),
            0
          ) / products.length
        ).toFixed(1)
      : "N/A";

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Dashboard</h2>
      {isLoading ? (
        <div>Loading dashboard...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card title="Total Products">
            <p className="text-3xl font-bold">{totalProducts}</p>
          </Card>
          <Card title="Total Stock">
            <p className="text-3xl font-bold">{totalStock}</p>
          </Card>
          <Card title="Average Rating">
            <p className="text-3xl font-bold">{avgRating}</p>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
