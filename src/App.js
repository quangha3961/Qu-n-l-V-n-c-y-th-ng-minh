import { Route, Routes, Navigate } from "react-router";
import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import RootLayout from "./pages/RootLayout";
import DashboardPage from "./pages/Dashboard";
import SensorDataPage from "./pages/SensorData/SensorData";
import ActionHistoryPage from "./pages/ActionHistory/ActionHistory";
import LoginPage from "./pages/LoginPage";

function App() {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check for token in localStorage when app loads
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  // Login handler
  const handleLogin = async (username, password) => {
    try {
      const response = await axios.post("http://localhost:5000/api/login", { username, password });
      localStorage.setItem("token", response.data.token);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Login failed", error);
      alert("Invalid credentials");
    }
  };

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token
    setIsAuthenticated(false); // Reset auth state
  };

  // ProtectedRoute component
  const ProtectedRoute = ({ element }) => {
    const token = localStorage.getItem("token");
    return token ? element : <Navigate to="/login" />;
  };

  return (
    <Routes>
      {/* Login Route */}
      <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />

      {/* Protected Routes */}
      <Route element={<RootLayout onLogout={handleLogout} />}>
        <Route path="/" element={<ProtectedRoute element={<DashboardPage />} />} />
        <Route path="dashboard" element={<ProtectedRoute element={<DashboardPage />} />} />
        <Route path="data" element={<ProtectedRoute element={<SensorDataPage />} />} />
        <Route path="history" element={<ProtectedRoute element={<ActionHistoryPage />} />} />
      </Route>
    </Routes>
  );
}

export default App;
