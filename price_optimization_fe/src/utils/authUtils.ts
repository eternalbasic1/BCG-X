// src/utils/authUtils.ts
export const setToken = (token: string): void => {
  localStorage.setItem("access_token", token);
};

export const setUser = (user: any) => {
  localStorage.setItem("user", JSON.stringify(user));
};

export const getToken = (): string | null => {
  return localStorage.getItem("access_token");
};

export const getUser = (): any => {
  const storedUser = localStorage.getItem("user");
  if (!storedUser || storedUser === "undefined") return null;
  return JSON.parse(storedUser);
};

export const removeToken = (): void => {
  localStorage.removeItem("access_token");
};

export const removeUser = (): void => {
  localStorage.removeItem("access_token");
};

export const clearAuthData = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("user");
};

export const isAuthenticated = (): boolean => {
  return !!getToken();
};

// Helper to handle token expiration
export const handleTokenExpiration = async (
  refreshFn: () => Promise<{ data: { access: string } }>
) => {
  try {
    // Call the refresh token endpoint (which should use the HttpOnly cookie)
    const result = await refreshFn();

    if (result.data && result.data.access) {
      // Update the access token in localStorage
      setToken(result.data.access);
      return true;
    }

    return false;
  } catch (error) {
    // If refresh fails, remove token and return false
    clearAuthData();
    return false;
  }
};
