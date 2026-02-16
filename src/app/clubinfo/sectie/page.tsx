"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  Target, 
  FileText, 
  Shield, 
  Users, 
  UserPlus, 
  Lock,
  CheckCircle,
  Mail,
  Phone,
  Download,
  FileDown
} from "lucide-react";
import { clubInfoSections, getClubInfoBySlug } from "@/lib/clubinfo";
import React from "react";

function ClubInfoContent() {
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug");
  const section = slug ? getClubInfoBySlug(slug) : null;

  const iconMap: { [key: string]: React.ElementType } = {
    target: Target,
    "file-text": FileText,
    shield: Shield,
    users: Users,
    "user-plus": UserPlus,
    lock: Lock
  };

  const Icon = section ? iconMap[section.icon] || Target : Target;

  // Format content with markdown-like styling
  const formatContent = (content: string) => {
    return content.split('\n').map((line, index) => {
      // Headers
      if (line.startsWith('**') && line.endsWith('**')) {
        return (
          <h3 key={index} className="text-xl font-bold text-gray-900 mt-8 mb-4">
            {line.replace(/\*\*/g, '')}
          </h3>
        );
      }
      // Subheaders (like **2. Aanwezigheid**)
      if (line.match(/^\*\*\d+\./)) {
        return (
          <h4 key={index} className="text-lg font-bold text-gray-900 mt-6 mb-3">
            {line.replace(/\*\*/g, '')}
          </h4>
        );
      }
      // Bullet points with indent
      if (line.startsWith('  * ')) {
        return (
          <li key={index} className="ml-12 mb-1 text-gray-700 list-disc">
            {line.replace('  * ', '')}
          </li>
        );
      }
      // Regular bullet points
      if (line.startsWith('- ') || line.startsWith('* ')) {
        return (
          <li key={index} className="ml-6 mb-2 text-gray-700 list-disc">
            {line.replace(/^[-*] /, '')}
          </li>
        );
      }
      // Empty lines
      if (line.trim() === '') {
        return <div key={index} className="h-2" />;
      }
      // Regular text
      return (
        <p key={index} className="text-gray-700 mb-3 leading-relaxed">
          {line}
        </p>
      );
    });
  };

  if (!section) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Sectie niet gevonden
          </h1>
          <p className="text-gray-600 mb-6">
            De pagina die je zoekt bestaat niet.
          </p>
          <Link
            href="/clubinfo"
            className="inline-flex items-center gap-2 text-primary font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Terug naar Clubinfo
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="bg-white border-b">
        <div className="container-custom py-4">
          <Link
            href="/clubinfo"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Terug naar overzicht
          </Link>
        </div>
      </div>

      {/* Header */}
      <section className="bg-white">
        <div className="container-custom py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                <Icon className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900">
                  {section.title}
                </h1>
                <p className="text-gray-600 mt-1">
                  {section.description}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="section-padding bg-white">
        <div className="container-custom max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* PDF Download Banner - ALTIJD bovenaan als er een PDF is */}
            {section.pdfUrl && (
              <div className="mb-10 p-6 bg-gradient-to-r from-primary to-primary-700 rounded-2xl text-white">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                    <FileDown className="w-7 h-7" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold mb-1">
                      Download dit document
                    </h3>
                    <p className="text-white/80 text-sm">
                      {section.pdfLabel || "Download de PDF versie"}
                    </p>
                  </div>
                  <a
                    href={section.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-white text-primary px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition-colors"
                  >
                    <Download className="w-5 h-5" />
                    Download PDF
                  </a>
                </div>
              </div>
            )}

            {/* Highlights */}
            {section.highlights && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                {section.highlights.map((highlight, index) => (
                  <div 
                    key={index}
                    className="flex items-center gap-3 p-4 bg-primary/5 rounded-xl"
                  >
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="font-medium text-gray-800">{highlight}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Main Content */}
            <div className="prose prose-lg max-w-none">
              {formatContent(section.content)}
            </div>

            {/* Special CTA for Registration */}
            {section.slug === "nieuwe-aansluiting" && (
              <div className="mt-12 p-8 bg-gradient-to-br from-primary to-primary-700 rounded-2xl text-white text-center">
                <h3 className="text-2xl font-bold mb-4">
                  Klaar om lid te worden?
                </h3>
                <p className="text-white/90 mb-6">
                  Vul het inschrijfformulier in en start je voetbalavontuur bij KWS Linkhout!
                </p>
                <a
                  href="https://docs.google.com/forms/d/e/1FAIpQLSdSw7GBB_yFZ3DDGCkTLJPwLjKzmTFX_8FlL0aOnxmqc43v9g/viewform"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-white text-primary px-8 py-3 rounded-xl font-bold hover:bg-gray-100 transition-colors"
                >
                  <UserPlus className="w-5 h-5" />
                  Inschrijfformulier invullen
                </a>
              </div>
            )}

            {/* Maak kennis met Lincy - Photo Section */}
            {section.slug === "api" && (
              <div className="mt-12 p-8 bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl border border-green-200">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  {/* Photo */}
                  <div className="flex-shrink-0">
                    <div className="relative">
                      <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-white shadow-xl">
                        <img 
                          src="/images/api/lincy.png" 
                          alt="Lincy Mechelmans - Club API"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white shadow-lg">
                        <Shield className="w-6 h-6" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      Maak kennis met Lincy
                    </h3>
                    <p className="text-green-700 font-medium mb-4">
                      Jouw vertrouwenspersoon binnen KWS Linkhout
                    </p>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      Lincy is mama van Axl & Loekas, speelde zelf voetbal bij de 'Tony Babes' en is nu als Club-API klaar om te luisteren naar jouw verhaal.
                    </p>
                    
                    {/* Quick Contact */}
                    <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                      <a 
                        href="mailto:api.kwslinkhout@gmail.com"
                        className="inline-flex items-center justify-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-green-700 transition-colors"
                      >
                        <Mail className="w-4 h-4" />
                        E-mail Lincy
                      </a>
                      <a 
                        href="tel:0494853610"
                        className="inline-flex items-center justify-center gap-2 bg-white text-green-700 border-2 border-green-600 px-5 py-2.5 rounded-xl font-medium hover:bg-green-50 transition-colors"
                      >
                        <Phone className="w-4 h-4" />
                        Bel (0494) 85.36.10
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Organigram Images Section */}
            {section.slug === "organigram" && (
              <div className="mt-12 space-y-8">
                {/* Hoofd Organigram */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    Structuur van de club
                  </h3>
                  <div className="relative overflow-hidden rounded-xl bg-gray-50">
                    <img 
                      src="/images/Organigram/organigram1.jpg" 
                      alt="Organigram KWS Linkhout - Structuur van de club"
                      className="w-full h-auto object-contain"
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-3 text-center">
                    Overzicht van alle cellen binnen KWS Linkhout
                  </p>
                </div>

                {/* Dagelijks Bestuur */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    Dagelijks Bestuur
                  </h3>
                  <div className="relative overflow-hidden rounded-xl bg-gray-50">
                    <img 
                      src="/images/Organigram/organigram2.jpg" 
                      alt="Dagelijks Bestuur KWS Linkhout"
                      className="w-full h-auto object-contain"
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-3 text-center">
                    Samenstelling van het Dagelijks Bestuur
                  </p>
                </div>
              </div>
            )}

            {/* PDF Download Bottom - nogmaals voor gemak */}
            {section.pdfUrl && (
              <div className="mt-12 p-6 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <FileText className="w-10 h-10 text-gray-400" />
                    <div>
                      <h4 className="font-bold text-gray-900">
                        {section.pdfLabel}
                      </h4>
                      <p className="text-sm text-gray-500">
                        PDF document • Printvriendelijk
                      </p>
                    </div>
                  </div>
                  <a
                    href={section.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-primary font-bold hover:underline"
                  >
                    <Download className="w-5 h-5" />
                    Download
                  </a>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Other Sections */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Andere onderwerpen
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {clubInfoSections
              .filter(s => s.slug !== section.slug)
              .slice(0, 3)
              .map((otherSection) => {
                const OtherIcon = iconMap[otherSection.icon] || Target;
                return (
                  <Link
                    key={otherSection.id}
                    href={`/clubinfo/sectie?slug=${otherSection.slug}`}
                    className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                      <OtherIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{otherSection.title}</h3>
                      <p className="text-sm text-gray-600 line-clamp-1">
                        {otherSection.description}
                      </p>
                    </div>
                  </Link>
                );
              })}
          </div>
        </div>
      </section>
    </div>
  );
}

// Main component wrapped in Suspense for useSearchParams
export default function ClubInfoDetailPage() {
  return (
    <React.Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    }>
      <ClubInfoContent />
    </React.Suspense>
  );
}
