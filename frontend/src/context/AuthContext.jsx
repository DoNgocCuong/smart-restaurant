import { createContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [role, setRole] = useState(localStorage.getItem("role") || "");

  // ===== SET AUTH FROM TOKEN (LOGIN + REFRESH) =====
  const setAuthFromToken = (token) => {
    if (!token) {
      logout();
      return;
    }

    localStorage.setItem("token", token);
    setToken(token);

    try {
      const decoded = jwtDecode(token);
      const scope = decoded.scope || "";
      const rawRole = scope.split(" ")[0];
      const roleString = rawRole.replace("ROLE_", "");

      localStorage.setItem("role", roleString);
      setRole(roleString);
    } catch (err) {
      console.error("Invalid token", err);
      logout();
    }
  };

  // ===== LOGIN =====
  const login = (token) => {
    setAuthFromToken(token);
  };

  // ===== LOGOUT =====
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setToken(null);
    setRole("");
  };

  // ===== SYNC TOKEN WHEN REFRESH FROM AXIOS =====
  useEffect(() => {
    const syncToken = () => {
      const token = localStorage.getItem("token");
      if (token) {
        setAuthFromToken(token);
      }
    };

    window.addEventListener("token-updated", syncToken);
    return () => window.removeEventListener("token-updated", syncToken);
  }, []);

  const isLoggedIn = !!token;
  const hasRole = (r) => role === r;

  return (
    <AuthContext.Provider
      value={{
        token,
        role,
        login,
        logout,
        isLoggedIn,
        hasRole,
        setAuthFromToken, // 🔥 quan trọng
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
