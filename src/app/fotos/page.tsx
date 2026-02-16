"use client";

import { motion } from "framer-motion";
import { Camera, Calendar, ExternalLink, ImageIcon } from "lucide-react";

interface FotoAlbum {
  id: string;
  title: string;
  description: string;
  date: string;
  thumbnail: string;
  googlePhotosUrl: string;
  fotoCount: number | null;
}

// Hier kun je evenementen toevoegen met links naar Google Foto's
// Gesorteerd op datum (nieuwste eerst)
// 
// THUMBNAILS: Plaats een representatieve foto in: /public/images/fotos/[evenement-naam].jpg
// Als er geen specifieke foto is, wordt een ploegfoto gebruikt als fallback
//
const fotoAlbums: FotoAlbum[] = [
  {
    id: "herfst-voetbalkamp-2025",
    title: "Herfst Voetbalkamp 2025",
    description: "Herfst voetbalkamp voor de jeugd",
    date: "2025",
    thumbnail: "/images/teams/alle-jeugd.jpg",
    googlePhotosUrl: "https://photos.app.goo.gl/VNg1bVbeQcDFCxEY8",
    fotoCount: null
  },
  {
    id: "jeugdtornooi-2025",
    title: "Jeugdtornooi 2025",
    description: "Het jaarlijkse jeugdtornooi",
    date: "2025",
    thumbnail: "/images/teams/alle-jeugd.jpg",
    googlePhotosUrl: "https://photos.app.goo.gl/JAnNmRfQu7S3YWcn8",
    fotoCount: null
  },
  {
    id: "futbalista-2021",
    title: "Futbalista 2021",
    description: "Futbalista evenement",
    date: "2021",
    thumbnail: "/images/teams/women-U16.jpg",
    googlePhotosUrl: "https://photos.app.goo.gl/WvWsrhPJq7gRHKML6",
    fotoCount: null
  },
  {
    id: "footfest-meisjes-2020",
    title: "Footfest Meisjes 2020",
    description: "Footfest meisjes tornooi",
    date: "2020",
    thumbnail: "/images/teams/1ste-ploeg-dames.jpg",
    googlePhotosUrl: "https://photos.app.goo.gl/pr6ajj1mqCSwePnJ9",
    fotoCount: null
  },
  {
    id: "jeugdvoorstelling-23-24",
    title: "Jeugdvoorstelling 23-24",
    description: "Jeugdvoorstelling seizoen 2023-2024",
    date: "2023-2024",
    thumbnail: "/images/teams/alle-jeugd.jpg",
    googlePhotosUrl: "https://photos.app.goo.gl/QifkGaP7ijN5LdLq9",
    fotoCount: null
  },
  {
    id: "ehbo-cursus-2019",
    title: "EHBO Cursus 2019",
    description: "EHBO cursus voor trainers en begeleiders",
    date: "2019",
    thumbnail: "/images/teams/placeholder-senioren.jpg",
    googlePhotosUrl: "https://photos.app.goo.gl/57tKwG9JXFzzzX5c7",
    fotoCount: null
  },
  {
    id: "jeugdtornooi-2017",
    title: "Jeugdtornooi 2017",
    description: "Jeugdtornooi",
    date: "2017",
    thumbnail: "/images/teams/alle-jeugd.jpg",
    googlePhotosUrl: "https://photos.app.goo.gl/URV1jMuYDFbjPMpE8",
    fotoCount: null
  },
  {
    id: "dribbelfestival-2016",
    title: "Dribbelfestival 2016",
    description: "Dribbelfestival voor de jeugd",
    date: "2016",
    thumbnail: "/images/teams/U6.jpg",
    googlePhotosUrl: "https://photos.app.goo.gl/WDp5y4MpGDQaCQWo7",
    fotoCount: null
  },
  {
    id: "paasvoetbalkamp-2016",
    title: "Paasvoetbalkamp 2016",
    description: "Paasvoetbalkamp voor de jeugd",
    date: "2016",
    thumbnail: "/images/teams/U12.jpg",
    googlePhotosUrl: "https://photos.app.goo.gl/JG3QMLaieaTNSVD77",
    fotoCount: null
  },
  {
    id: "meisjes-footfestival-2015",
    title: "Meisjes Foot-festival 2015",
    description: "Meisjes foot-festival",
    date: "2015",
    thumbnail: "/images/teams/1ste-ploeg-dames.jpg",
    googlePhotosUrl: "https://photos.app.goo.gl/BtLYV9cUjzqzBXRUA",
    fotoCount: null
  },
  {
    id: "dribbelfestival-2015",
    title: "Dribbelfestival 2015",
    description: "Dribbelfestival voor de jeugd",
    date: "2015",
    thumbnail: "/images/teams/U8.jpg",
    googlePhotosUrl: "https://photos.app.goo.gl/jbgJNYv2TsAyH7os7",
    fotoCount: null
  },
  {
    id: "paasvoetbalkamp-2015",
    title: "Paasvoetbalkamp 2015",
    description: "Paasvoetbalkamp voor de jeugd",
    date: "2015",
    thumbnail: "/images/teams/U10.jpg",
    googlePhotosUrl: "https://photos.app.goo.gl/MVbRyUAMu9m8x2Nv6",
    fotoCount: null
  },
  {
    id: "sport-spelnamiddag-2014",
    title: "Sport- en spelnamiddag 2014",
    description: "Sport- en spelnamiddag voor de jeugd",
    date: "2014",
    thumbnail: "/images/teams/placeholder-jeugd.jpg",
    googlePhotosUrl: "https://photos.app.goo.gl/wq7tewPYidRE3yBB9",
    fotoCount: null
  },
  {
    id: "nieuwe-accommodatie-2014",
    title: "Nieuwe accommodatie 2014",
    description: "Opening nieuwe accommodatie",
    date: "2014",
    thumbnail: "/images/teams/1ste-ploeg.jpg",
    googlePhotosUrl: "https://photos.app.goo.gl/YTaGh4ggfUYsCg1f9",
    fotoCount: null
  },
  {
    id: "aanplanting-bos-2014",
    title: "Aanplanting Bos 2014",
    description: "Bomen planten rond de accommodatie",
    date: "2014",
    thumbnail: "/images/teams/placeholder-senioren.jpg",
    googlePhotosUrl: "https://photos.app.goo.gl/JMQBFuPkKwpcNnKy9",
    fotoCount: null
  },
  {
    id: "techniektraining-2014",
    title: "Techniektraining 2014",
    description: "Techniektraining voor de jeugd",
    date: "2014",
    thumbnail: "/images/teams/U7.jpg",
    googlePhotosUrl: "https://photos.app.goo.gl/tVt5zodiT9LHZYsP9",
    fotoCount: null
  },
  // Zonder specifieke datum
  {
    id: "dames-u16-futbalista",
    title: "Dames U16 Futbalista",
    description: "Dames U16 op Futbalista",
    date: "",
    thumbnail: "/images/teams/women-U16.jpg",
    googlePhotosUrl: "https://photos.app.goo.gl/k6Hi5UpWZLCDwVXS9",
    fotoCount: null
  },
  {
    id: "dames-u16",
    title: "Dames U16",
    description: "Dames U16 foto's",
    date: "",
    thumbnail: "/images/teams/women-U16.jpg",
    googlePhotosUrl: "https://photos.app.goo.gl/UkQQjFCEBjqoDn1Q6",
    fotoCount: null
  },
  {
    id: "dames-u16-tornooien",
    title: "Dames U16 Tornooien",
    description: "Dames U16 op verschillende tornooien",
    date: "",
    thumbnail: "/images/teams/women-U16.jpg",
    googlePhotosUrl: "https://photos.app.goo.gl/KtuUn1jvSGbMbWbA9",
    fotoCount: null
  },
  {
    id: "kws-recrea-dames",
    title: "KWS Recrea Dames",
    description: "KWS Recreatieve damesploeg",
    date: "",
    thumbnail: "/images/teams/recrea-vrouwen.jpg",
    googlePhotosUrl: "https://photos.app.goo.gl/k6Hi5UpWZLCDwVXS9",
    fotoCount: null
  },
  {
    id: "oude-doos",
    title: "De Oude Doos",
    description: "Archief foto's uit het verleden",
    date: "Archief",
    thumbnail: "/images/teams/placeholder-senioren.jpg",
    googlePhotosUrl: "https://photos.app.goo.gl/rYs77iftrd7Qbbto7",
    fotoCount: null
  }
];

