import Link from "next/link";
import { Facebook, Mail, MapPin, Phone } from "lucide-react";

const footerLinks = {
  club: [
    { name: "Clubinfo", href: "/clubinfo" },
    { name: "Nieuwe Aansluiting", href: "/clubinfo/sectie?slug=nieuwe-aansluiting" },
    { name: "API (Integriteit)", href: "/clubinfo/sectie?slug=api" },
    { name: "Organigram", href: "/clubinfo/sectie?slug=organigram" },
  ],
  jeugd: [
    { name: "Jeugdopleiding", href: "/jeugdopleiding" },
    { name: "Trainingsschema", href: "/jeugdopleiding/trainingsschema-25-26" },
    { name: "Opleidingsplan", href: "/jeugdopleiding/opleidingsplan" },
    { name: "Fair Play", href: "/jeugdopleiding/fair-play" },
  ],
  info: [
    { name: "Nieuws", href: "/nieuws" },
    { name: "Nieuwsbrief", href: "/nieuwsbrief" },
    { name: "In de Krant", href: "/in-de-krant" },
    { name: "Contact", href: "/contact" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Club Info */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 relative">
                <img 
                  src="/images/kwslinkhout-logo.png" 
                  alt="KWS Linkhout" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <span className="block text-lg font-bold">KWS Linkhout</span>
                <span className="text-sm text-gray-400">Stamnummer 03531</span>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Koninklijke White Star Linkhout. 
              Een familiale voetbalclub met meer dan 85 jaar geschiedenis.
            </p>
            <div className="flex gap-4">
              <a 
                href="https://www.facebook.com/kwslinkhout" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary transition-colors"
                aria-label="Facebook KWS Linkhout"
              >
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Club</h3>
            <ul className="space-y-3">
              {footerLinks.club.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href} 
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6">Jeugd</h3>
            <ul className="space-y-3">
              {footerLinks.jeugd.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href} 
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <a 
                  href="https://www.google.com/maps/search/?api=1&query=Kapelstraat+72,+3560+Linkhout"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Kapelstraat 72<br />
                  3560 Linkhout
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                <a href="tel:013444757" className="text-gray-400 hover:text-white transition-colors text-sm">
                  013 44 47 57
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                <a href="mailto:info@kwslinkhout.be" className="text-gray-400 hover:text-white transition-colors text-sm">
                  info@kwslinkhout.be
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} KWS Linkhout. Alle rechten voorbehouden.
          </p>
          <p className="text-gray-500 text-sm">
            Gemaakt met een ♥ voor de club.
          </p>
        </div>
      </div>
    </footer>
  );
}