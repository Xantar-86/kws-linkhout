import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Calendar } from "lucide-react";
import { notFound } from "next/navigation";
import { getAllFotoAlbums, getFotoAlbumById } from "@/lib/fotos";
import { AlbumGallery } from "./Gallery";
import { PaginaKop } from "@/components/PaginaKop";

type Params = { id: string };

export async function generateStaticParams() {
  const albums = await getAllFotoAlbums();
  return albums
    .filter((a) => a.images.length > 0)
    .map((a) => ({ id: a.id }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { id } = await params;
  const album = await getFotoAlbumById(id);
  if (!album) return { title: "Album niet gevonden - KWS Linkhout" };
  return {
    title: `${album.title} - KWS Linkhout`,
    description: album.description || `Foto's van ${album.title}`,
  };
}

export default async function FotoAlbumPage({ params }: { params: Promise<Params> }) {
  const { id } = await params;
  const album = await getFotoAlbumById(id);
  if (!album || album.images.length === 0) notFound();

  return (
    <div className="min-h-screen bg-gray-50">

      <PaginaKop
        opschrift={album.date ?? undefined}
        titel={album.title}
        onder={album.description}
        terug={{ naar: "/fotos", label: "Terug naar de albums" }}
      >
        <p className="text-sm text-white/50">{album.images.length} foto&apos;s</p>
      </PaginaKop>

      {/* Gallery */}
      <section className="section-padding">
        <div className="container-custom">
          <AlbumGallery images={album.images} title={album.title} />
        </div>
      </section>
    </div>
  );
}
