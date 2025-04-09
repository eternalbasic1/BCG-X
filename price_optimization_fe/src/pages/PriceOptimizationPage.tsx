import React from "react";
import PriceOptimizationList from "../components/pricing/PriceOptimizationList";

const PriceOptimizationPage: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Price Optimization</h1>
      <PriceOptimizationList />
    </div>
  );
};

export default PriceOptimizationPage;
