import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import styles from "./AdminLayout.module.css";

export default function AdminLayout({ children }) {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/admin", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) return null;

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <h2 className={styles.heading}>Control Center</h2>
        <button className={styles.logoutBtn} onClick={logout}>
          Logout
        </button>
      </header>
      {children}
    </div>
  );
}
