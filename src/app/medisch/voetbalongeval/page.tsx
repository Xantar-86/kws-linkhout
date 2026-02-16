"use client";

import { motion } from "framer-motion";
import { AlertTriangle, ArrowLeft, FileText, Shield, Phone, Download, Mail, User, Clock } from "lucide-react";
import Link from "next/link";

export default function VoetbalongevalPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="bg-white border-b">
        <div className="container-custom py-4">
          <Link href="/medisch" className="inline-flex items-center gap-2 text-gray-600 hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Terug naar medisch
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-red-600 via-red-700 to-red-800 py-16">
        <div className="container-custom text-center text-white">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Voetbalongeval</h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Procedure en informatie bij een voetbalongeval
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="section-padding bg-white">
        <div className="container-custom max-w-4xl">
          {/* Introductie */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-amber-50 rounded-2xl p-8 border border-amber-100 mb-8"
          >
            <p className="text-amber-800 leading-relaxed">
              We wensen het natuurlijk niemand toe, maar de meeste spelers/ouders weten niet wat ze moeten doen 
              wanneer ze een kwetsuur oplopen tijdens de training en/of wedstrijd. Het gevolg is dat ze vaak 
              te laat komen met formulieren en/of onkostennota's. Om dergelijke problemen te vermijden, geven 
              we een kort overzicht van de te volgen procedure.
            </p>
          </motion.div>

          {/* Formulier verkrijgen */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-8"
          >
            <div className="bg-primary text-white px-6 py-4">
              <div className="flex items-center gap-3">
                <FileText className="w-6 h-6" />
                <h2 className="text-xl font-bold">Het formulier "AANGIFTE VAN ONGEVAL"</h2>
              </div>
            </div>
            <div className="p-6">
              <p className="text-gray-700 mb-4">Het formulier kan men bekomen bij:</p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <User className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">
                    Onze gerechtigde correspondent <strong>Gert Peremans</strong>{" "}
                    <a href="mailto:gc@kwslinkhout.be" className="text-primary hover:underline">gc@kwslinkhout.be</a>
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <User className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">De trainer en/of ploegafgevaardigde/kantine</span>
                </li>
                <li className="flex items-start gap-3">
                  <Download className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <a 
                    href="/docs/medisch/voetbalongeval.pdf" 
                    download
                    className="text-primary hover:underline font-medium"
                  >
                    Hier downloaden
                  </a>
                </li>
              </ul>
            </div>
          </motion.div>

          {/* Wanneer ongevalsaangifte */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-blue-50 rounded-2xl p-8 border border-blue-100 mb-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <Clock className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-bold text-blue-900">Wanneer kan u een ongevalsaangifte laten invullen?</h2>
            </div>
            <p className="text-blue-800">
              Bij een doktersbezoek dat voortvloeit uit een kwetsuur opgelopen op training of wedstrijd.
            </p>
          </motion.div>

          {/* Terugbetaling procedure */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-8"
          >
            <div className="bg-green-600 text-white px-6 py-4">
              <h2 className="text-xl font-bold">Wat te doen om in aanmerking te komen voor terugbetaling van de kosten?</h2>
            </div>
            <div className="p-6 space-y-8">
              {/* Stap 1 */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
                  Eerste consultatie
                </h3>
                <ul className="space-y-2 ml-10 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                    <span>De speler consulteert zo vlug mogelijk na het voetbalongeval een arts en neemt het formulier "Aangifte voor ongeval" mee. De arts vult de zijde "Medisch getuigschrift" in.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                    <span>Gelieve op een bijgevoegd papiertje te beschrijven hoe het ongeval is gebeurd en tijdens welke training of wedstrijd, en de omstandigheden van het ongeval (bijv. trap, val, voet verzwikt, bal op neus, …)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                    <span>Vervolgens bezorgt u het ongevallenformulier, voorzien van een kleefstrookje van de mutualiteit en het papiertje met de bijkomende info en de beschrijving van de feiten aan de GC.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                    <span>Onze GC moet het ingevulde formulier opsturen naar de voetbalbond en dat moet gebeuren <strong>uiterlijk binnen de 21 kalenderdagen</strong> na het voetbalongeval. Vandaar het belang om zo vlug mogelijk de ongevalsaangifte ingevuld terug te bezorgen aan de club.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                    <span>De speler moet, vanaf het moment van het voetbalongeval, alle originele bewijsstukken van de gemaakte kosten met betrekking tot het voetbalongeval verzamelen.</span>
                  </li>
                </ul>
                
                <div className="mt-4 bg-amber-50 rounded-xl p-4 border border-amber-100 ml-10">
                  <p className="text-amber-800 font-semibold mb-2">Opmerking:</p>
                  <ul className="space-y-2 text-amber-800 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1.5 flex-shrink-0" />
                      <span>Is dit formulier niet binnen de 21 dagen (poststempel geldt) na het voetbalongeval opgestuurd, dan zal de verzekering van de voetbalbond niet tussenkomen in de kosten.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1.5 flex-shrink-0" />
                      <span>Op de zijde "Medisch getuigschrift" moeten de nodige beurten kinesitherapie vermeld staan, dus controleer dit bij uw arts (als er kinesitherapie nodig is vraag zeker 9 beurten aan).</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1.5 flex-shrink-0" />
                      <span>Vraag bij de apotheker een duidelijke factuur (een kasticket is niet voldoende).</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Stap 2 */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
                  Bijkomende behandelingen
                </h3>
                <ul className="space-y-2 ml-10 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                    <span>Eenmaal dit formulier is opgestuurd en er in Brussel een dossier is aangelegd, zal u een formulier ontvangen "Geneeskundig getuigschrift van herstel". Dit document houdt u bij en laat u pas invullen door de arts op het moment van genezing.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                    <span>Indien de arts beslist dat er bijkomende sessies nodig zijn voor de kinesitherapeut, ga dan met het afschrift van de arts bij de GC die op haar beurt een aanvraag zal indienen in Brussel. Dit dient te gebeuren vooraleer de volgende sessie moet aangevat worden. De voetbalbond moet eerst zijn toestemming geven voor een welbepaald aantal behandelingen vanaf een bepaalde datum.</span>
                  </li>
                </ul>
                
                <div className="mt-4 bg-amber-50 rounded-xl p-4 border border-amber-100 ml-10">
                  <p className="text-amber-800 font-semibold mb-2">Opmerking:</p>
                  <ul className="space-y-2 text-amber-800 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1.5 flex-shrink-0" />
                      <span>De bijkomende sessies kunnen pas aanvangen na goedkeuring vanuit Brussel.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1.5 flex-shrink-0" />
                      <span>Indien er geen aanvraag werd ingediend voor bijkomende sessies, dan zal er uiteraard geen terugbetaling zijn van deze kosten.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1.5 flex-shrink-0" />
                      <span>Voor een sportinactiviteit van minder dan 15 dagen worden er geen uitkeringen toegekend voor speciale zorgen.</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Stap 3 */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
                  Afsluiting dossier
                </h3>
                <ul className="space-y-2 ml-10 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                    <span>Van zodra de arts beslist dat de speler opnieuw mag gaan voetballen (definitieve genezing), laat u het formulier "Geneeskundig getuigschrift van herstel" door hem invullen.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                    <span>Aan dit formulier voegt u het volledig detail van tegemoetkomingen van het ziekenfonds, evenals alle originele bewijsstukken van de gemaakte kosten met betrekking tot het voetbalongeval toe en u bezorgt dit alles aan de GC die dit onmiddellijk opstuurt naar Brussel.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                    <span>Eenmaal het dossier is afgesloten in Brussel, ontvangt KWS Linkhout het bedrag van de tussenkomst.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                    <span>De speler/ouder ontvangt dit bedrag van de gerechtigd correspondent of laat het storten op een bankrekening.</span>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Waarschuwing */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-red-600 text-white rounded-2xl p-8 text-center mb-8"
          >
            <AlertTriangle className="w-12 h-12 mx-auto mb-4" />
            <p className="text-xl font-bold mb-2">KWS LINKHOUT ZIET AF VAN ALLE AANSPRAKELIJKHEID</p>
            <p className="text-lg">INDIEN DEZE PROCEDURE NIET WERD GERESPECTEERD</p>
          </motion.div>

          {/* Belangrijke opmerkingen */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-amber-50 rounded-2xl p-8 border border-amber-100 mb-8"
          >
            <h3 className="text-xl font-bold text-amber-900 mb-4">Belangrijke opmerkingen</h3>
            <ul className="space-y-3 text-amber-800">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-amber-600 rounded-full mt-2 flex-shrink-0" />
                <span>Zolang het formulier "Geneeskundig getuigschrift van herstel" niet is ingevuld en opgestuurd, mag de speler in kwestie niet voetballen.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-amber-600 rounded-full mt-2 flex-shrink-0" />
                <span>Let erop dat de arts de datum van definitieve genezing en de datum van hervatting duidelijk vermeldt op het formulier.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-amber-600 rounded-full mt-2 flex-shrink-0" />
                <span>De onkosten van het gebeurlijke ongeval kunnen tot 2 jaar na het ongeval binnengebracht worden. U dient dus niet te wachten op een afrekening van ziekenhuis of dergelijke alvorens het "bewijs van genezing" binnen te brengen. Het is eveneens mogelijk dat de arts oordeelt dat de speler mag voetballen maar dat de "genezing" nog even op zich laat wachten.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-amber-600 rounded-full mt-2 flex-shrink-0" />
                <span>Vergeet niet, bij het indienen van uw documenten bij de gerechtigde correspondent, uw rekeningnummer te vermelden.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-amber-600 rounded-full mt-2 flex-shrink-0" />
                <span>Brussel houdt automatisch bij elk voetbalongeval een vast bedrag af voor de administratieve kosten. Op dit ogenblik bedraagt dit bedrag circa 10 €.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-amber-600 rounded-full mt-2 flex-shrink-0" />
                <span>Bij hospitalisatie worden enkel de substantiële kosten terugbetaald.</span>
              </li>
            </ul>
          </motion.div>

          {/* Federaal Solidariteitsfonds */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-blue-50 rounded-2xl p-8 border border-blue-100 mb-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-blue-600" />
              <h3 className="text-xl font-bold text-blue-900">Federaal Solidariteitsfonds (F.S.F.)</h3>
            </div>
            <p className="text-blue-800 leading-relaxed mb-4">
              Wanneer men als aangesloten speler, oefenmeester of begeleider van KWS Linkhout een blessure oploopt 
              tijdens een wedstrijd of een training, dan kan men een beroep doen op het Federaal Solidariteitsfonds 
              (F.S.F.) van de KBVB.
            </p>
            <p className="text-blue-800 leading-relaxed mb-4">
              De financiële tussenkomsten worden betaald door het Federaal Solidariteitsfonds (F.S.F.) van de KBVB. 
              Dit fonds – <strong>géén verzekering</strong> – verleent financiële hulp aan de slachtoffers van een sportongeval. 
              Het F.S.F. dekt alle kosten veroorzaakt door sportongevallen, na aftrek van de door de ziekenfondsen 
              terugbetaalde sommen tot de wettelijke normen bepaald in de nomenclatuur (medische prestatie met een 
              door het RIZIV bepaalde prijs). Er wordt enkel tussengekomen in die gevallen die ook door de ziekenfondsen 
              worden gedekt !!
            </p>
            <p className="text-blue-800 leading-relaxed">
              Het is misschien wel het overwegen waard om een individuele bijkomende ongevallenverzekering af te sluiten. 
              De terugbetaling kan daar hoger liggen !! Uiteraard is dit volledig vrijblijvend.
            </p>
          </motion.div>

          {/* Contact GC */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-primary text-white rounded-2xl p-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <Mail className="w-6 h-6" />
              <h3 className="text-xl font-bold">Contact Gerechtigde Correspondent</h3>
            </div>
            <p className="text-white/90 mb-4">
              Enkel onze GC is gemachtigd om briefwisseling met de voetbalbond te voeren. 
              Bij eventuele vragen of opmerkingen is het best om te contacteren:
            </p>
            <a 
              href="mailto:gc@kwslinkhout.be" 
              className="inline-flex items-center gap-2 text-white font-semibold hover:underline"
            >
              <Mail className="w-5 h-5" />
              gc@kwslinkhout.be
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
