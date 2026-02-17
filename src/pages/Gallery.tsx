import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Layout from "@/components/Layout";
import gallery1 from "@/assets/gallery-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";
import gallery3 from "@/assets/gallery-3.jpg";
import serviceHair from "@/assets/service-hair.jpg";
import serviceFacial from "@/assets/service-facial.jpg";
import serviceMakeup from "@/assets/service-makeup.jpg";
import serviceNails from "@/assets/service-nails.jpg";
import serviceSpa from "@/assets/service-spa.jpg";
import heroModel from "@/assets/hero-model.jpg";

const images = [
  { src: gallery1, alt: "Luxury salon interior" },
  { src: serviceHair, alt: "Hair styling session" },
  { src: gallery2, alt: "Beauty products display" },
  { src: serviceFacial, alt: "Skincare products" },
  { src: serviceMakeup, alt: "Makeup collection" },
  { src: gallery3, alt: "Spa essentials" },
  { src: serviceNails, alt: "Nail polish collection" },
  { src: serviceSpa, alt: "Spa treatment" },
  { src: heroModel, alt: "Lipstick product shot" },
];

const Gallery = () => {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <Layout>
      <section className="bg-gradient-hero py-20 md:py-28">
        <div className="container mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-primary font-medium text-sm tracking-widest uppercase">Our Gallery</span>
            <h1 className="font-display text-4xl md:text-6xl font-bold text-foreground mt-3">Beauty in Every Detail</h1>
          </motion.div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {images.map((img, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="cursor-pointer group"
                onClick={() => setSelected(i)}
              >
                <div className="rounded-xl overflow-hidden aspect-square relative">
                  <img
                    src={img.src}
                    alt={img.alt}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/20 transition-colors duration-300" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {selected !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-foreground/90 flex items-center justify-center p-4"
            onClick={() => setSelected(null)}
          >
            <button className="absolute top-6 right-6 text-primary-foreground/80 hover:text-primary-foreground" aria-label="Close">
              <X size={28} />
            </button>
            <motion.img
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              src={images[selected].src}
              alt={images[selected].alt}
              className="max-w-full max-h-[85vh] rounded-xl object-contain"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
};

export default Gallery;
