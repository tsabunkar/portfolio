/**
 * App.jsx
 */
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";
import BaseLayout from "@/components/layout/BaseLayout";
import HomePage from "@/pages/Home";
import ArticleView from "@/pages/ArticleView";
import AdminLogin from "@/pages/Admin/AdminLogin";
import AdminDashboard from "@/pages/Admin/AdminDashboard";
import AdminSetupTotp from "@/pages/Admin/AdminSetupTotp";
import ScrollManager from "@/components/utils/ScrollManager";

export default function App() {
  return (
    <ThemeProvider>
      <Router>
        <ScrollManager />
        <BaseLayout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/article/:slug" element={<ArticleView />} />
            <Route
              path="/admin"
              element={
                <AuthProvider>
                  <AdminLogin />
                </AuthProvider>
              }
            />
            <Route
              path="/admin/dashboard"
              element={
                <AuthProvider>
                  <AdminDashboard />
                </AuthProvider>
              }
            />
            <Route
              path="/admin/setup-totp"
              element={
                <AuthProvider>
                  <AdminSetupTotp />
                </AuthProvider>
              }
            />
          </Routes>
        </BaseLayout>
      </Router>
    </ThemeProvider>
  );
}
