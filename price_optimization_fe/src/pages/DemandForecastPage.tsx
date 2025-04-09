// src/pages/DemandForecastPage.tsx
import React from "react";
import DemandVisualization from "../components/pricing/DemandVisualization";

const DemandForecastPage: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Demand Forecast</h1>
      <DemandVisualization showAll={true} />
    </div>
  );
};

export default DemandForecastPage;
