import { useState, useEffect, useCallback } from "react";

export function useAuth() {
  const [user, setUser] = useState(() => {
    const u = localStorage.getItem("user");
    return u ? JSON.parse(u) : null;
  });

  const updateUser = useCallback((newUser) => {
    if (newUser) {
      localStorage.setItem("user", JSON.stringify(newUser));
      setUser(newUser);
    } else {
      localStorage.removeItem("user");
      setUser(null);
    }
  }, []);

  useEffect(() => {
    const handler = () => {
      const u = localStorage.getItem("user");
      setUser(u ? JSON.parse(u) : null);
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  return { user, updateUser };
}