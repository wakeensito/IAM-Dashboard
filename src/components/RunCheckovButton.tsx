import React, { useState } from "react";

const RunCheckovButton: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const runCheckovScan = async () => {
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("http://127.0.0.1:5000/api/v1/run-checkov", {
        method: "POST",
      });

      const data = await response.json();

      if (data.message) {
        setMessage("✅ " + data.message);
      } else if (data.error) {
        setMessage("❌ " + data.error);
      } else {
        setMessage("⚠️ Unexpected response from server.");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("❌ Could not connect to backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "30px" }}>
      <button
        onClick={runCheckovScan}
        disabled={loading}
        style={{
          padding: "10px 20px",
          backgroundColor: loading ? "#888" : "#007bff",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Running..." : "Run Checkov Scan"}
      </button>

      {message && (
        <p style={{ marginTop: "15px", fontFamily: "monospace" }}>{message}</p>
      )}
    </div>
  );
};

export default RunCheckovButton;
