import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Calendar, Mail } from "lucide-react";
import { notFound } from "next/navigation";
import { getAllNieuwsbrieven, getNieuwsbriefBySlug } from "@/lib/nieuwsbrieven";
import { parseMarkdown } from "@/lib/markdown";
import { PaginaKop } from "@/components/PaginaKop";

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

      <PaginaKop
        terug={{ naar: "/nieuwsbrief", label: "Terug naar de nieuwsbrieven" }}
        opschrift={n.date ? formatDate(n.date) : "Nieuwsbrief"}
        titel={n.title}
        onder={n.preview}
      />

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
