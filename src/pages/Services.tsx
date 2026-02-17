import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Scissors, Heart, Sparkles, Palette, Flower2 } from "lucide-react";
import Layout from "@/components/Layout";
import serviceHair from "@/assets/service-hair.jpg";
import serviceFacial from "@/assets/service-facial.jpg";
import serviceMakeup from "@/assets/service-makeup.jpg";
import serviceNails from "@/assets/service-nails.jpg";
import serviceSpa from "@/assets/service-spa.jpg";

const services = [
  {
    title: "Haircuts & Styling",
    description: "From trendy cuts to elegant updos, our expert stylists create the perfect look for every occasion. We use premium products to keep your hair healthy and beautiful.",
    image: serviceHair,
    icon: Scissors,
  },
  {
    title: "Facials & Skincare",
    description: "Rejuvenate your skin with our customized facials and skincare treatments. We analyze your skin type and provide tailored solutions for a radiant glow.",
    image: serviceFacial,
    icon: Heart,
  },
  {
    title: "Makeup & Bridal",
    description: "From everyday makeup to stunning bridal looks, our artists bring out your natural beauty. We specialize in South Asian and Western bridal styles.",
    image: serviceMakeup,
    icon: Sparkles,
  },
  {
    title: "Nail Care",
    description: "Pamper your hands and feet with our manicure, pedicure, and nail art services. Choose from classic elegance to bold, creative designs.",
    image: serviceNails,
    icon: Palette,
  },
  {
    title: "Massage & Spa",
    description: "Relax and unwind with our therapeutic massage and spa treatments. From deep tissue to aromatherapy, find your perfect escape from daily stress.",
    image: serviceSpa,
    icon: Flower2,
  },
];

const Services = () => {
  return (
    <Layout>
      {/* Header */}
      <section className="bg-gradient-hero py-20 md:py-28">
        <div className="container mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="text-primary font-medium text-sm tracking-widest uppercase">Our Services</span>
            <h1 className="font-display text-4xl md:text-6xl font-bold text-foreground mt-3">
              Beauty Treatments
            </h1>
            <p className="text-muted-foreground text-lg mt-4 max-w-xl mx-auto">
              Discover our range of premium beauty services designed to make you look and feel your best.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services List */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col gap-20">
            {services.map((service, i) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className={`flex flex-col md:flex-row gap-8 md:gap-16 items-center ${
                  i % 2 !== 0 ? "md:flex-row-reverse" : ""
                }`}
              >
                <div className="w-full md:w-1/2">
                  <div className="rounded-2xl overflow-hidden shadow-rose aspect-[4/3]">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                </div>
                <div className="w-full md:w-1/2">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-rose-light flex items-center justify-center">
                      <service.icon size={22} className="text-primary" />
                    </div>
                    <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">{service.title}</h2>
                  </div>
                  <p className="text-muted-foreground leading-relaxed mb-6">{service.description}</p>
                  <Link
                    to="/booking"
                    className="inline-block bg-primary text-primary-foreground px-7 py-3 rounded-full font-medium hover:bg-primary/90 transition-all shadow-rose text-sm tracking-wide"
                  >
                    Book Service
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Services;
