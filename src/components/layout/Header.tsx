"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown } from "lucide-react";
import { teams, getTeamsByCategory } from "@/lib/teams";

// Navigation Data - MET JUISTE LINKS
const navItems = [
  { name: "Home", href: "/" },
  {
    name: "Seniorenploegen",
    href: "/ploegen",
    dropdown: getTeamsByCategory("senioren").map(team => ({
      name: team.name,
      href: `/ploegen/team?slug=${team.slug}`,
    })),
  },
  {
    name: "Damesploegen",
    href: "/ploegen",
    dropdown: [
      { name: "Over ons", href: "/ploegen/dames-over-ons" },
      ...getTeamsByCategory("dames").map(team => ({
        name: team.name,
        href: `/ploegen/team?slug=${team.slug}`,
      })),
    ],
  },
  {
    name: "Jeugdploegen",
    href: "/ploegen",
    dropdown: getTeamsByCategory("jeugd").map(team => ({
      name: team.name,
      href: `/ploegen/team?slug=${team.slug}`,
    })),
  },
  {
    name: "Nieuws",
    href: "/nieuws",
    dropdown: [
      { name: "Evenementen", href: "/nieuws/events" },
      { name: "Laatste Nieuws", href: "/nieuws" },
      { name: "Nieuwsbrief", href: "/nieuwsbrief" },
      { name: "In de Krant", href: "/in-de-krant" },
    ],
  },
  {
    name: "Jeugd",
    href: "/jeugdopleiding",
    dropdown: [
      { name: "Overzicht", href: "/jeugdopleiding" },
      { name: "Trainingsschema", href: "/jeugdopleiding/trainingsschema-25-26" },
      { name: "Opleidingsvisie VFV", href: "/jeugdopleiding/opleidingsvisie-vfv" },
      { name: "Opleidingsplan", href: "/jeugdopleiding/opleidingsplan" },
      { name: "Fair Play", href: "/jeugdopleiding/fair-play" },
      { name: "Panathlon Charter", href: "/jeugdopleiding/panathloncharter" },
      { name: "Anti-Racisme", href: "/jeugdopleiding/charter-anti-racisme" },
      { name: "Foot Pass", href: "/jeugdopleiding/foot-pass" },
    ],
  },
  {
    name: "Medisch",
    href: "/medisch",
    dropdown: [
      { name: "Voorstelling", href: "/medisch" },
      { name: "Voetbalongeval", href: "/medisch/voetbalongeval" },
      { name: "Medische Omkadering", href: "/medisch/medische-omkadering" },
      { name: "Reanimatie & Defibrillator", href: "/medisch/reanimatie-defibrillator" },
      { name: "Veilig Vervoer Kinderen", href: "/medisch/veilig-vervoer-kinderen" },
      { name: "Voeding", href: "/medisch/voeding" },
      { name: "Alcohol", href: "/medisch/alcohol" },
    ],
  },
  {
    name: "Clubinfo",
    href: "/clubinfo",
    dropdown: [
      { name: "Missie & Visie", href: "/clubinfo/sectie?slug=missie-visie" },
      { name: "Huishoudelijk Reglement", href: "/clubinfo/sectie?slug=huishoudelijk-reglement" },
      { name: "API (Integriteit)", href: "/clubinfo/sectie?slug=api" },
      { name: "Organigram", href: "/clubinfo/sectie?slug=organigram" },
      { name: "Nieuwe Aansluiting", href: "/clubinfo/sectie?slug=nieuwe-aansluiting" },
      { name: "Privacyverklaring", href: "/clubinfo/sectie?slug=privacyverklaring" },
    ],
  },
  { name: "Foto's", href: "/fotos" },
  { name: "Contact", href: "/contact" },
];

function NavDropdown({ 
  item, 
  isOpen, 
  onMouseEnter, 
  onMouseLeave,
  scrolled
}: { 
  item: typeof navItems[0]; 
  isOpen: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  scrolled: boolean;
}) {
  const linkClasses = scrolled 
    ? "text-gray-700 hover:text-primary" 
    : "text-white/90 hover:text-white";
  
  if (!item.dropdown) {
    return (
      <Link 
        href={item.href}
        className={`${linkClasses} font-medium transition-colors py-2`}
      >
        {item.name}
      </Link>
    );
  }

  return (
    <div 
      className="relative"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <Link 
        href={item.href}
        className={`flex items-center ${linkClasses} font-medium transition-colors py-2`}
      >
        {item.name}
        <ChevronDown className={`ml-1 w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </Link>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50"
          >
            <div className="max-h-96 overflow-y-auto">
              {item.dropdown.map((subItem) => (
                <Link
                  key={subItem.name}
                  href={subItem.href}
                  className="block px-4 py-3 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary transition-colors border-b border-gray-50 last:border-0"
                >
                  {subItem.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    
    // Check initial scroll position
    handleScroll();
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled 
        ? "bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm" 
        : "bg-primary border-b border-primary-700"
    }`}>
      <div className="flex items-center h-20">
        {/* Logo - Helemaal links */}
        <Link href="/" className="flex items-center flex-shrink-0 pl-4 lg:pl-6">
          <div className="relative w-14 h-14 lg:w-16 lg:h-16">
            <Image
              src="/images/kwslinkhout-logo.png"
              alt="KWS Linkhout"
              fill
              className="object-contain"
              priority
            />
          </div>
        </Link>

        {/* Navigation - Centraal/Rest van ruimte */}
        <div className="flex-1 container-custom">
          <div className="flex items-center justify-end lg:justify-between h-20">
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navItems.map((item) => (
                <NavDropdown
                  key={item.name}
                  item={item}
                  isOpen={openDropdown === item.name}
                  onMouseEnter={() => setOpenDropdown(item.name)}
                  onMouseLeave={() => setOpenDropdown(null)}
                  scrolled={scrolled}
                />
              ))}
            </nav>

            {/* Mobile Menu Button */}
            <button
              className={`lg:hidden p-2 rounded-lg transition-colors ${
                scrolled ? "hover:bg-gray-100" : "hover:bg-white/20"
              }`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className={`w-6 h-6 ${scrolled ? "text-gray-700" : "text-white"}`} />
              ) : (
                <Menu className={`w-6 h-6 ${scrolled ? "text-gray-700" : "text-white"}`} />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t border-gray-100 max-h-[calc(100vh-80px)] overflow-y-auto"
          >
            <nav className="container-custom py-4 space-y-2 pb-8">
              {navItems.map((item) => (
                <div key={item.name}>
                  <Link
                    href={item.href}
                    className="block py-3 text-gray-700 font-medium hover:text-primary"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                  {item.dropdown && (
                    <div className="pl-4 space-y-1 border-l-2 border-gray-100 ml-2">
                      {item.dropdown.map((subItem) => (
                        <Link
                          key={subItem.name}
                          href={subItem.href}
                          className="block py-2 text-sm text-gray-600 hover:text-primary"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
