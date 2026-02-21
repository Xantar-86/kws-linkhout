import { Metadata } from "next";
import { Camera, Calendar, ExternalLink, ImageIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getAllFotoAlbums, FotoAlbum, DEFAULT_THUMBNAIL } from "@/lib/fotos";

export const metadata: Metadata = {
  title: "Foto's - KWS Linkhout",
  description: "Herbeleef de mooiste momenten van KWS Linkhout. Van wedstrijden tot evenementen - alle foto's op één plaats.",
};

// Helper om thumbnail path te bepalen met fallback
function getThumbnailPath(album: FotoAlbum): string {
  return album.thumbnail || DEFAULT_THUMBNAIL;
}

function FotoAlbumCard({ album, index }: { album: FotoAlbum; index: number }) {
  return (
    <div
      className="group"
    >
      <a 
        href={album.googlePhotosUrl} 
        target="_blank" 
        rel="noopener noreferrer"
        className="block relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500"
      >
        {/* Thumbnail */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={getThumbnailPath(album)}
            alt={album.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700"
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
          
          {/* Icon top right */}
          <div className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
            <ExternalLink className="w-5 h-5 text-white" />
          </div>

          {/* Content at bottom */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            {/* Date badge */}
            {album.date && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/90 rounded-full text-white text-xs font-medium mb-3">
                <Calendar className="w-3 h-3" />
                {album.date}
              </div>
            )}
            
            {/* Title */}
            <h3 className="text-xl font-bold text-white mb-1 group-hover:text-primary-200 transition-colors">
              {album.title}
            </h3>
            
            {/* Description */}
            <p className="text-white/80 text-sm mb-3 line-clamp-2">
              {album.description}
            </p>

            {/* Foto count */}
            {album.fotoCount && album.fotoCount > 0 && (
              <div className="flex items-center gap-1.5 text-white/70 text-sm">
                <ImageIcon className="w-4 h-4" />
                <span>{album.fotoCount} foto&apos;s</span>
              </div>
            )}
          </div>
        </div>
      </a>
    </div>
  );
}

export default async function FotosPage() {
  // Server-side: Haal alle foto albums op
  const albums = await getAllFotoAlbums();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 py-16 md:py-20">
        <div className="container-custom text-center text-white">
          <div>
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-6">
              <Camera className="w-8 h-8" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Foto&apos;s
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Herbeleef de mooiste momenten van KWS Linkhout. 
              Van wedstrijden tot evenementen - alle foto&apos;s op één plaats.
            </p>
            <p className="text-white/70 mt-4">
              {albums.length} albums beschikbaar
            </p>
          </div>
        </div>
      </section>

      {/* Info Banner */}
      <section className="bg-white border-b">
        <div className="container-custom py-6">
          <div className="flex items-start gap-3 text-sm text-gray-600 bg-blue-50 rounded-xl p-4">
            <Camera className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <p>
              Klik op een album om de foto&apos;s te bekijken in Google Foto&apos;s. 
              Heb je zelf leuke foto&apos;s? Stuur ze naar <a href="mailto:info@kwslinkhout.be" className="text-primary hover:underline">info@kwslinkhout.be</a>
            </p>
          </div>
        </div>
      </section>

      {/* Albums Grid */}
      <section className="section-padding">
        <div className="container-custom">
          {/* Albums count */}
          <div className="mb-6 text-center">
            <p className="text-gray-600">
              {albums.length} foto album{albums.length !== 1 ? "s" : ""} gevonden
            </p>
          </div>

          {/* Grid */}
          {albums.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {albums.map((album, index) => (
                <FotoAlbumCard key={album.id} album={album} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
              <p className="text-gray-600 text-lg">
                Nog geen foto albums beschikbaar.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="bg-gradient-to-r from-primary-900 to-primary-800 rounded-3xl p-8 md:p-12 text-center text-white">
            <Camera className="w-12 h-12 mx-auto mb-4 opacity-80" />
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Heb je zelf foto&apos;s gemaakt?
            </h2>
            <p className="text-white/90 mb-6 max-w-xl mx-auto">
              Help ons de mooiste momenten vast te leggen. Stuur je foto&apos;s in en 
              we voegen ze toe aan onze collectie.
            </p>
            <a 
              href="mailto:info@kwslinkhout.be"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary rounded-xl font-semibold hover:bg-gray-100 transition-colors"
            >
              <Camera className="w-5 h-5" />
              Foto&apos;s indienen
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
