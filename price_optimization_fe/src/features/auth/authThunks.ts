import { AppDispatch } from "../../app/store";
import { logout as logoutAction } from "./authSlice";
import { apiSlice } from "../../api/apiSlice";
import { clearAuthData } from "../../utils/authUtils";

export const authThunks = () => (dispatch: AppDispatch) => {
  // Clear from localStorage
  clearAuthData();

  // Clear auth slice
  dispatch(logoutAction());

  // Reset RTK Query cache
  dispatch(apiSlice.util.resetApiState());
};
