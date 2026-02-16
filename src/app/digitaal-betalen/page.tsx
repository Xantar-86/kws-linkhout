"use client";

import { motion } from "framer-motion";
import { CreditCard, ArrowLeft, Download, QrCode, HelpCircle, Smartphone } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// Afbeelding paden
const FOTO1 = "/images/digitaal-betalen/foto1.PNG";
const FOTO2 = "/images/digitaal-betalen/foto2.PNG";
const FOTO3 = "/images/digitaal-betalen/foto3.PNG";
const FOTO4 = "/images/digitaal-betalen/foto4.PNG";
const QR1 = "/images/digitaal-betalen/qr1.png";
const QR2 = "/images/digitaal-betalen/qr2.png";

export default function DigitaalBetalenPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="bg-white border-b">
        <div className="container-custom py-4">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Terug naar home
          </Link>
        </div>
      </div>

      {/* Hero */}
      <section className="py-16" style={{ background: 'linear-gradient(to bottom right, #8c1d1c, #a82424, #8c1d1c)' }}>
        <div className="container-custom text-center text-white">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6 }}
          >
            <CreditCard className="w-16 h-16 mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Digitaal betalen
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Beste KWS&apos;ers, vanaf heden is het mogelijk om ook digitaal te betalen @ KWS Linkhout.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="section-padding">
        <div className="container-custom max-w-4xl">
          {/* Intro */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="rounded-2xl p-8 mb-8"
            style={{ backgroundColor: '#8c1d1c20', border: '1px solid #8c1d1c40' }}
          >
            <p className="text-lg leading-relaxed" style={{ color: '#8c1d1c' }}>
              Hieronder geven we een korte beschrijving van de mogelijkheden.
            </p>
          </motion.div>

          {/* Betaalmogelijkheden */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-8"
          >
            <div className="text-white px-6 py-4" style={{ backgroundColor: '#8c1d1c' }}>
              <h2 className="text-xl font-bold">Betalen kan met:</h2>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">KWS Clubkaart</h3>
                  <p className="text-gray-600">
                    Een clubkaart kan u verkrijgen aan de toog mits het betalen van 2,5 euro waarborg. 
                    Indien u uw clubkaart heeft opgeladen, moet u enkel bij het afrekenen uw kaart op 
                    de kaartlezer leggen. It&apos;s that easy! Clubkaart niet meer nodig? Wissel deze dan 
                    terug in en u ontvangt uw waarborg terug alsook de eventuele tegoeden op de kaart.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <QrCode className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Payconiq</h3>
                  <p className="text-gray-600">
                    Indien u met payconiq wil afrekenen, kan u de QR code op de klantendisplay scannen 
                    met uw Bancontact of Payconiq app. Pay with a beep!
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-gray-600 font-bold">€</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Cash</h3>
                  <p className="text-gray-600">
                    Contant betalen zal nog steeds mogelijk zijn.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Opladen */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-8"
          >
            <div className="bg-amber-500 text-white px-6 py-4">
              <h2 className="text-xl font-bold">Hoe kan ik mijn clubkaart opladen?</h2>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-amber-600 font-bold">€</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Cash</h3>
                  <p className="text-gray-600">
                    U betaalt cash aan de toog en een medewerker kan uw kaart onmiddellijk opwaarderen.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Smartphone className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Via de Knip app</h3>
                  <p className="text-gray-600 mb-4">
                    (via Payconiq, Bancontact, Mastercard of Visa) - De beste en makkelijkste manier in 4 makkelijke stappen:
                  </p>

                  <div className="space-y-6 mt-4">
                    {/* Stap 1 */}
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="font-semibold text-gray-900 mb-3">1. Bestel een kaart aan de toog (2,5 euro waarborg), installeer en open de Knip app en scan de QR code van uw kaart</p>
                      <div className="relative w-full max-w-sm mx-auto aspect-[3/4] rounded-lg overflow-hidden shadow-md">
                        <Image
                          src={FOTO1}
                          alt="Stap 1: QR code scannen met Knip app"
                          fill
                          className="object-contain"
                        />
                      </div>
                    </div>

                    {/* Stap 2 */}
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="font-semibold text-gray-900 mb-3">2. Nadat u uw kaart heeft geregistreerd, kan u in de Knip app op Rekeningen/Accounts klikken</p>
                      <div className="relative w-full max-w-sm mx-auto aspect-[3/4] rounded-lg overflow-hidden shadow-md">
                        <Image
                          src={FOTO2}
                          alt="Stap 2: Accounts/Rekeningen scherm"
                          fill
                          className="object-contain"
                        />
                      </div>
                    </div>

                    {/* Stap 3 */}
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="font-semibold text-gray-900 mb-3">3. Via het witte bolletje kan u het opwaarderen starten</p>
                      <div className="relative w-full max-w-sm mx-auto aspect-[3/4] rounded-lg overflow-hidden shadow-md">
                        <Image
                          src={FOTO3}
                          alt="Stap 3: Wit bolletje voor opwaarderen"
                          fill
                          className="object-contain"
                        />
                      </div>
                    </div>

                    {/* Stap 4 */}
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="font-semibold text-gray-900 mb-3">4. Kies het juiste bedrag en reken af met de gewenste betaalmogelijkheid</p>
                      <div className="relative w-full max-w-sm mx-auto aspect-[3/4] rounded-lg overflow-hidden shadow-md">
                        <Image
                          src={FOTO4}
                          alt="Stap 4: Bedrag kiezen en afrekenen"
                          fill
                          className="object-contain"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Vragen */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="bg-green-50 rounded-2xl p-8 border border-green-100 mb-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <HelpCircle className="w-6 h-6 text-green-600" />
              <h3 className="text-xl font-bold text-green-900">Heeft u nog vragen?</h3>
            </div>
            <p className="text-green-800">
              Vraag hulp aan een KWS medewerker of bekijk hier de veelgestelde vragen.
            </p>
            <p className="text-green-800 mt-2">
              Om het proces te vergemakkelijken, kan u de Knip app reeds thuis installeren en registreren, zonder een kaart toe te voegen.
            </p>
          </motion.div>

          {/* Download Knip App */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
          >
            <div className="bg-gray-900 text-white px-6 py-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Download className="w-5 h-5" />
                Hier kan u alvast de Knip App downloaden
              </h2>
            </div>
            <div className="p-6 space-y-6">
              {/* iOS */}
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 mb-2">Klik hier voor iOS of scan de QR-code met je telefoon:</h3>
                  <a 
                    href="https://apps.apple.com/nl/app/knip/id1034721738" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Download voor iOS
                  </a>
                </div>
                <div className="w-32 h-32 relative rounded-lg overflow-hidden flex-shrink-0 shadow-md">
                  <Image
                    src={QR1}
                    alt="QR code voor iOS download"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>

              <hr className="border-gray-200" />

              {/* Android */}
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 mb-2">Klik hier voor Android of scan de QR-code met je telefoon:</h3>
                  <a 
                    href="https://play.google.com/store/apps/details?id=nl.lecreditsportif.knip&hl=nl" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-green-600 hover:text-green-800 font-medium"
                  >
                    Download voor Android
                  </a>
                </div>
                <div className="w-32 h-32 relative rounded-lg overflow-hidden flex-shrink-0 shadow-md">
                  <Image
                    src={QR2}
                    alt="QR code voor Android download"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
