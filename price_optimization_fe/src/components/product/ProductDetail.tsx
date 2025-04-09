import React from "react";
import { ProductDetail as ProductDetailType } from "../../types";
import Card from "../common/Card";
import Table from "../common/Table";

interface ProductDetailProps {
  product: ProductDetailType;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product }) => {
  const historyColumns = [
    { header: "Month", accessor: "month" },
    { header: "Units Sold", accessor: "units_sold" },
    { header: "Selling Price", accessor: "selling_price" },
    { header: "Cost Price", accessor: "cost_price" },
    { header: "Created At", accessor: "created_at" },
  ];

  return (
    <div className="space-y-6">
      <Card title="Product Details">
        <p>
          <strong>Name:</strong> {product.name}
        </p>
        <p>
          <strong>Description:</strong> {product.description}
        </p>
        <p>
          <strong>Category:</strong> {product.category}
        </p>
        <p>
          <strong>Selling Price:</strong> ${product.selling_price}
        </p>
        <p>
          <strong>Stock Available:</strong> {product.stock_available}
        </p>
      </Card>

      <Card title="Product History">
        {product.history && product.history.length > 0 ? (
          <Table columns={historyColumns} data={product.history} />
        ) : (
          <p>No product history available.</p>
        )}
      </Card>
    </div>
  );
};

export default ProductDetail;
