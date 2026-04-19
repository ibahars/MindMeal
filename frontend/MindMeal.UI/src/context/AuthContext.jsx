import { createContext, useState, useEffect, useContext } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Uygulama ilk açıldığında localStorage kontrolü yap
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");

    if (token && username) {
      setUser({ username, token });
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    localStorage.setItem("token", userData.token);
    localStorage.setItem("refreshToken", userData.refreshToken);
    localStorage.setItem("username", userData.username);
    setUser({ username: userData.username, token: userData.token });
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, isAuthenticated: !!user, loading }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
