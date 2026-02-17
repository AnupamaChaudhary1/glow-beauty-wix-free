import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Scissors, Heart, Sparkles, Palette, Flower2, Check } from "lucide-react";
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
    packages: [
      { name: "Basic Cut", price: "Rs. 300", features: ["Simple haircut", "Wash & dry"] },
      { name: "Style & Cut", price: "Rs. 800", features: ["Haircut & styling", "Wash & blow dry", "Hair serum treatment"], popular: true },
      { name: "Premium Makeover", price: "Rs. 2,000", features: ["Cut, color & styling", "Deep conditioning", "Scalp massage", "Premium products"] },
    ],
  },
  {
    title: "Facials & Skincare",
    description: "Rejuvenate your skin with our customized facials and skincare treatments. We analyze your skin type and provide tailored solutions for a radiant glow.",
    image: serviceFacial,
    icon: Heart,
    packages: [
      { name: "Classic Facial", price: "Rs. 500", features: ["Deep cleansing", "Moisturizing mask"] },
      { name: "Glow Facial", price: "Rs. 1,200", features: ["Deep cleansing", "Exfoliation", "Vitamin C serum", "Gold mask"], popular: true },
      { name: "Luxury Facial", price: "Rs. 2,500", features: ["Full skin analysis", "Diamond peel", "Anti-aging serum", "LED therapy", "Take-home kit"] },
    ],
  },
  {
    title: "Makeup & Bridal",
    description: "From everyday makeup to stunning bridal looks, our artists bring out your natural beauty. We specialize in South Asian and Western bridal styles.",
    image: serviceMakeup,
    icon: Sparkles,
    packages: [
      { name: "Party Makeup", price: "Rs. 1,500", features: ["Full face makeup", "Lashes included"] },
      { name: "Engagement Look", price: "Rs. 4,000", features: ["HD makeup", "Hairstyling", "Lashes & accessories", "Touch-up kit"], popular: true },
      { name: "Bridal Package", price: "Rs. 8,000", features: ["Airbrush HD makeup", "Bridal hairstyling", "Jewelry setting", "Draping", "Pre-bridal facial", "Full day support"] },
    ],
  },
  {
    title: "Nail Care",
    description: "Pamper your hands and feet with our manicure, pedicure, and nail art services. Choose from classic elegance to bold, creative designs.",
    image: serviceNails,
    icon: Palette,
    packages: [
      { name: "Classic Mani", price: "Rs. 200", features: ["Nail shaping", "Cuticle care", "Polish"] },
      { name: "Mani-Pedi Combo", price: "Rs. 600", features: ["Manicure & pedicure", "Scrub & mask", "Gel polish option"], popular: true },
      { name: "Nail Art Deluxe", price: "Rs. 1,200", features: ["Gel extensions", "Custom nail art", "Hand spa", "Pedicure included"] },
    ],
  },
  {
    title: "Massage & Spa",
    description: "Relax and unwind with our therapeutic massage and spa treatments. From deep tissue to aromatherapy, find your perfect escape from daily stress.",
    image: serviceSpa,
    icon: Flower2,
    packages: [
      { name: "Express Relax", price: "Rs. 500", features: ["30-min back massage", "Aromatherapy"] },
      { name: "Full Body Spa", price: "Rs. 1,500", features: ["60-min full body massage", "Hot stone therapy", "Steam session"], popular: true },
      { name: "Royal Spa Day", price: "Rs. 3,500", features: ["90-min massage", "Body scrub & wrap", "Facial", "Manicure & pedicure", "Herbal tea"] },
    ],
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
            <Link
              to="/prices"
              className="inline-block mt-6 text-primary font-medium text-sm hover:text-primary/80 transition-colors underline underline-offset-4"
            >
              View Full Price List →
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Services List */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col gap-28">
            {services.map((service, i) => (
              <div key={service.title}>
                <motion.div
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

                {/* Pricing Packages */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-12"
                >
                  {service.packages.map((pkg) => (
                    <div
                      key={pkg.name}
                      className={`relative rounded-2xl p-6 transition-all hover:-translate-y-1 duration-300 ${
                        pkg.popular
                          ? "bg-primary text-primary-foreground shadow-rose ring-2 ring-primary"
                          : "bg-card border border-border shadow-sm"
                      }`}
                    >
                      {pkg.popular && (
                        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold text-accent-foreground text-xs font-semibold px-3 py-1 rounded-full">
                          Most Popular
                        </span>
                      )}
                      <h3 className={`font-display text-lg font-semibold mb-1 ${pkg.popular ? "" : "text-foreground"}`}>
                        {pkg.name}
                      </h3>
                      <p className={`text-2xl font-bold mb-4 ${pkg.popular ? "" : "text-gradient-gold"}`}>
                        {pkg.price}
                      </p>
                      <ul className="space-y-2 mb-6">
                        {pkg.features.map((f) => (
                          <li key={f} className={`flex items-start gap-2 text-sm ${pkg.popular ? "text-primary-foreground/90" : "text-muted-foreground"}`}>
                            <Check size={15} className={`mt-0.5 shrink-0 ${pkg.popular ? "text-gold" : "text-primary"}`} />
                            {f}
                          </li>
                        ))}
                      </ul>
                      <Link
                        to="/booking"
                        className={`block text-center py-2.5 rounded-full text-sm font-medium transition-all ${
                          pkg.popular
                            ? "bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                            : "bg-rose-light text-primary hover:bg-primary hover:text-primary-foreground"
                        }`}
                      >
                        Book Now
                      </Link>
                    </div>
                  ))}
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Services;
