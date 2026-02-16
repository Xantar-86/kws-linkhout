"use client";

import { motion } from "framer-motion";
import { FileText, ArrowLeft, Target, Dribbble, Users } from "lucide-react";
import Link from "next/link";

const leeftijdsgroepen = [
  {
    code: "U6",
    titel: "U6",
    items: [
      "FUN !!!",
      "Veel spelletjes en wedstrijdvormen",
      "Wedstrijdvorm 1/1 op mini-doelen : Tornooivormen",
      "Doelpogingen op duiveltjesdoel na dribbel, leiden, mikken, loop coördinatie",
      "Loopspel met en zonder bal",
      "Reactiespel",
      "Estafette zonder en met bal aan de voet",
      "Balvaardigheid (Oog-hand coördinatie: werpen en vangen)",
      "Basismotorische vaardigheden aanleren/herhalen: klauteren, klimmen, vallen, springen"
    ]
  },
  {
    code: "U7",
    titel: "U7",
    techniek: [
      "Alle oefeningen met rechter- en linkervoet",
      "Veel spelletjes",
      "Leiden en dribbelen in spelvorm",
      "Doelpoging op duiveltjesdoel op stilliggende bal of na dribbel",
      "Balbeheersing (bewegingsgericht): juiste techniek",
      "Loopspel met bal",
      "Reactiespel",
      "Estafette met bal aan de voet",
      "Balvaardigheid (oog-hand + oog-voet coördinatie)",
      "Huiswerk"
    ],
    tactiek: [
      "Wedstrijdvorm 1/1, 1/2 en 2/2 : tornooivormen, lijnvoetbal (stimuleert het maken van een actie)",
      "Positie in vliegtuigvorm: doelman, staart, 2 vleugeltjes, piloot",
      "Actie maken",
      "Bal afnemen",
      "Scoren beletten"
    ]
  },
  {
    code: "U8",
    titel: "U8",
    techniek: [
      "Doelpoging (10m) op duiveltjesdoel na pass binnenkant voet op stilliggende bal (1ste helft seizoen)",
      "Pass binnenkant voet op stilliggende bal (1ste helft seizoen)",
      "Controle binnenkant voet (2de helft seizoen)",
      "Controle verste voet + pass andere voet (2de helft seizoen)",
      "Leiden/dribbel",
      "Balbeheersing (bewegingsgericht) : kap-,draai-,schijn-,passeerbeweging (frontaal)",
      "Jongleren met tussenbots",
      "Soccerpall",
      "Balvaardigheid (oog-hand-voet coördinatie)",
      "Loopspel met de bal",
      "Reactiespel",
      "Estafette met bal",
      "Loopcoördinatieoefening met en zonder bal",
      "Huiswerk"
    ],
    tactiek: {
      algemeen: [
        "Wedstrijdvorm 1/1, 2/2, 4/4, in/onder/overtal: omschakeling vliegtuig→ ruit met positienummers: 3, 11 en 7, 9"
      ],
      balbezit: [
        "Vrijlopen",
        "Open staan",
        "Meespelende keeper"
      ],
      balverlies: [
        "Druk zetten",
        "Sluiten",
        "Meespelende keeper",
        "Interceptie of afweren van korte pass",
        "Korte dekking op korte pass"
      ]
    }
  },
  {
    code: "U9",
    titel: "U9",
    techniek: [
      "Doelpoging (10m) op duiveltjesdoel na pass binnenkant voet",
      "Leiden en dribbel op snelheid",
      "Pass binnenkant voet op bewegende bal (frontaal+zijwaarts) : techniek",
      "Georiënteerde controle binnenkant voet (opendraaien): techniek (2de helft seizoen)",
      "Balbeheersing (wedstrijdgericht):kap/draai, schijn, passeerbeweging (frontaal+zijwaarts)",
      "Jongleren zonder tussenbots (5X)",
      "Soccerpall",
      "Balvaardigheid (oog-hand-voet coördinatie)",
      "Loopspel met bal",
      "Reactiespel",
      "Estafette met bal",
      "Loopcoördinatieoefening met en zonder bal",
      "Huiswerk"
    ],
    tactiek: {
      algemeen: ["Wedstrijdvorm in/onder/overtal"],
      balbezit: [
        "Vrijlopen",
        "Open staan",
        "Meespelende keeper",
        "Ingedraaid staan"
      ],
      balverlies: [
        "Druk zetten",
        "Sluiten",
        "Meespelende keeper"
      ]
    }
  },
  {
    code: "U10",
    titel: "U10",
    techniek: [
      "Pass 20m met wreef over de grond (1ste helft seizoen)",
      "Pass 20m met wreef in de loop van medespeler (2de helft seizoen)",
      "één-twee in 2-tijden (1ste helft seizoen)",
      "Kaats (2de helft seizoen)",
      "Doelpoging (15m) na pass met wreef of na passeerbeweging op snelheid",
      "Balbeheersing (wedstrijdgericht): Kap-,draai-,schijn-,passerbeweging (frontaal+zijwaarts+in de rug)",
      "Jongleren zonder tussenbots (10x)",
      "Loopcoördinatieoefening met en zonder bal",
      "Estafette met bal en zonder bal",
      "Huiswerk"
    ],
    tactiek: {
      algemeen: ["Wedstrijdvorm in/onder/overtal:omschakeling van enkele naar dubbele ruit"],
      balbezit: [
        "Spel verleggen (meerdere doelen)",
        "Diagonale passing (driehoekjes)",
        "Terugleggen bal"
      ],
      balverlies: [
        "Speelhoeken afsluiten",
        "Remmend wijken",
        "Dekking door dichtste medespeler",
        "Duel aangaan"
      ]
    }
  },
  {
    code: "U11 - U12",
    titel: "U11",
    techniek: [
      "Halfhoge pass 15m met wreef in de loop medespeler",
      "Kaats",
      "Inworp",
      "Controle na halfhoge bal",
      "Koppen met zachte bal",
      "Doelpoging na halfhoge voorzet",
      "Hoekschop + indirecte vrije trap",
      "Balbeheersing (wedstrijdgericht): kap-,draai-,schijn-,passeerbeweging (frontaal+zijwaarts+in de rug)",
      "Jongleren zonder tussenbots (20x)",
      "Loopcoördinatieoefening"
    ],
    tactiek: {
      algemeen: ["Wedstrijdvorm in/onder/overtal"],
      balbezit: [
        "Infiltratie met of zonder bal (give+go)",
        "Steunen"
      ],
      balverlies: [
        "Interceptie",
        "Negatieve pressing (shadow-pressing)",
        "Opstelling bij hoekschop + indirecte vrije trap",
        "Duel aangaan"
      ]
    }
  },
  {
    code: "U13",
    titel: "U13",
    techniek: [
      "Balsnelheid verhogen",
      "Lange pass",
      "Controle op lange pass",
      "Koppen",
      "Doelpoging ver (20m)",
      "Balbeheersing (wedstrijdgericht): kap-,draai-,schijn-,passeerbeweging (frontaal+zijwaarts+in de rug)",
      "Jongleren zonder tussenbots (50x)",
      "Estafette met en zonder bal",
      "Loopcoördinatieoefening met en zonder bal/ lenigheidsoefening"
    ],
    tactiek: {
      algemeen: ["Wedstrijdvorm in/onder/overtal: omschakeling van 8 tegen 8 naar 11 tegen 11"],
      balbezit: [
        "Infiltratie met of zonder bal (give+go)",
        "Steunen",
        "Driehoekspel",
        "Opstelling bij hoekschop + indirecte vrije trap",
        "Buitenspelval omzeilen"
      ],
      balverlies: [
        "Interceptie",
        "Negatieve pressing (shadow-pressing)",
        "Opstelling bij hoekschop + indirecte vrije trap",
        "Afweren en interceptie lange passing",
        "Schuiven en kantelen van het verdedigend blok",
        "Buitenspelval opzetten",
        "Speelruimte verkleinen",
        "Duel aangaan"
      ]
    }
  },
  {
    code: "U15",
    titel: "U15",
    techniek: [
      "Lange pass",
      "Controle op lange pass",
      "Doelpoging op hoge voorzet",
      "Directe vrije trap",
      "Eindpass in de diepte",
      "Balbeheersing (wedstrijdgericht): kap-,draai-,schijn-,passeerbeweging (frontaal+zijwaarts+in de rug)",
      "Jongleren zonder tussenbots (50x)",
      "Estafette met en zonder bal",
      "Loopcoördinatieoefening met en zonder bal/ lenigheidsoefening",
      "Snelheid"
    ],
    tactiek: {
      algemeen: ["Wedstrijdvorm in/onder/overtal"],
      balbezit: [
        "Infiltratie met of zonder bal (give+go)",
        "Steunen",
        "Ruimte creëren voor de medespelers",
        "Buitenspelval omzeilen"
      ],
      balverlies: [
        "Interceptie",
        "Negatieve pressing (shadow-pressing)",
        "Schuiven en kantelen van het verdedigend blok",
        "Opstelling bij directe vrije trap",
        "Duel: na balverlies druk zetten en dieptepass verhinderen",
        "Onderlinge dekking"
      ]
    }
  },
  {
    code: "U17",
    titel: "U17",
    techniek: [
      "Lange pass",
      "Controle op lange pass",
      "Doelpoging op hoge voorzet",
      "Directe vrije trap",
      "Estafette met en zonder bal",
      "Loopcoördinatieoefening met en zonder bal/ lenigheidsoefening",
      "Snelheid",
      "Uithouding"
    ],
    tactiek: {
      algemeen: ["Wedstrijdvorm in/onder/overtal"],
      balbezit: [
        "Infiltratie met of zonder bal (give+go)",
        "Steunen",
        "Bruikbare voorzetten, bezetting 1ste en 2de paal en 16m"
      ],
      balverlies: [
        "Interceptie",
        "Negatieve pressing (shadow-pressing)",
        "Schuiven en kantelen van het verdedigend blok",
        "Dekking (split vision)",
        "Opstelling bij directe vrije trap",
        "Duel: na balverlies druk zetten en dieptepass verhinderen",
        "T-vorm verdedigend en omzetten naar aanval",
        "Onderlinge dekking"
      ]
    }
  },
  {
    code: "U21",
    titel: "U21",
    techniek: [
      "Lange pass",
      "Controle op lange pass",
      "Doelpoging op hoge voorzet",
      "Directe vrije trap",
      "Bruikbare voorzetten, bezetting 1ste , 2de paal en 16m",
      "Estafette met en zonder bal",
      "Loopcoördinatieoefening met en zonder bal/ lenigheidsoefening",
      "Snelheid",
      "Uithouding"
    ],
    tactiek: {
      algemeen: ["Wedstrijdvorm in/onder/overtal"],
      balbezit: [
        "Infiltratie met of zonder bal (give+go)",
        "Steunen"
      ],
      balverlies: [
        "Interceptie",
        "Negatieve pressing (shadow-pressing)",
        "Schuiven en kantelen van het verdedigend blok",
        "Dekking (split vision)",
        "Opstelling bij directe vrije trap",
        "Duel: na balverlies druk zetten en dieptepass verhinderen",
        "T-vorm verdedigend en omzetten naar aanval",
        "Onderlinge dekking"
      ]
    }
  }
];

