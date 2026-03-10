"use client";

import { motion } from "framer-motion";

export function MediaSection() {
  return (
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
                style={{ border: "none", overflow: "hidden" }}
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
  );
}
