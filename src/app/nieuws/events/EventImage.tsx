"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { Calendar, X } from "lucide-react";

export function EventImage({ src, alt }: { src: string; alt: string }) {
  const [open, setOpen] = useState(false);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, close]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`${alt} - klik om te vergroten`}
        className="relative h-40 w-full block group focus:outline-none focus:ring-2 focus:ring-primary"
      >
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-4 right-4">
          <Calendar className="w-5 h-5 text-white drop-shadow-md" />
        </div>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center"
          onClick={close}
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              close();
            }}
            aria-label="Sluiten"
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
          >
            <X className="w-6 h-6" />
          </button>

          <div
            className="relative w-[92vw] h-[85vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <Image src={src} alt={alt} fill sizes="92vw" className="object-contain" priority />
          </div>
        </div>
      )}
    </>
  );
}
