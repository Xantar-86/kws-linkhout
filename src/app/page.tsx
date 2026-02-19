"use client";

import { motion, useInView, animate, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";

import { 
  ArrowRight, 
  Trophy, 
  Users, 
  Calendar, 
  Users2,
  Clock,
  AlertTriangle,
  Camera,
  Shield,
  CreditCard,
  MapPin,
  X,
  BookOpen,
  Circle,
  CalendarDays
} from "lucide-react";

// Button component voor geschiedenis modal
function GeschiedenisButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  return (
    <>
      <button 
        onClick={() => setIsModalOpen(true)}
        className="btn-primary"
      >
        Ontdek onze geschiedenis
        <ArrowRight className="ml-2 w-4 h-4" />
      </button>
      <HistoryModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}

// Component voor tellende animatie
function AnimatedNumber({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [displayValue, setDisplayValue] = useState(0);
  
  useEffect(() => {
    if (isInView) {
      const controls = animate(0, value, {
        duration: 2,
        ease: "easeOut",
        onUpdate: (latest) => {
          setDisplayValue(Math.round(latest));
        }
      });
      return controls.stop;
    }
  }, [isInView, value]);

  return (
    <span ref={ref}>
      {displayValue}
      {suffix}
    </span>
  );
}

// Quick links data
const quickLinks = [
  {
    title: "Trainingsschema",
    icon: Clock,
    href: "/jeugdopleiding/trainingsschema-25-26",
    description: "Bekijk alle trainingstijden",
    color: "from-primary-600 to-primary-800"
  },
  {
    title: "Voetbalongeval",
    icon: AlertTriangle,
    href: "/medisch/voetbalongeval",
    description: "Meld een ongeval of blessure",
    color: "from-red-600 to-red-800"
  },
  {
    title: "Foto's",
    icon: Camera,
    href: "/fotos",
    description: "Bekijk onze fotogalerij",
    color: "from-primary-600 to-primary-800"
  }
];
// Modal component voor geschiedenis
function HistoryModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[85vh] overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-primary-900 via-primary-800 to-primary-700 p-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">Geschiedenis van de Club</h2>
                </div>
                <button
                  onClick={onClose}
                  className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
              
              {/* Content */}
              <div className="p-8 overflow-y-auto max-h-[calc(85vh-100px)]">
                <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
                  <h3 className="text-xl font-bold text-gray-900">De Beginjaren</h3>
                  <p>
                    Linkhout is een typisch Kempische gemeente in de Demervallei met de onverzettelijkheid die haar eigen is. 
                    Ook in de voetbalsport kwam dit tot uiting. Volgens annalen is WS Linkhout gestart in 1938. 
                    Op een zondagvoormiddag na de Hoogmis werden in café van Richard Pluymers de koppen bij mekaar gestoken. 
                    Die van de Sparta – ze voetbalden reeds in de zandkuil van Luyten – kwamen met de vraag om eens 
                    tegen het Dorp te voetballen. Dit eerste Linkhoutse treffen vond plaats in de wei aan Tist bij de Demer. 
                    En de overwinning smaakte zoet, heel zoet. Het recht op revanche werd gelicht en van het één kwam het ander. 
                    Uiteindelijk werd besloten om een eigen ploeg op te richten en de draad van de White-Star 
                    – een kortstondige ploeg in de jaren dertig – werd terug opgenomen.
                  </p>
                  
                  <div className="bg-primary/5 border-l-4 border-primary p-4 rounded-r-lg">
                    <p className="text-primary font-semibold italic m-0">
                      We tekenen 2011, na exact 73 jaar zal KWS Linkhout de eerste beginselen leggen aan de basis 
                      van de drie Linkhoutse vrouwenploegen...
                    </p>
                  </div>
                </div>
                
                {/* Close button */}
                <div className="mt-8 text-center">
                  <button
                    onClick={onClose}
                    className="btn-primary"
                  >
                    Sluiten
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// TypeWriter component met gekleurde woorden en emoji
function TypeWriter({ 
  text, 
  delay = 80, 
  highlightWord = "hart",
  highlightClass = "text-primary",
  emoji = "❤️"
}: { 
  text: string; 
  delay?: number;
  highlightWord?: string;
  highlightClass?: string;
  emoji?: string;
}) {
  const [displayText, setDisplayText] = useState("");
  const [index, setIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  
  useEffect(() => {
    if (index < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText((prev) => prev + text[index]);
        setIndex((prev) => prev + 1);
      }, delay);
      return () => clearTimeout(timeout);
    } else {
      setIsComplete(true);
      // Emoji verschijnt 300ms nadat typen klaar is
      setTimeout(() => setShowEmoji(true), 300);
    }
  }, [index, text, delay]);

  // Splits tekst en highlight het woord
  const renderText = () => {
    if (!displayText.includes(highlightWord)) {
      return displayText;
    }
    
    const parts = displayText.split(highlightWord);
    return (
      <>
        {parts[0]}
        <span className={highlightClass}>{highlightWord}</span>
        {parts[1] || ""}
      </>
    );
  };

  return (
    <span className="relative">
      {renderText()}
      {showEmoji && (
        <motion.span 
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="inline-block ml-2"
        >
          {emoji}
        </motion.span>
      )}
      {!isComplete && (
        <span className="absolute -right-1 top-0 h-full w-0.5 bg-primary animate-pulse" />
      )}
    </span>
  );
}

// Component voor de volgende wedstrijd
function VolgendeWedstrijd({ 
  apiUrl, 
  kalenderUrl, 
  titel = "Volgende Wedstrijd",
  kleur = "primary"
}: { 
  apiUrl: string; 
  kalenderUrl: string; 
  titel?: string;
  kleur?: "primary" | "pink";
}) {
  const [wedstrijd, setWedstrijd] = useState<{
    summary: string;
    start: Date;
    location: string;
    description: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWedstrijden() {
      try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        
        if (data.volgende) {
          setWedstrijd({
            ...data.volgende,
            start: new Date(data.volgende.start)
          });
        }
      } catch (error) {
        console.error("Fout bij ophalen wedstrijden:", error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchWedstrijden();
  }, [apiUrl]);

  const kleurClasses = kleur === "pink" 
    ? "bg-pink-600 text-pink-600"
    : "bg-primary text-primary";

  const badgeClasses = kleur === "pink"
    ? "bg-pink-100 text-pink-700"
    : "bg-primary/10 text-primary";

  if (loading) {
    return (
      <section className="py-6 bg-gray-50">
        <div className="container-custom">
          <div className="bg-white rounded-2xl p-6 shadow-xl animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-4"></div>
            <div className="h-12 bg-gray-200 rounded w-1/2 mx-auto"></div>
          </div>
        </div>
      </section>
    );
  }

  // Fallback als er geen wedstrijd is of de fetch faalde
  if (!wedstrijd) {
    return (
      <section className="py-6 bg-gray-50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl p-6 md:p-8 shadow-xl border border-gray-100"
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className={`${badgeClasses} rounded-xl p-4`}>
                  <Calendar className="w-10 h-10" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{titel}</h3>
                  <p className="text-gray-600">Bekijk alle aankomende wedstrijden</p>
                </div>
              </div>
              <a
                href={kalenderUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Kalender bekijken
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  const dagen = ["Zo", "Ma", "Di", "Wo", "Do", "Vr", "Za"];
  const maanden = ["jan", "feb", "mrt", "apr", "mei", "jun", "jul", "aug", "sep", "okt", "nov", "dec"];
  
  const dagNaam = dagen[wedstrijd.start.getDay()];
  const dagNummer = wedstrijd.start.getDate();
  const maand = maanden[wedstrijd.start.getMonth()];
  const uur = wedstrijd.start.getHours().toString().padStart(2, "0");
  const minuten = wedstrijd.start.getMinutes().toString().padStart(2, "0");

  return (
    <section className="py-6 bg-gray-50">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-2xl p-6 md:p-8 shadow-xl border border-gray-100"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Linker kant - Datum */}
            <div className="flex items-center gap-4">
              <div className={`${kleurClasses.split(' ')[0]} text-white rounded-xl p-4 text-center min-w-[80px]`}>
                <div className="text-sm font-medium uppercase">{dagNaam}</div>
                <div className="text-3xl font-bold">{dagNummer}</div>
                <div className="text-sm">{maand}</div>
              </div>
              <div className="text-gray-600">
                <div className="text-sm">Aftrap</div>
                <div className="text-2xl font-bold text-gray-900">{uur}:{minuten}</div>
              </div>
            </div>

            {/* Midden - Wedstrijd info */}
            <div className="flex-1 text-center">
              <span className={`inline-block px-3 py-1 ${badgeClasses} rounded-full text-sm font-medium mb-2`}>
                {titel}
              </span>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 flex items-center justify-center gap-2">
                {kleur === "primary" && <span className="text-2xl">⚽</span>}
                {wedstrijd.summary}
              </h3>
              {wedstrijd.location && (
                <div className="flex items-center justify-center gap-1 text-gray-500 mt-2">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{wedstrijd.location}</span>
                </div>
              )}
            </div>

            {/* Rechter kant - CTA */}
            <a
              href={kalenderUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary whitespace-nowrap"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Volledige kalender
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section - ROOD, compacter */}
      <section className="relative min-h-[500px] md:min-h-[400px] py-12 md:py-0 md:h-[48vh] flex items-center justify-center overflow-hidden">
        {/* Rode achtergrond */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700" />
        
        <div className="container-custom relative z-10 text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col md:flex-row items-center gap-8 md:gap-12"
          >
            {/* Logo - Links */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex-shrink-0"
            >
              <div className="relative w-28 h-28 md:w-36 md:h-36 drop-shadow-[0_0_15px_rgba(255,255,255,0.6)]">
                <Image
                  src="/images/kwslinkhout-logo.png"
                  alt="KWS Linkhout"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </motion.div>

            {/* Tekst - Rechts */}
            <div className="text-center md:text-left">
              <span className="inline-block px-3 py-1.5 md:px-4 md:py-2 bg-white/10 backdrop-blur-sm rounded-full text-xs md:text-sm font-medium mb-3 md:mb-4">
                Stamnummer 03531 • Est. 1938
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold mb-3 md:mb-4 tracking-tight">
                KWS Linkhout
              </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-white/90 mb-6 md:mb-8 max-w-2xl mx-auto md:mx-0">
              Meer dan voetbal. Een familie. Een passie. Een traditie sinds 1938.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center md:justify-start">
              <Link href="/ploegen" className="btn-primary bg-white text-primary hover:bg-gray-100 text-sm md:text-base">
                Ontdek Onze 22 Ploegen
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
              <Link href="/clubinfo/sectie?slug=nieuwe-aansluiting" className="btn-secondary border-white text-white hover:bg-white/10 text-sm md:text-base">
                Word Lid
              </Link>
            </div>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-white/50 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* VOLGENDE WEDSTRIJDEN - Heren en Dames */}
      <VolgendeWedstrijd 
        apiUrl="/api/wedstrijden" 
        kalenderUrl="https://www.rbfa.be/nl/club/1595/ploeg/337162/kalender"
        titel="Heren - Volgende Wedstrijd"
        kleur="primary"
      />
      <VolgendeWedstrijd 
        apiUrl="/api/wedstrijden/dames" 
        kalenderUrl="https://www.rbfa.be/nl/club/1595/ploeg/337160/kalender"
        titel="Dames - Volgende Wedstrijd"
        kleur="pink"
      />

      {/* Foto Section - SCHUIN KADER */}
      <section className="py-16 md:py-24 bg-gray-50 overflow-hidden">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Tekst links */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="heading-2 mb-6 min-h-[3rem]">
  <TypeWriter text="Een club met een hart" delay={80} highlightWord="hart" />
</h2>
              <p className="text-body mb-6">
                Bij KWS Linkhout draait het niet alleen om voetbal. Het gaat om 
                vriendschap, respect en samen groeien. Van onze jongste U6-spelers 
                tot onze veteranen - iedereen telt mee.
              </p>
              <p className="text-body mb-8">
                Met 22 ploegen, waaronder 5 meisjesploegen, is er voor ieder 
                wat wils. Kom eens langs en ervaar de unieke sfeer zelf!
              </p>
              <GeschiedenisButton />
            </motion.div>

            {/* Foto rechts - SCHUIN */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              {/* Decoratieve achtergrond */}
              <div className="absolute -inset-4 bg-primary/10 rounded-3xl transform rotate-3" />
              
              {/* Hoofd foto */}
              <div className="relative transform -rotate-2 hover:rotate-0 transition-transform duration-500">
                <div className="bg-white p-4 rounded-2xl shadow-2xl">
                  <img 
                    src="/images/foto-homepage.jpg" 
                    alt="KWS Linkhout teams"
                    className="w-full h-auto rounded-lg"
                  />
                  <p className="text-center text-sm text-gray-500 mt-3 font-medium">
                    Onze trots: 22 ploegen, 250+ leden
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Quick Stats Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Trophy, label: "Opgericht", value: 1938, suffix: "" },
              { icon: Users, label: "Actieve Leden", value: 250, suffix: "+" },
              { icon: Calendar, label: "Ploegen", value: 22, suffix: "" },
              { icon: Users2, label: "Damesploegen", value: 5, suffix: "" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-50 rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-shadow"
              >
                <stat.icon className="w-8 h-8 text-primary mx-auto mb-3" />
                <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                  <AnimatedNumber value={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-gray-600 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* LAATSTE NIEUWS - Digitaal Betalen & Documenten Mutualiteit */}
      <section className="py-16 bg-gray-100">
        <div className="container-custom">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-center mb-8 text-gray-900"
          >
            Laatste <span className="text-primary">nieuws</span>
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 max-w-4xl mx-auto">
            <Link href="/digitaal-betalen">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer h-full"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <CreditCard className="w-7 h-7 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      Digitaal Betalen
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Betaal voortaan ook digitaal @ KWS Linkhout
                    </p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400" />
                </div>
              </motion.div>
            </Link>

            <Link href="/documenten-mutualiteit">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer h-full"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Shield className="w-7 h-7 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      Documenten Mutualiteit
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Download hier je formulier voor de mutualiteiten
                    </p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400" />
                </div>
              </motion.div>
            </Link>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Aankomende <span className="text-primary">evenementen</span>
            </h2>
            <p className="text-gray-600">Noteer deze data alvast in je agenda</p>
          </motion.div>

          {/* Events Preview - Alleen toekomstige events */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {[
              {
                title: "Pasta Take-A-Way",
                date: "13-14 Maart",
                description: "Heerlijke pasta om mee te nemen",
                color: "from-red-500 to-red-700"
              },
              {
                title: "Voetbalkamp Meisjes",
                date: "8-9-10 April",
                description: "Drie dagen voetbalplezier voor onze meisjes",
                color: "from-pink-500 to-pink-700"
              },
              {
                title: "Paasvoetbalkamp",
                date: "15-16-17 April",
                description: "Traditioneel paasvoetbalkamp voor alle jeugd",
                color: "from-green-500 to-green-700"
              }
            ].map((event, index) => (
              <Link key={event.title} href="/nieuws/events" className="group">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer h-full"
                >
                  <div className={`bg-gradient-to-r ${event.color} p-4`}>
                    <div className="flex items-center justify-between">
                      <CalendarDays className="w-5 h-5 text-white/80" />
                      <span className="text-white font-semibold text-sm">{event.date}</span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">{event.title}</h3>
                    <p className="text-gray-600 text-sm">{event.description}</p>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Link
              href="/nieuws/events"
              className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-full font-semibold hover:bg-primary-700 transition-colors"
            >
              <Calendar className="w-5 h-5" />
              Bekijk alle evenementen
            </Link>
          </motion.div>
        </div>
      </section>

      {/* MEDIA SECTION - Video's */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              KWS Linkhout in de <span className="text-primary">media</span>
            </h2>
            <p className="text-gray-600">Bekijk onze club in actie</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Facebook Video */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-2xl overflow-hidden shadow-lg"
            >
              <div className="aspect-video w-full">
                <iframe 
                  src="https://www.facebook.com/plugins/video.php?height=314&href=https%3A%2F%2Fwww.facebook.com%2F61559748434812%2Fvideos%2F3867308740206273%2F&show_text=false&width=560&t=0" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 'none', overflow: 'hidden' }}
                  scrolling="no" 
                  frameBorder="0" 
                  allowFullScreen={true}
                  allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                  className="w-full h-full"
                />
              </div>
              <div className="p-4">
                <p className="text-sm text-gray-500">Facebook Video</p>
              </div>
            </motion.div>

            {/* YouTube Video */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white rounded-2xl overflow-hidden shadow-lg"
            >
              <div className="aspect-video w-full">
                <iframe
                  width="100%"
                  height="100%"
                  src="https://www.youtube.com/embed/QUi0ghNOScw"
                  title="KWS Linkhout Video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
              <div className="p-4">
                <p className="text-sm text-gray-500">YouTube Video</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* QUICK LINKS CARDS - Nieuw! */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-center mb-8 text-gray-900"
          >
            Snel naar <span className="text-primary">...</span>
          </motion.h2>
          
          {/* 3 tegels in 1 rij */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {quickLinks.map((link, index) => (
              <motion.div
                key={link.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="h-full"
              >
                <Link href={link.href} className="group block h-full">
                  <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 h-full flex flex-col">
                    {/* Header met gradient */}
                    <div className={`bg-gradient-to-r ${link.color} p-4 text-center`}>
                      <h3 className="text-white font-semibold text-sm">
                        {link.title}
                      </h3>
                    </div>
                    
                    {/* Icon area */}
                    <div className="p-6 flex flex-col items-center flex-1">
                      <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-3 group-hover:bg-primary/10 transition-colors">
                        <link.icon className="w-10 h-10 text-gray-800 group-hover:text-primary transition-colors" />
                      </div>
                      <p className="text-gray-600 text-sm text-center">
                        {link.description}
                      </p>
                      <div className="mt-auto pt-3 flex items-center text-primary font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                        Ga naar <ArrowRight className="ml-1 w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SPONSORS SECTION */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Onze <span className="text-primary">Sponsors</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              KWS Linkhout dankt zijn succes aan de steun van onze gewaardeerde sponsors. 
              Samen maken we het verschil!
            </p>
          </motion.div>

          {/* Sponsors Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {[
              { name: "Roof Projects", image: "/images/sponsors/roof-projects.png" },
              { name: "Salesforce", image: "/images/sponsors/Salesforce.png" },
              { name: "De Backer", image: "/images/sponsors/de-backer.jpeg" },
              { name: "Lumen", image: "/images/sponsors/lumen.png" },
              { name: "PD Bouw", image: "/images/sponsors/pd-bouw.png" },
              { name: "AA Drink", image: "/images/sponsors/aa-drink.png" },
              { name: "Spar", image: "/images/sponsors/spar.jpg" },
            ].map((sponsor, index) => (
              <motion.div
                key={sponsor.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <div className="bg-gray-50 rounded-2xl p-6 h-32 flex items-center justify-center shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 hover:border-primary/20">
                  <img
                    src={sponsor.image}
                    alt={sponsor.name}
                    className="max-h-full max-w-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300 opacity-70 group-hover:opacity-100"
                  />
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA voor sponsors */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <p className="text-gray-500 text-sm mb-4">
              Ook sponsor worden? Neem contact met ons op!
            </p>
            <Link 
              href="/contact" 
              className="inline-flex items-center text-primary font-medium hover:underline"
            >
              Contacteer ons
              <ArrowRight className="ml-1 w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}