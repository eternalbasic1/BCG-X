// src/pages/ProductDetailPage.tsx
import React from "react";
import { useParams } from "react-router-dom";
import ProductForm from "../components/product/ProductForm";

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isNewProduct = id === "new";

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">
        {isNewProduct ? "Add New Product" : "Edit Product"}
      </h1>
      <ProductForm />
    </div>
  );
};

export default ProductDetailPage;
