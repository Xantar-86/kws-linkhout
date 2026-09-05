"use client";

import { motion } from "framer-motion";
import { SectieKop } from "@/components/SectieKop";
import { kijk, varianten } from "@/lib/beweging";

/**
 * De club in beeld: twee video's naast elkaar.
 *
 * Let op het `loading="lazy"` op allebei de kaders. Dat is hier geen detail
 * maar de belangrijkste regel van deze sectie. Een YouTube- en een
 * Facebook-kader slepen samen makkelijk een megabyte aan scripts mee, en die
 * stonden tot nu toe te laden terwijl de bezoeker nog naar de hero keek. Deze
 * sectie staat ver onder de vouw; wie er nooit komt, hoort er ook niets voor
 * te downloaden.
 *
 * De kaders krijgen een titel mee. Zonder blijft er voor een schermlezer een
 * naamloos venster over waar hij wel in kan, maar waarvan hij niet te weten
 * komt wat het is.
 */

const VIDEOS = [
  {
    id: "facebook",
    titel: "Sfeerbeelden van de club",
    bron: "Facebook",
    src: "https://www.facebook.com/plugins/video.php?height=314&href=https%3A%2F%2Fwww.facebook.com%2F61559748434812%2Fvideos%2F3867308740206273%2F&show_text=false&width=560&t=0",
    toestaan:
      "autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share",
  },
  {
    id: "youtube",
    titel: "KWS Linkhout in beeld",
    bron: "YouTube",
    src: "https://www.youtube.com/embed/QUi0ghNOScw",
    toestaan:
      "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
  },
];

export function MediaSection() {
  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <SectieKop
          opschrift="In beeld"
          titel="KWS Linkhout in de media"
          accent="media"
          onder="Bekijk de club in actie, op het veld en erbuiten."
        />

        <motion.div
          initial="verborgen"
          whileInView="zichtbaar"
          viewport={kijk}
          variants={varianten.groep(0.1, 0.12)}
          className="mt-14 grid gap-6 lg:grid-cols-2"
        >
          {VIDEOS.map((video) => (
            <motion.figure key={video.id} variants={varianten.lid}>
              <div className="kaart overflow-hidden">
                <div className="aspect-video w-full bg-inkt-900">
                  <iframe
                    src={video.src}
                    title={video.titel}
                    loading="lazy"
                    allow={video.toestaan}
                    allowFullScreen
                    className="h-full w-full border-0"
                  />
                </div>
                <figcaption className="flex items-center justify-between gap-4 px-5 py-4">
                  <span className="text-sm font-semibold text-gray-900">
                    {video.titel}
                  </span>
                  <span className="text-xs font-medium uppercase tracking-wider text-gray-400">
                    {video.bron}
                  </span>
                </figcaption>
              </div>
            </motion.figure>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
