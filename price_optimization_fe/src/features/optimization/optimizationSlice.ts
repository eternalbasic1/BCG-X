// import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// interface OptimizationState {
//   parameters: {
//     margin_target: number;
//     price_sensitivity: number;
//     consider_market: boolean;
//   } | null;
// }

// const initialState: OptimizationState = {
//   parameters: null,
// };

// const optimizationSlice = createSlice({
//   name: "optimization",
//   initialState,
//   reducers: {
//     setOptimizationParameters(
//       state,
//       action: PayloadAction<{
//         margin_target: number;
//         price_sensitivity: number;
//         consider_market: boolean;
//       }>
//     ) {
//       state.parameters = action.payload;
//     },
//     clearOptimizationParameters(state) {
//       state.parameters = null;
//     },
//   },
// });

// export const { setOptimizationParameters, clearOptimizationParameters } =
//   optimizationSlice.actions;
// export default optimizationSlice.reducer;
