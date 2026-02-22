"use client";

import { useEffect } from "react";

export default function AdminPage() {
  useEffect(() => {
    // Redirect to admin-static which has Decap CMS
    window.location.href = "/admin-static/";
  }, []);

  return (
    <div style={{ 
      height: "100vh", 
      width: "100vw", 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center",
      background: "#f5f5f5"
    }}>
      <p>Decap CMS laden...</p>
    </div>
  );
}
