"use client";

import { useEffect } from "react";

export function CacheBuster() {
  useEffect(() => {
    // Forceer schone laden door cache te omzeilen
    const meta = document.createElement('meta');
    meta.httpEquiv = 'Cache-Control';
    meta.content = 'no-cache, no-store, must-revalidate';
    document.head.appendChild(meta);
    
    return () => {
      document.head.removeChild(meta);
    };
  }, []);

  return null;
}
