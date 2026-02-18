"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    // Scroll altijd naar boven bij pagina wissel
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
