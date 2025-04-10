// src/components/pricing/DemandVisualization.tsx
import React, { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  ReferenceLine,
  ScatterChart,
  Scatter,
  ZAxis,
} from "recharts";
import {
  useGetVisualizationDataQuery,
  useGetProductsQuery,
} from "../../services/api";

interface DemandVisualizationProps {
  productId?: number;
  showAll?: boolean;
}

const DemandVisualization: React.FC<DemandVisualizationProps> = ({
  productId,
  showAll = true,
}) => {
  // Fetch visualization data for specific product
  const {
    data: visualizationData,
    isLoading: isVisualizationLoading,
    error: visualizationError,
  } = useGetVisualizationDataQuery(productId!, { skip: !productId });

  // Fetch all products for comparison if showAll is true
  const {
    data: productsData,
    isLoading: isProductsLoading,
    error: productsError,
  } = useGetProductsQuery(undefined, { skip: !showAll });

  // Transform historical data for better visualization
  const historicalChartData = useMemo(() => {
    if (!visualizationData?.historical_data) return [];

    return visualizationData.historical_data.map((item) => ({
      date: item.date,
      price: item.selling_price,
      sales: item.units_sold,
    }));
  }, [visualizationData]);

  // Create yearly comparison data from products
  const yearlyComparisonData = useMemo(() => {
    if (!productsData || productsData.length === 0) {
      return [];
    }

    // Get top 4 products by units sold
    const topProducts = [...productsData]
      .sort((a, b) => b.units_sold - a.units_sold)
      .slice(0, 4);

    // Create comparison data for the top products
    return [
      {
        name: "Current Period",
        ...topProducts.reduce((acc, product) => {
          acc[product.name] = product.units_sold;
          return acc;
        }, {} as Record<string, number>),
      },
      {
        name: "Forecast",
        ...topProducts.reduce((acc, product) => {
          acc[product.name] =
            product.demand_forecast || Math.round(product.units_sold * 1.1);
          return acc;
        }, {} as Record<string, number>),
      },
    ];
  }, [productsData]);

  // Price elasticity curve with optimized price highlighted
  const priceElasticityCurve = useMemo(() => {
    if (!visualizationData?.demand_curve) {
      // Default mock data if not available
      return [
        { price: 1.5, demand: 5000 },
        { price: 2.0, demand: 4500 },
        { price: 2.5, demand: 4000 },
        { price: 3.0, demand: 3000 },
        { price: 3.5, demand: 2000 },
        { price: 4.0, demand: 1000 },
      ];
    }
    return visualizationData.demand_curve;
  }, [visualizationData]);

  const isLoading = isVisualizationLoading || isProductsLoading;
  const error = visualizationError || productsError;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64 bg-white rounded-lg shadow p-6">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-6 w-32 bg-gray-200 rounded mb-4"></div>
          <div className="h-40 w-full bg-gray-100 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (error && productId) {
    return (
      <div
        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow"
        role="alert"
      >
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline">
          {" "}
          Failed to load visualization data. Please try again later.
        </span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-6">
        Demand Forecast{" "}
        {visualizationData?.product_name
          ? `for ${visualizationData.product_name}`
          : "Analysis"}
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product historical data visualization */}
        {productId && (
          <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
            <h3 className="text-lg font-medium mb-4">
              Historical Price & Demand
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={historicalChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke="#82ca9d"
                  domain={["auto", "auto"]}
                />
                <Tooltip />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="sales"
                  name="Units Sold"
                  stroke="#8884d8"
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="price"
                  name="Selling Price"
                  stroke="#82ca9d"
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Product comparison or yearly trend */}
        <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
          <h3 className="text-lg font-medium mb-4">
            {showAll ? "Top Products Comparison" : "Yearly Demand Trend"}
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={yearlyComparisonData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              {productsData && productsData.length > 0 ? (
                productsData
                  .slice()
                  .sort((a, b) => b.units_sold - a.units_sold)
                  .slice(0, 4)
                  .map((product, index) => (
                    <Bar
                      key={product.product_id}
                      dataKey={product.name}
                      fill={getColorByIndex(index)}
                    />
                  ))
              ) : (
                <>
                  <Bar dataKey="Product 1" fill="#8884d8" />
                  <Bar dataKey="Product 2" fill="#82ca9d" />
                  <Bar dataKey="Product 3" fill="#ffc658" />
                  <Bar dataKey="Product 4" fill="#ff8042" />
                </>
              )}
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Price vs Demand curve */}
        <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
          <h3 className="text-lg font-medium mb-4">
            Price Elasticity of Demand
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={priceElasticityCurve}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="price"
                label={{
                  value: "Price ($)",
                  position: "insideBottom",
                  offset: -5,
                }}
              />
              <YAxis
                label={{ value: "Demand", angle: -90, position: "insideLeft" }}
              />
              <Tooltip
                formatter={(value, _name) => [
                  `${value} units`,
                  "Estimated Demand",
                ]}
                labelFormatter={(label) => `Price: $${label}`}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="demand"
                name="Demand"
                stroke="#8884d8"
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 8 }}
              />
              {visualizationData?.current_price && (
                <ReferenceLine
                  x={visualizationData.current_price}
                  stroke="red"
                  strokeDasharray="3 3"
                  label={{ value: "Current", position: "insideTopRight" }}
                />
              )}
              {visualizationData?.forecasted_demand && (
                <ReferenceLine
                  x={visualizationData.forecasted_demand}
                  stroke="green"
                  strokeDasharray="3 3"
                  label={{ value: "Optimal", position: "insideBottomRight" }}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue optimization visualization */}
        <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
          <h3 className="text-lg font-medium mb-4">
            Revenue Optimization Analysis
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                type="number"
                dataKey="price"
                name="Price"
                label={{
                  value: "Price ($)",
                  position: "insideBottom",
                  offset: -5,
                }}
              />
              <YAxis
                type="number"
                dataKey="revenue"
                name="Revenue"
                label={{
                  value: "Est. Revenue ($)",
                  angle: -90,
                  position: "insideLeft",
                }}
              />
              <ZAxis
                type="number"
                dataKey="demand"
                range={[50, 400]}
                name="Demand"
              />
              <Tooltip
                cursor={{ strokeDasharray: "3 3" }}
                formatter={(value, name, _props) => {
                  if (name === "Revenue")
                    return [`$${value.toLocaleString()}`, name];
                  return [value, name];
                }}
              />
              <Legend />
              <Scatter
                name="Price-Revenue Points"
                data={priceElasticityCurve.map((point) => ({
                  price: point.price,
                  demand: point.demand,
                  revenue: Math.round(point.price * point.demand),
                }))}
                fill="#8884d8"
              />
              {visualizationData?.current_price && (
                <ReferenceLine
                  x={visualizationData.current_price}
                  stroke="red"
                  strokeDasharray="3 3"
                />
              )}
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Product data table */}
      <div className="mt-8">
        <h3 className="text-lg font-medium mb-4">
          Product Data with Demand Forecast
        </h3>
        <div className="overflow-x-auto bg-gray-50 rounded-lg shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cost Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Selling Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Margin
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Units Sold
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Demand Forecast
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {productId && visualizationData ? (
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap font-medium">
                    {visualizationData.product_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {productsData?.find((p) => p.product_id === productId)
                      ?.category || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    $
                    {productsData
                      ?.find((p) => p.product_id === productId)
                      ?.cost_price.toFixed(2) || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    ${visualizationData.current_price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {calculateMargin(
                      productsData?.find((p) => p.product_id === productId)
                        ?.cost_price || 0,
                      visualizationData.current_price
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {formatNumber(
                      productsData?.find((p) => p.product_id === productId)
                        ?.stock_available || 0
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {formatNumber(
                      productsData?.find((p) => p.product_id === productId)
                        ?.units_sold || 0
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-semibold">
                    {formatNumber(visualizationData.forecasted_demand)}
                  </td>
                </tr>
              ) : productsData && productsData.length > 0 ? (
                productsData.slice(0, 5).map((product) => (
                  <tr key={product.product_id}>
                    <td className="px-6 py-4 whitespace-nowrap font-medium">
                      {product.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {product.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {/* ${product.cost_price.toFixed(2)} */}
                      {product.cost_price
                        ? Number(product.cost_price).toFixed(2)
                        : "0.00"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {/* ${product.selling_price.toFixed(2)} */}
                      {product.selling_price
                        ? Number(product.selling_price).toFixed(2)
                        : "0.00"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {calculateMargin(
                        product.cost_price,
                        product.selling_price
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {formatNumber(product.stock_available)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {formatNumber(product.units_sold)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-semibold">
                      {formatNumber(
                        product.demand_forecast ||
                          Math.round(product.units_sold * 1.1)
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={8}
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No product data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Helper functions
const getColorByIndex = (index: number): string => {
  const colors = [
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#ff8042",
    "#0088FE",
    "#00C49F",
  ];
  return colors[index % colors.length];
};

const formatNumber = (num: number): string => {
  return new Intl.NumberFormat().format(num);
};

const calculateMargin = (cost: number, price: number): string => {
  const margin = ((price - cost) / price) * 100;
  return `${margin.toFixed(1)}%`;
};

export default DemandVisualization;
