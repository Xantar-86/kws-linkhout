"use client";

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
import { Organigram } from "@/components/clubinfo/Organigram";
import React from "react";
import type { LucideIcon } from "lucide-react";
import { PaginaKop } from "@/components/PaginaKop";

/**
 * Een clubinfo-sectie. Het adres is /clubinfo/<slug>; de server (page.tsx)
 * geeft de slug door en zorgt voor titel, beschrijving en canonical.
 */
export default function ClubInfoClient({ slug }: { slug: string }) {
  const section = getClubInfoBySlug(slug) ?? null;

  const iconMap: { [key: string]: LucideIcon } = {
    target: Target,
    "file-text": FileText,
    shield: Shield,
    users: Users,
    "user-plus": UserPlus,
    lock: Lock
  };

  const Icon = section ? iconMap[section.icon] || Target : Target;

  /**
   * De reglementen komen als platte tekst binnen, met sterretjes voor de
   * koppen en streepjes voor de opsommingen.
   *
   * Opsommingen worden hier per groep in één lijst gezet. Voordien kreeg elk
   * streepje zijn eigen los lijst-item zonder lijst eromheen: dat is geen
   * geldige opmaak, en een schermlezer kondigt dan tien keer "lijst met één
   * item" aan in plaats van één keer "lijst met tien items".
   */
  const formatContent = (content: string) => {
    const blokken: React.ReactNode[] = [];
    const koppen: { id: string; tekst: string }[] = [];
    let lijst: { tekst: string; diep: boolean }[] = [];

    /** Een kop wordt een anker: "5. Accommodatie" wordt "5-accommodatie". */
    const anker = (tekst: string) =>
      tekst
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

    const sluitLijst = () => {
      if (lijst.length === 0) return;
      blokken.push(
        <ul key={`lijst-${blokken.length}`}>
          {lijst.map((item, i) => (
            <li key={i} className={item.diep ? "ml-6" : undefined}>
              {item.tekst}
            </li>
          ))}
        </ul>,
      );
      lijst = [];
    };

    content.split("\n").forEach((regel, index) => {
      const kaal = regel.trim();

      if (regel.startsWith("  * ")) {
        lijst.push({ tekst: regel.replace("  * ", ""), diep: true });
        return;
      }
      if (kaal.startsWith("- ") || kaal.startsWith("* ")) {
        lijst.push({ tekst: kaal.replace(/^[-*] /, ""), diep: false });
        return;
      }

      sluitLijst();

      if (kaal === "") return;

      if (kaal.match(/^\*\*\d+\./)) {
        const tekst = kaal.replace(/\*\*/g, "");
        const id = anker(tekst);
        koppen.push({ id, tekst });
        blokken.push(
          <h4 key={index} id={id} className="scroll-mt-28 text-lg font-bold text-gray-900">
            {tekst}
          </h4>,
        );
        return;
      }
      if (kaal.startsWith("**") && kaal.endsWith("**")) {
        const tekst = kaal.replace(/\*\*/g, "");
        const id = anker(tekst);
        koppen.push({ id, tekst });
        blokken.push(
          <h3 key={index} id={id} className="heading-3 scroll-mt-28">
            {tekst}
          </h3>,
        );
        return;
      }

      blokken.push(<p key={index}>{regel}</p>);
    });

    sluitLijst();
    return { blokken, koppen };
  };

  if (!section) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="heading-3 mb-4">
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

      <PaginaKop
        terug={{ naar: "/clubinfo", label: "Terug naar clubinfo" }}
        opschrift="Clubinfo"
        icoon={Icon}
        titel={section.title}
        onder={section.description}
      />

      {/* Content */}
      <section className="section-padding bg-white">
        <div className="container-custom max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* PDF Download Banner - ALTIJD bovenaan als er een PDF is */}
            {section.pdfUrl && (
              <div className="korrel lichtrand relative mb-10 overflow-hidden rounded-2xl bg-inkt-950 p-6 text-white">
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

            {/* De tekst, met links een inhoudsopgave zodra het document
                genoeg hoofdstukken heeft om in te verdwalen. */}
            {(() => {
              const { blokken, koppen } = formatContent(section.content);
              const metOpgave = koppen.length >= 4;

              return (
                <div className={metOpgave ? "lg:flex lg:gap-12" : undefined}>
                  {metOpgave && (
                    <nav
                      aria-label="Op deze pagina"
                      className="mb-10 shrink-0 lg:sticky lg:top-28 lg:mb-0 lg:h-fit lg:w-56 lg:order-last"
                    >
                      <p className="opschrift mb-3">
                        <span aria-hidden="true" className="h-px w-6 bg-primary/40" />
                        Op deze pagina
                      </p>
                      <ul className="space-y-2 border-l border-zand-200 pl-4 text-sm">
                        {koppen.map((k) => (
                          <li key={k.id}>
                            <a
                              href={`#${k.id}`}
                              className="text-gray-500 transition-colors hover:text-primary"
                            >
                              {k.tekst}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </nav>
                  )}

                  <div className="lopende-tekst">{blokken}</div>
                </div>
              );
            })()}

            {/* Special CTA for Registration */}
            {section.slug === "nieuwe-aansluiting" && (
              <div className="korrel lichtrand relative mt-12 overflow-hidden rounded-2xl bg-inkt-950 p-8 text-center text-white">
                <h3 className="heading-3 mb-4 text-white">
                  Klaar om lid te worden?
                </h3>
                <p className="mb-6 text-white/70">
                  Op één pagina staat alles: de stappen, het lidgeld per leeftijd en bij wie je
                  terecht komt.
                </p>
                <a
                  href="/word-lid"
                  className="inline-flex items-center gap-2 bg-white text-primary px-8 py-3 rounded-xl font-bold hover:bg-gray-100 transition-colors"
                >
                  <UserPlus className="w-5 h-5" />
                  Naar Kom voetballen bij KWS Linkhout
                </a>
              </div>
            )}

            {/* Maak kennis met Lincy - Photo Section */}
            {section.slug === "api" && (
              <div className="mt-12 p-8 bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl border border-zand-200/70">
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
                      <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white shadow-lg">
                        <Shield className="w-6 h-6" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="heading-3 mb-2">
                      Maak kennis met Lincy
                    </h3>
                    <p className="text-primary font-medium mb-4">
                      Jouw vertrouwenspersoon binnen KWS Linkhout
                    </p>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      Lincy is mama van Axl & Loekas, speelde zelf voetbal bij de &apos;Tony Babes&apos; en is nu als Club-API klaar om te luisteren naar jouw verhaal.
                    </p>
                    
                    {/* Quick Contact */}
                    <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                      <a 
                        href="mailto:api.kwslinkhout@gmail.com"
                        className="inline-flex items-center justify-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl font-medium hover:bg-green-700 transition-colors"
                      >
                        <Mail className="w-4 h-4" />
                        E-mail Lincy
                      </a>
                      <a 
                        href="tel:0494853610"
                        className="inline-flex items-center justify-center gap-2 bg-white text-primary border-2 border-green-600 px-5 py-2.5 rounded-xl font-medium hover:bg-primary/5 transition-colors"
                      >
                        <Phone className="w-4 h-4" />
                        Bel (0494) 85.36.10
                      </a>
                    </div>
                  </div>
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

        {/* Het organigram staat buiten de smalle tekstkolom: zo'n breed schema
            is anders onleesbaar. */}
        {section.slug === "organigram" && (
          <div className="container-custom mt-12">
            <Organigram
              beelden={[
                {
                  bron: "/images/organigram/Organigram vzw.png",
                  titel: "De vzw",
                  onderschrift:
                    "Voorzitter, secretaris en bestuurders, seizoen 2026-2027",
                },
                {
                  bron: "/images/organigram/organigram kws linkhout.png",
                  titel: "Structuur van de club",
                  onderschrift:
                    "Van de vzw tot de cellen, de ploegen en de jeugdwerking",
                },
              ]}
            />
          </div>
        )}
      </section>

      {/* Other Sections */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <h2 className="heading-3 mb-8">
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
                    href={`/clubinfo/${otherSection.slug}`}
                    className="flex items-center gap-4 p-4 kaart hover:shadow-md transition-shadow"
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