// Helper om thumbnail path te bepalen
// Plaats je foto's in: /public/images/fotos/
// Gebruik hetzelfde ID als de album id, bijvoorbeeld: /public/images/fotos/herfst-voetbalkamp-2025.jpg
function getThumbnailPath(album: FotoAlbum): string {
  // Specifieke thumbnails per album
  const customThumbnails: Record<string, string> = {
    "herfst-voetbalkamp-2025": "/images/fotos/herfst-voetbalkamp-2025.jpg",
    "jeugdtornooi-2025": "/images/fotos/jeugdtornooi-2025.jpg",
    "jeugdvoorstelling-23-24": "/images/fotos/jeugdvoorstelling-23-24.jpg",
    "futbalista-2021": "/images/fotos/futbalista-2021.jpg",
    "footfest-meisjes-2020": "/images/fotos/footfest-meisjes-2020.jpg",
    "ehbo-cursus-2019": "/images/fotos/ehbo-cursus-2019.jpg",
    "jeugdtornooi-2017": "/images/fotos/jeugdtornooi-2017.jpg",
    "dribbelfestival-2016": "/images/fotos/dribbelfestival-2016.jpg",
    "paasvoetbalkamp-2016": "/images/fotos/paasvoetbalkamp-2016.jpg",
    "meisjes-footfestival-2015": "/images/fotos/meisjes-footfestival-2015.jpg",
    "dribbelfestival-2015": "/images/fotos/dribbelfestival-2015.jpg",
    "paasvoetbalkamp-2015": "/images/fotos/paasvoetbalkamp-2015.jpg",
    "sport-spelnamiddag-2014": "/images/fotos/sport-spelnamiddag-2014.jpg",
    "nieuwe-accommodatie-2014": "/images/fotos/nieuwe-accommodatie-2014.jpg",
    "aanplanting-bos-2014": "/images/fotos/aanplanting-bos-2014.jpg",
    "techniektraining-2014": "/images/fotos/techniektraining-2014.jpg",
    "dames-u16-futbalista": "/images/fotos/dames-u16-futbalista.jpg",
    "dames-u16": "/images/fotos/dames-u16.jpg",
    "dames-u16-tornooien": "/images/fotos/dames-u16-tornooien.jpg",
    "kws-recrea-dames": "/images/fotos/kws-recrea-dames.jpg",
    "oude-doos": "/images/fotos/oude-doos.jpg",
  };
  
  return customThumbnails[album.id] || album.thumbnail;
}