export default function OpleidingsplanPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="bg-white border-b">
        <div className="container-custom py-4">
          <Link href="/jeugdopleiding" className="inline-flex items-center gap-2 text-gray-600 hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Terug naar jeugdopleiding
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 py-16">
        <div className="container-custom text-center text-white">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6 }}
          >
            <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-6">
              <FileText className="w-8 h-8" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Opleidingsplan</h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Opleidingsplan WS Linkhout U6-U21
            </p>
          </motion.div>
        </div>
      </section>

      {/* Leeftijdsgroepen */}
      <section className="section-padding">
        <div className="container-custom max-w-4xl">
          <div className="space-y-8">
            {leeftijdsgroepen.map((groep, index) => (
              <motion.div
                key={groep.code}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
              >
                {/* Header */}
                <div className="bg-primary text-white px-6 py-4">
                  <h2 className="text-xl font-bold flex items-center gap-3">
                    <Target className="w-5 h-5" />
                    {groep.titel}
                  </h2>
                </div>

                <div className="p-6">
                  {/* U6 heeft alleen items, geen techniek/tactiek split */}
                  {groep.code === "U6" && (
                    <ul className="space-y-2">
                      {groep.items?.map((item, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Andere groepen (U7 en hoger) hebben techniek/tactiek */}
                  {groep.code !== "U6" && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                          <Dribbble className="w-5 h-5 text-primary" />
                          Techniek
                        </h3>
                        <ul className="space-y-2 ml-7">
                          {groep.techniek?.map((item, i) => (
                            <li key={i} className="flex items-start gap-3">
                              <span className="w-1.5 h-1.5 bg-primary/60 rounded-full mt-2 flex-shrink-0" />
                              <span className="text-gray-700">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                          <Users className="w-5 h-5 text-primary" />
                          Tactiek
                        </h3>
                        
                        {/* Check if tactiek is an array (U7) or object (U8+) */}
                        {Array.isArray(groep.tactiek) ? (
                          // U7 style: simple array
                          <ul className="space-y-2 ml-7">
                            {groep.tactiek.map((item, i) => (
                              <li key={i} className="flex items-start gap-3">
                                <span className="w-1.5 h-1.5 bg-primary/60 rounded-full mt-2 flex-shrink-0" />
                                <span className="text-gray-700">{item}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          // U8+ style: object with algemeen, balbezit, balverlies
                          <>
                            {/* Algemeen */}
                            {groep.tactiek?.algemeen && (
                              <ul className="space-y-2 ml-7 mb-4">
                                {groep.tactiek.algemeen.map((item, i) => (
                                  <li key={i} className="flex items-start gap-3">
                                    <span className="w-1.5 h-1.5 bg-primary/60 rounded-full mt-2 flex-shrink-0" />
                                    <span className="text-gray-700">{item}</span>
                                  </li>
                                ))}
                              </ul>
                            )}

                            {/* Balbezit */}
                            {groep.tactiek?.balbezit && (
                              <div className="ml-7 mb-4">
                                <h4 className="font-semibold text-green-700 mb-2">Balbezit</h4>
                                <ul className="space-y-2 ml-4">
                                  {groep.tactiek.balbezit.map((item, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                                      <span className="text-gray-700">{item}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {/* Balverlies */}
                            {groep.tactiek?.balverlies && (
                              <div className="ml-7">
                                <h4 className="font-semibold text-red-700 mb-2">Balverlies</h4>
                                <ul className="space-y-2 ml-4">
                                  {groep.tactiek.balverlies.map((item, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                      <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                                      <span className="text-gray-700">{item}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
