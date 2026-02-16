"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Check, Newspaper, Trophy, Calendar, Users } from "lucide-react";
import Link from "next/link";
import { newsletterBenefits } from "@/lib/newsletter";

export default function NewsletterPage() {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [interests, setInterests] = useState<string[]>(["clubnieuws"]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const interestOptions = [
    { value: "clubnieuws", label: "Clubnieuws", icon: Newspaper },
    { value: "ploegnieuws", label: "Ploegnieuws", icon: Trophy },
    { value: "evenementen", label: "Evenementen", icon: Calendar },
    { value: "jeugd", label: "Jeugdnieuws", icon: Users }
  ];

  const handleInterestToggle = (value: string) => {
    setInterests(prev => 
      prev.includes(value) 
        ? prev.filter(i => i !== value)
        : [...prev, value]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simuleer API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    setIsLoading(false);
    setIsSubmitted(true);
  };

  const getIcon = (iconName: string) => {
    const icons: { [key: string]: React.ElementType } = {
      newspaper: Newspaper,
      trophy: Trophy,
      calendar: Calendar,
      users: Users
    };
    const Icon = icons[iconName] || Newspaper;
    return <Icon className="w-6 h-6" />;
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
            <Mail className="w-16 h-16 mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Nieuwsbrief
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Blijf op de hoogte van alles wat er gebeurt bij KWS Linkhout. 
              Schrijf je in voor onze wekelijkse nieuwsbrief!
            </p>
          </motion.div>
        </div>
      </section>

      {/* Benefits */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {newsletterBenefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg text-center"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mx-auto mb-4">
                  {getIcon(benefit.icon)}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600 text-sm">{benefit.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Form */}
          <div className="max-w-2xl mx-auto">
            {!isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white rounded-3xl shadow-xl p-8 md:p-12"
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">
                  Schrijf je in
                </h2>
                <p className="text-gray-600 text-center mb-8">
                  Vul je gegevens in en kies waarover je op de hoogte wilt blijven.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Voornaam
                      </label>
                      <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        placeholder="Voornaam"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Achternaam
                      </label>
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        placeholder="Achternaam"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      E-mailadres *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      placeholder="jouw@email.com"
                    />
                  </div>

                  {/* Interests */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Ik ben geïnteresseerd in:
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {interestOptions.map((option) => {
                        const Icon = option.icon;
                        const isSelected = interests.includes(option.value);
                        return (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => handleInterestToggle(option.value)}
                            className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                              isSelected
                                ? "border-primary bg-primary/5 text-primary"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                          >
                            <Icon className="w-5 h-5" />
                            <span className="font-medium">{option.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-primary text-white font-bold py-4 rounded-xl hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Bezig...
                      </>
                    ) : (
                      <>
                        <Mail className="w-5 h-5" />
                        Inschrijven
                      </>
                    )}
                  </button>

                  <p className="text-sm text-gray-500 text-center">
                    Door je in te schrijven ga je akkoord met onze{" "}
                    <Link href="#" className="text-primary hover:underline">
                      privacyverklaring
                    </Link>
                    . Je kunt je op elk moment uitschrijven.
                  </p>
                </form>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-3xl shadow-xl p-12 text-center"
              >
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Bedankt voor je inschrijving!
                </h2>
                <p className="text-gray-600 mb-8">
                  Je ontvangt binnenkort een bevestigingsmail. 
                  Vanaf nu houden we je op de hoogte van alles wat er gebeurt bij KWS Linkhout.
                </p>
                <Link
                  href="/nieuws"
                  className="inline-flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-xl font-semibold hover:bg-primary-700 transition-colors"
                >
                  <Newspaper className="w-5 h-5" />
                  Bekijk laatste nieuws
                </Link>
              </motion.div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
