"use client";

import { useEffect, useState } from "react";

export default function AdminPage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    // Check if we have a token in the URL (from OAuth callback)
    const hash = window.location.hash;
    if (hash && hash.includes('access_token')) {
      // We're handling the OAuth callback, redirect to admin-static with token
      window.location.replace('/admin-static/' + hash);
    }
    // Otherwise, just load the admin-static page normally
  }, []);

  if (!isClient) {
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

  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      <iframe
        src="/admin-static/index.html"
        style={{
          width: "100%",
          height: "100%",
          border: "none",
        }}
        title="Decap CMS Admin"
      />
    </div>
  );
}
