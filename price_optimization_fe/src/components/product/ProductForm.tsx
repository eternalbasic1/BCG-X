// src/components/product/ProductForm.tsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGetProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
} from "../../services/api";
import { Product } from "../../types";

const ProductForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const productId = id && id !== "new" ? parseInt(id) : undefined;
  const isNewProduct = !productId;

  const navigate = useNavigate();

  // Fetch product data if editing an existing product
  const { data: existingProduct, isLoading: isLoadingProduct } =
    useGetProductByIdQuery(productId as number, { skip: isNewProduct });

  // Mutations for creating/updating products
  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

  // Form state
  const [formData, setFormData] = useState<Partial<Product>>({
    name: "",
    description: "",
    cost_price: 0,
    selling_price: 0,
    category: "Stationary", // Default category
    stock_available: 0,
    units_sold: 0,
    customer_rating: 0,
  });

  // Load existing product data into form
  useEffect(() => {
    if (existingProduct) {
      setFormData({
        name: existingProduct.name,
        description: existingProduct.description,
        cost_price: existingProduct.cost_price,
        selling_price: existingProduct.selling_price,
        category: existingProduct.category,
        stock_available: existingProduct.stock_available,
        units_sold: existingProduct.units_sold,
        customer_rating: existingProduct.customer_rating || 0,
      });
    }
  }, [existingProduct]);

  // Handle form input changes
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    // Convert numeric values
    if (
      [
        "cost_price",
        "selling_price",
        "stock_available",
        "units_sold",
        "customer_rating",
      ].includes(name)
    ) {
      setFormData({
        ...formData,
        [name]: parseFloat(value) || 0,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isNewProduct) {
        await createProduct(formData).unwrap();
      } else if (productId) {
        await updateProduct({ id: productId, product: formData }).unwrap();
      }
      navigate("/products");
    } catch (error) {
      console.error("Failed to save product:", error);
      // Handle error (show message, etc.)
    }
  };

  if (isLoadingProduct) {
    return (
      <div className="flex justify-center items-center h-64">
        Loading product data...
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">
          {isNewProduct ? "Add New Product" : "Edit Product"}
        </h2>
        <button
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md"
          onClick={() => navigate("/products")}
        >
          Back
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="Stationary">Stationary</option>
              <option value="Electronics">Electronics</option>
              <option value="Furniture">Furniture</option>
              <option value="Office Supplies">Office Supplies</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cost Price ($)
            </label>
            <input
              type="number"
              name="cost_price"
              value={formData.cost_price}
              onChange={handleChange}
              step="0.01"
              min="0"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Selling Price ($)
            </label>
            <input
              type="number"
              name="selling_price"
              value={formData.selling_price}
              onChange={handleChange}
              step="0.01"
              min="0"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Available Stock
            </label>
            <input
              type="number"
              name="stock_available"
              value={formData.stock_available}
              onChange={handleChange}
              min="0"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Units Sold
            </label>
            <input
              type="number"
              name="units_sold"
              value={formData.units_sold}
              onChange={handleChange}
              min="0"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>

        <div className="flex justify-end mt-6 space-x-4">
          <button
            type="button"
            onClick={() => navigate("/products")}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isCreating || isUpdating}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            {isCreating || isUpdating ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
