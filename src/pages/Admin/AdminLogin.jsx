import { useState, useRef } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import styles from "./AdminLogin.module.css";

const FACE_VERIFY_URL = import.meta.env.VITE_FACE_VERIFY_URL || "";

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

export default function AdminLogin() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [cameraOverlay, setCameraOverlay] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  if (isAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const capturePhoto = () => {
    return new Promise((resolve, reject) => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas) {
        reject(new Error("Camera not ready"));
        return;
      }
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext("2d").drawImage(video, 0, 0);
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Failed to capture photo"));
      }, "image/jpeg");
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!username || !password) {
      setError("Both fields are required");
      return;
    }
    setLoading(true);

    let stream = null;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      await videoRef.current.play();
      setCameraOverlay(true);

      for (let i = 3; i >= 1; i--) {
        setCountdown(i);
        await delay(1000);
      }
      setCountdown(0);

      const blob = await capturePhoto();
      stream.getTracks().forEach((t) => t.stop());
      stream = null;
      setCameraOverlay(false);

      const formData = new FormData();
      formData.append("image", blob, "capture.jpg");

      const verifyRes = await fetch(`${FACE_VERIFY_URL}/verify`, {
        method: "POST",
        body: formData,
      });
      if (!verifyRes.ok) {
        throw new Error("Face verification service unavailable");
      }
      const verifyData = await verifyRes.json();

      const confPct = Math.round(verifyData.confidence * 1000);
      if (!verifyData.isMatch || confPct < 999) {
        throw new Error("Bro you are not Tejas");
      }

      await login(username, password);
      navigate("/admin/dashboard", { replace: true });
    } catch (err) {
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }
      setCameraOverlay(false);
      setError("Bro you are not Tejas");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h1 className={styles.title}>Admin Login</h1>

        <label className={styles.label}>
          Username
          <input
            className={styles.input}
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            autoFocus
          />
        </label>

        <label className={styles.label}>
          Password
          <input
            className={styles.input}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </label>

        {error && <p className={styles.error}>{error}</p>}

        <button className={styles.btn} type="submit" disabled={loading}>
          {loading ? "Signing in…" : "Sign In"}
        </button>
      </form>

      <canvas ref={canvasRef} style={{ display: "none" }} />

      <div className={cameraOverlay ? styles.overlay : styles.hidden}>
        <div className={styles.cameraContainer}>
          <video ref={videoRef} autoPlay playsInline className={styles.video} />
          {countdown > 0 && (
            <div className={styles.countdown}>{countdown}</div>
          )}
        </div>
      </div>
    </div>
  );
}
