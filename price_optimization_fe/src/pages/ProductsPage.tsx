// src/pages/ProductsPage.tsx
import React from "react";
import ProductList from "../components/product/ProductList";

const ProductsPage: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Create and Manage Products</h1>
      <ProductList />
    </div>
  );
};

export default ProductsPage;
