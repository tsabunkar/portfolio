import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import styles from "./SetupTotp.module.css";

const API_URL = import.meta.env.VITE_API_URL || "";

export default function SetupTotp() {
  const { token, authedFetch } = useAuth();
  const [configured, setConfigured] = useState(null);
  const [secret, setSecret] = useState("");
  const [uri, setUri] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!token) return;
    fetch(`${API_URL}/setup-totp`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        setConfigured(data.configured);
        if (data.configured) setSecret("(already configured)");
      })
      .catch(() => setConfigured(false));
  }, [token]);

  useEffect(() => {
    if (!uri || !canvasRef.current) return;
    import("qrcode").then((QRCode) => {
      QRCode.toCanvas(canvasRef.current, uri, { width: 260 }, (err) => {
        if (err) setError("Failed to render QR code");
      });
    });
  }, [uri]);

  const handleGenerate = useCallback(async () => {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const data = await authedFetch("/setup-totp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      setSecret(data.secret);
      setUri(data.provisioning_uri);
      setConfigured(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [authedFetch]);

  if (configured === null) {
    return (
      <div className={styles.wrapper}>
        <p className={styles.status}>Checking TOTP configuration...</p>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>Authenticator App Setup</h1>

      <p className={styles.description}>
        Scan the QR code below with your authenticator app (Google
        Authenticator, Authy, 1Password, etc.) to enable two-factor
        authentication.
      </p>

      {error && <p className={styles.error}>{error}</p>}
      {success && <p className={styles.success}>{success}</p>}

      {uri ? (
        <div className={styles.qrSection}>
          <canvas ref={canvasRef} className={styles.qrCode} />
          <div className={styles.secretBox}>
            <span className={styles.secretLabel}>Or enter this key manually:</span>
            <code className={styles.secret}>{secret}</code>
          </div>
          <p className={styles.hint}>
            After scanning, enter a code from your app in the login form to
            verify it works.
          </p>
        </div>
      ) : (
        <button
          className={styles.btn}
          onClick={handleGenerate}
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate Secret"}
        </button>
      )}
    </div>
  );
}
