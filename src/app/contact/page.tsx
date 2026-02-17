"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Send,
  User,
  MessageSquare,
  CheckCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { contactPersons, faqItems, facilities } from "@/lib/contact";
import Link from "next/link";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    category: "algemeen"
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simuleer verzending
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: "", email: "", subject: "", message: "", category: "algemeen" });
    }, 3000);
  };

  const toggleFaq = (id: string) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  const categoryColors: { [key: string]: string } = {
    bestuur: "bg-blue-100 text-blue-700",
    jeugd: "bg-green-100 text-green-700",
    dames: "bg-pink-100 text-pink-700",
    senioren: "bg-red-100 text-red-700",
    administratie: "bg-gray-100 text-gray-700"
  };

  const categoryLabels: { [key: string]: string } = {
    bestuur: "Bestuur",
    jeugd: "Jeugd",
    dames: "Dames",
    senioren: "Senioren",
    administratie: "Administratie"
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 py-20">
        <div className="container-custom text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium mb-6">
              <MessageSquare className="w-4 h-4" />
              We staan voor je klaar
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Contact & Praktisch
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Heb je vragen? Neem contact op met ons team of vind hier alle praktische informatie.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Quick Contact Cards */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 -mt-16 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-6 shadow-xl"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-4">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">E-mail</h3>
              <p className="text-gray-600 text-sm mb-3">Voor algemene vragen</p>
              <a href="mailto:info@kwslinkhout.be" className="text-primary font-medium hover:underline">
                info@kwslinkhout.be
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-xl"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-4">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Adres</h3>
              <p className="text-gray-600 text-sm mb-3">KWS Linkhout Clubhuis</p>
              <p className="text-gray-800 font-medium">Kapelstraat 72<br/>3560 Linkhout</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-6 shadow-xl"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-4">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Kantine</h3>
              <p className="text-gray-600 text-sm mb-3">Open tijdens activiteiten</p>
              <p className="text-gray-800 font-medium">Trainingen & Wedstrijden</p>
            </motion.div>
          </div>

          {/* Contact Persons Grid */}
          <div className="mt-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-10"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Contactpersonen
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Voor specifieke vragen kan je terecht bij deze contactpersonen.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {contactPersons.map((person, index) => (
                <motion.div
                  key={person.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                      <User className="w-6 h-6" />
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${categoryColors[person.category]}`}>
                      {categoryLabels[person.category]}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    {person.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {person.role}
                  </p>

                  <div className="space-y-2">
                    {person.email && (
                      <a 
                        href={`mailto:${person.email}`}
                        className="flex items-center gap-2 text-sm text-gray-700 hover:text-primary transition-colors"
                      >
                        <Mail className="w-4 h-4" />
                        {person.email}
                      </a>
                    )}
                    {person.phone && (
                      <a 
                        href={`tel:${person.phone.replace(/\s/g, '')}`}
                        className="flex items-center gap-2 text-sm text-gray-700 hover:text-primary transition-colors"
                      >
                        <Phone className="w-4 h-4" />
                        {person.phone}
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Location & Map */}
          <div className="mt-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-10"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Locatie & Faciliteiten
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Ons clubhuis is de thuisbasis van KWS Linkhout.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {facilities.map((facility) => (
                <motion.div
                  key={facility.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-2xl p-8 shadow-lg"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                      <MapPin className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{facility.name}</h3>
                      <p className="text-gray-600">{facility.address}</p>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-6">{facility.description}</p>

                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {facility.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        {feature}
                      </div>
                    ))}
                  </div>

                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(facility.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
                  >
                    <MapPin className="w-4 h-4" />
                    Open in Google Maps
                  </a>
                </motion.div>
              ))}

              {/* Google Maps Embed */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl overflow-hidden shadow-lg h-[400px]"
              >
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2511.4496391258195!2d5.158125976779158!3d50.95287397169496!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c121b17f7ca66d%3A0x771b5f1e8b9b0b1a!2sKapelstraat%2072%2C%203560%20Linkhout!5e0!3m2!1snl!2sbe!4v1708185600000!5m2!1snl!2sbe"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="KWS Linkhout Clubhuis"
                />
              </motion.div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-10"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-4">
                <HelpCircle className="w-4 h-4" />
                Veelgestelde vragen
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                FAQ
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Antwoorden op de meest gestelde vragen.
              </p>
            </motion.div>

            <div className="max-w-3xl mx-auto space-y-4">
              {faqItems.map((faq, index) => (
                <motion.div
                  key={faq.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-xl shadow-sm overflow-hidden"
                >
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-semibold text-gray-900 pr-4">{faq.question}</span>
                    {openFaq === faq.id ? (
                      <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                    )}
                  </button>
                  {openFaq === faq.id && (
                    <div className="px-5 pb-5">
                      <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <div className="mt-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-3xl shadow-xl p-8 md:p-12"
            >
              <div className="max-w-2xl mx-auto text-center mb-10">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Stuur ons een bericht
                </h2>
                <p className="text-gray-600">
                  Heb je een vraag die niet in de FAQ staat? Vul het formulier in en we reageren zo snel mogelijk.
                </p>
              </div>

              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Bedankt voor je bericht!
                  </h3>
                  <p className="text-gray-600">
                    We hebben je vraag ontvangen en nemen zo snel mogelijk contact op.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Je naam *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        placeholder="Voornaam Achternaam"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        E-mailadres *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        placeholder="jouw@email.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Categorie
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      >
                        <option value="algemeen">Algemeen</option>
                        <option value="jeugd">Jeugd</option>
                        <option value="dames">Dames</option>
                        <option value="senioren">Senioren</option>
                        <option value="lidmaatschap">Lidmaatschap</option>
                        <option value="sponsoring">Sponsoring</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Onderwerp *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.subject}
                        onChange={(e) => setFormData({...formData, subject: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        placeholder="Waar gaat je vraag over?"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Je bericht *
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                      placeholder="Schrijf hier je vraag of bericht..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-primary text-white font-bold py-4 rounded-xl hover:bg-primary-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Send className="w-5 h-5" />
                    Verstuur bericht
                  </button>

                  <p className="text-sm text-gray-500 text-center">
                    Door te versturen ga je akkoord met onze{" "}
                    <Link href="/clubinfo/sectie?slug=privacyverklaring" className="text-primary hover:underline">
                      privacyverklaring
                    </Link>
                    .
                  </p>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
