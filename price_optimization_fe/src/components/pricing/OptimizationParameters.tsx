// import React, { useState } from "react";
// import { PriceOptimizationParams } from "../../types";

// interface OptimizationParametersProps {
//   initialParams: PriceOptimizationParams;
//   onParamChange: (params: PriceOptimizationParams) => void;
//   onApply: () => void;
// }

// const OptimizationParameters: React.FC<OptimizationParametersProps> = ({
//   initialParams,
//   onParamChange,
//   onApply,
// }) => {
//   const [params, setParams] = useState<PriceOptimizationParams>(initialParams);

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
//   ) => {
//     const { name, value, type } = e.target;
//     const newValue =
//       type === "checkbox"
//         ? (e.target as HTMLInputElement).checked
//         : type === "number" || type === "range"
//         ? parseFloat(value)
//         : value;

//     setParams({
//       ...params,
//       [name]: newValue,
//     });
//   };

//   const handleApply = () => {
//     onParamChange(params);
//     onApply();
//   };

//   return (
//     <div className="bg-white rounded-lg shadow p-6 mb-6">
//       <h3 className="text-lg font-medium mb-4">Optimization Parameters</h3>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Margin Target (%)
//           </label>
//           <input
//             type="range"
//             name="margin_target"
//             min="10"
//             max="50"
//             value={params.margin_target || 30}
//             onChange={handleChange}
//             className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
//           />
//           <div className="flex justify-between text-xs text-gray-600">
//             <span>10%</span>
//             <span>{params.margin_target || 30}%</span>
//             <span>50%</span>
//           </div>
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Price Sensitivity
//           </label>
//           <input
//             type="range"
//             name="price_sensitivity"
//             min="0.1"
//             max="1"
//             step="0.1"
//             value={params.price_sensitivity || 0.7}
//             onChange={handleChange}
//             className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
//           />
//           <div className="flex justify-between text-xs text-gray-600">
//             <span>0.1 (Low)</span>
//             <span>{params.price_sensitivity || 0.7}</span>
//             <span>1.0 (High)</span>
//           </div>
//         </div>
//       </div>

//       <div className="flex items-center mb-4">
//         <input
//           type="checkbox"
//           id="consider_market"
//           name="consider_market"
//           checked={params.consider_market || false}
//           onChange={handleChange

import React, { useState } from "react";
import Button from "../common/Button";

interface OptimizationParametersProps {
  onApply: (params: {
    margin_target: number;
    price_sensitivity: number;
    consider_market: boolean;
  }) => void;
}

const OptimizationParameters: React.FC<OptimizationParametersProps> = ({
  onApply,
}) => {
  const [marginTarget, setMarginTarget] = useState<number>(10);
  const [priceSensitivity, setPriceSensitivity] = useState<number>(1);
  const [considerMarket, setConsiderMarket] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onApply({
      margin_target: marginTarget,
      price_sensitivity: priceSensitivity,
      consider_market: considerMarket,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block mb-1 font-semibold">Margin Target (%)</label>
        <input
          type="number"
          value={marginTarget}
          onChange={(e) => setMarginTarget(Number(e.target.value))}
          className="w-full px-3 py-2 border rounded-md"
        />
      </div>
      <div>
        <label className="block mb-1 font-semibold">Price Sensitivity</label>
        <input
          type="number"
          value={priceSensitivity}
          onChange={(e) => setPriceSensitivity(Number(e.target.value))}
          className="w-full px-3 py-2 border rounded-md"
        />
      </div>
      <div>
        <label className="inline-flex items-center">
          <input
            type="checkbox"
            checked={considerMarket}
            onChange={(e) => setConsiderMarket(e.target.checked)}
            className="form-checkbox"
          />
          <span className="ml-2">Consider Market Conditions</span>
        </label>
      </div>
      <div>
        <Button type="submit">Apply Parameters</Button>
      </div>
    </form>
  );
};

export default OptimizationParameters;
