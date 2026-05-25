import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Calendar } from "lucide-react";
import { notFound } from "next/navigation";
import { getAllBerichten, getBerichtBySlug } from "@/lib/berichten";
import { parseMarkdown } from "@/lib/markdown";
import { PhotoGallery } from "@/components/PhotoGallery";

type Params = { slug: string };

export async function generateStaticParams() {
  const berichten = await getAllBerichten();
  return berichten.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const bericht = await getBerichtBySlug(slug);
  if (!bericht) return { title: "Bericht niet gevonden - KWS Linkhout" };
  return {
    title: `${bericht.title} - KWS Linkhout`,
    description: bericht.intro || bericht.title,
    openGraph: bericht.cover ? { images: [{ url: bericht.cover }] } : undefined,
  };
}

function formatDate(dateString: string): string {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("nl-BE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function BerichtPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const bericht = await getBerichtBySlug(slug);
  if (!bericht) notFound();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back */}
      <div className="bg-white border-b">
        <div className="container-custom py-4">
          <Link href="/#berichten" className="inline-flex items-center gap-2 text-gray-600 hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Terug naar home
          </Link>
        </div>
      </div>

      {/* Header */}
      <section className="bg-white">
        <div className="container-custom py-12 max-w-3xl">
          {bericht.date && (
            <div className="inline-flex items-center gap-1.5 text-gray-500 mb-4">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(bericht.date)}</span>
            </div>
          )}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {bericht.title}
          </h1>
          {bericht.intro && (
            <p className="text-xl text-gray-600 leading-relaxed">{bericht.intro}</p>
          )}
        </div>
      </section>

      {/* Cover */}
      {bericht.cover && (
        <section className="bg-white pb-12">
          <div className="container-custom max-w-4xl">
            <div className="relative h-[300px] md:h-[480px] rounded-3xl overflow-hidden">
              <Image src={bericht.cover} alt={bericht.title} fill className="object-cover" priority />
            </div>
          </div>
        </section>
      )}

      {/* Tekst */}
      {bericht.body && (
        <section className="section-padding bg-white pt-0">
          <div className="container-custom max-w-3xl">
            <article
              className="text-gray-700 leading-relaxed prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: parseMarkdown(bericht.body) }}
            />
          </div>
        </section>
      )}

      {/* Foto's */}
      {bericht.fotos.length > 0 && (
        <section className="section-padding bg-gray-50 pt-0">
          <div className="container-custom max-w-5xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Foto&apos;s</h2>
            <PhotoGallery images={bericht.fotos} title={bericht.title} />
          </div>
        </section>
      )}
    </div>
  );
}
