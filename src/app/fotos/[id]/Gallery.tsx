"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Grid3x3, LayoutGrid, X } from "lucide-react";

type ViewMode = "raster" | "mozaiek";

export function AlbumGallery({ images, title }: { images: string[]; title: string }) {
  const [view, setView] = useState<ViewMode>("raster");
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const close = useCallback(() => setOpenIdx(null), []);
  const prev = useCallback(
    () => setOpenIdx((i) => (i === null ? null : (i - 1 + images.length) % images.length)),
    [images.length]
  );
  const next = useCallback(
    () => setOpenIdx((i) => (i === null ? null : (i + 1) % images.length)),
    [images.length]
  );

  useEffect(() => {
    if (openIdx === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [openIdx, close, prev, next]);

  return (
    <>
      {/* Weergave-keuze */}
      <div className="flex items-center justify-end mb-6 gap-2">
        <span className="text-sm text-gray-600 mr-1">Weergave:</span>
        <button
          type="button"
          onClick={() => setView("raster")}
          aria-pressed={view === "raster"}
          className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            view === "raster"
              ? "bg-primary text-white"
              : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
          }`}
        >
          <Grid3x3 className="w-4 h-4" />
          Raster
        </button>
        <button
          type="button"
          onClick={() => setView("mozaiek")}
          aria-pressed={view === "mozaiek"}
          className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            view === "mozaiek"
              ? "bg-primary text-white"
              : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
          }`}
        >
          <LayoutGrid className="w-4 h-4" />
          Mozaïek
        </button>
      </div>

      {view === "raster" ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {images.map((src, i) => (
            <button
              key={src + i}
              type="button"
              onClick={() => setOpenIdx(i)}
              className="group relative aspect-square overflow-hidden rounded-lg bg-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <Image
                src={src}
                alt={`${title} foto ${i + 1}`}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </button>
          ))}
        </div>
      ) : (
        <div className="columns-2 sm:columns-3 md:columns-4 gap-3 [column-fill:_balance]">
          {images.map((src, i) => (
            <button
              key={src + i}
              type="button"
              onClick={() => setOpenIdx(i)}
              className="group block w-full mb-3 break-inside-avoid overflow-hidden rounded-lg bg-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <Image
                src={src}
                alt={`${title} foto ${i + 1}`}
                width={600}
                height={400}
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="w-full h-auto group-hover:scale-[1.02] transition-transform duration-500"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {openIdx !== null && (
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

          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  prev();
                }}
                aria-label="Vorige"
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
              >
                <ChevronLeft className="w-7 h-7" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  next();
                }}
                aria-label="Volgende"
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
              >
                <ChevronRight className="w-7 h-7" />
              </button>
            </>
          )}

          <div
            className="relative w-[92vw] h-[85vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[openIdx]}
              alt={`${title} foto ${openIdx + 1}`}
              fill
              sizes="92vw"
              className="object-contain"
              priority
            />
          </div>

          <div className="absolute bottom-4 left-0 right-0 text-center text-white/80 text-sm">
            {openIdx + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  );
}
