import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Calendar, Mail } from "lucide-react";
import { notFound } from "next/navigation";
import { getAllNieuwsbrieven, getNieuwsbriefBySlug } from "@/lib/nieuwsbrieven";
import { parseMarkdown } from "@/lib/markdown";

type Params = { slug: string };

export async function generateStaticParams() {
  const list = await getAllNieuwsbrieven();
  return list.map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const n = await getNieuwsbriefBySlug(slug);
  if (!n) return { title: "Nieuwsbrief niet gevonden - KWS Linkhout" };
  return {
    title: `${n.title} - Nieuwsbrief KWS Linkhout`,
    description: n.preview || n.title,
    openGraph: {
      title: n.title,
      description: n.preview || n.title,
      type: "article",
      images: [{ url: "https://www.kwslinkhout.be/images/logo-kws.jpg" }],
    },
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

export default async function NieuwsbriefDetailPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const n = await getNieuwsbriefBySlug(slug);
  if (!n) notFound();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back */}
      <div className="bg-white border-b">
        <div className="container-custom py-4">
          <Link href="/nieuwsbrief" className="inline-flex items-center gap-2 text-gray-600 hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Terug naar nieuwsbrieven
          </Link>
        </div>
      </div>

      {/* Header */}
      <section className="bg-white">
        <div className="container-custom py-12 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
            <Mail className="w-4 h-4" />
            Nieuwsbrief
          </div>
          {n.date && (
            <div className="inline-flex items-center gap-1.5 text-gray-500 mb-4 ml-3">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(n.date)}</span>
            </div>
          )}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">{n.title}</h1>
          {n.preview && (
            <p className="text-xl text-gray-600 leading-relaxed">{n.preview}</p>
          )}
        </div>
      </section>

      {/* Body */}
      {n.body && (
        <section className="section-padding bg-white pt-0">
          <div className="container-custom max-w-3xl">
            <article
              className="text-gray-700 leading-relaxed prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: parseMarkdown(n.body) }}
            />
          </div>
        </section>
      )}
    </div>
  );
}
