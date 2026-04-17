import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Calendar } from "lucide-react";
import { notFound } from "next/navigation";
import { getAllFotoAlbums, getFotoAlbumById } from "@/lib/fotos";
import { AlbumGallery } from "./Gallery";

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
      {/* Back */}
      <div className="bg-white border-b">
        <div className="container-custom py-4">
          <Link href="/fotos" className="inline-flex items-center gap-2 text-gray-600 hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Terug naar albums
          </Link>
        </div>
      </div>

      {/* Header */}
      <section className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 py-12 md:py-16">
        <div className="container-custom text-white">
          {album.date && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/15 rounded-full text-white text-xs font-medium mb-4">
              <Calendar className="w-3 h-3" />
              {album.date}
            </div>
          )}
          <h1 className="text-3xl md:text-4xl font-bold mb-3">{album.title}</h1>
          {album.description && (
            <p className="text-white/90 max-w-3xl">{album.description}</p>
          )}
          <p className="text-white/70 mt-4 text-sm">{album.images.length} foto&apos;s</p>
        </div>
      </section>

      {/* Gallery */}
      <section className="section-padding">
        <div className="container-custom">
          <AlbumGallery images={album.images} title={album.title} />
        </div>
      </section>
    </div>
  );
}
