"use client";

import { useEffect } from "react";

export default function AdminPage() {
  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem("decap-cms-user");
    
    if (user) {
      try {
        const userData = JSON.parse(user);
        if (userData.token) {
          // Logged in, go to admin-static
          window.location.href = "/admin-static/";
          return;
        }
      } catch (e) {
        // Invalid data
        localStorage.removeItem("decap-cms-user");
      }
    }
    
    // Not logged in, go to login
    window.location.href = "/admin-static/login.html";
  }, []);

  return (
    <div style={{ 
      height: "100vh", 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center",
      fontFamily: "sans-serif"
    }}>
      <p>Checking login status...</p>
    </div>
  );
}
