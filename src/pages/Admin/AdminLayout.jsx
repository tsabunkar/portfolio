import { useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
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
        <div className={styles.headerLeft}>
          <h2 className={styles.heading}>Control Center</h2>
          <nav className={styles.nav}>
            <NavLink to="/admin/dashboard" className={styles.navLink}>
              Dashboard
            </NavLink>
            <NavLink to="/admin/setup-totp" className={styles.navLink}>
              2FA Setup
            </NavLink>
          </nav>
        </div>
        <button className={styles.logoutBtn} onClick={logout}>
          Logout
        </button>
      </header>
      {children}
    </div>
  );
}