const albums = fotoAlbums;

function FotoAlbumCard({ album, index }: { album: FotoAlbum; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: (index % 6) * 0.1, duration: 0.4 }}
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
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={getThumbnailPath(album)}
            alt={album.title}
            className="object-cover group-hover:scale-110 transition-transform duration-700 w-full h-full"
            onError={(e) => {
              // Fallback naar standaard thumbnail als specifieke foto niet gevonden
              (e.target as HTMLImageElement).src = album.thumbnail;
            }}
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
    </motion.div>
  );
}

export default function FotosPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 py-16 md:py-20">
        <div className="container-custom text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
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
          </motion.div>
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
          {/* Filter/Category tabs - could be expanded later */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-wrap gap-2 mb-8 justify-center"
          >
            {["Alle", "Wedstrijden", "Evenementen", "Jeugd", "Senioren"].map((filter, i) => (
              <button
                key={filter}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  i === 0 
                    ? "bg-primary text-white" 
                    : "bg-white text-gray-600 hover:bg-gray-100 border"
                }`}
              >
                {filter}
              </button>
            ))}
          </motion.div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {albums.map((album, index) => (
              <FotoAlbumCard key={album.id} album={album} index={index} />
            ))}
          </div>


        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-primary-900 to-primary-800 rounded-3xl p-8 md:p-12 text-center text-white"
          >
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
          </motion.div>
        </div>
      </section>
    </div>
  );
}
