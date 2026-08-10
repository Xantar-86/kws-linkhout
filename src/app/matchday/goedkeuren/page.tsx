import { Suspense } from "react";
import type { Metadata } from "next";
import { GoedkeurClient } from "./GoedkeurClient";

export const metadata: Metadata = {
  title: "Matchday-post goedkeuren | KWS Linkhout",
  robots: { index: false, follow: false },
};

export default function GoedkeurPagina() {
  return (
    <main className="min-h-screen bg-gray-50 py-10">
      <div className="mx-auto max-w-2xl px-4">
        <Suspense
          fallback={
            <div className="rounded-2xl bg-white p-8 shadow animate-pulse">
              <div className="h-6 w-1/3 rounded bg-gray-200" />
            </div>
          }
        >
          <GoedkeurClient />
        </Suspense>
      </div>
    </main>
  );
}
