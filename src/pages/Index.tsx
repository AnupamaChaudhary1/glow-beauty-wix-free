import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, Scissors, Heart, Star } from "lucide-react";
import Layout from "@/components/Layout";
import heroImage from "@/assets/hero-model.jpg";
import serviceHair from "@/assets/service-hair.jpg";
import serviceFacial from "@/assets/service-facial.jpg";
import serviceMakeup from "@/assets/service-makeup.jpg";

const featuredServices = [
  { title: "Haircuts & Styling", image: serviceHair, icon: Scissors },
  { title: "Facials & Skincare", image: serviceFacial, icon: Heart },
  { title: "Makeup & Bridal", image: serviceMakeup, icon: Sparkles },
];

const Index = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImage} alt="Model holding lipstick - Radiance Glow Beauty Parlour" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/70 via-foreground/40 to-transparent" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-xl"
          >
            <span className="inline-flex items-center gap-2 text-gold font-medium text-sm tracking-widest uppercase mb-4">
              <Sparkles size={16} /> Dang, Ghorahi
            </span>
            <h1 className="font-display text-5xl md:text-7xl font-bold text-primary-foreground leading-tight mb-6">
              Glow Like <br />
              <span className="italic">Never Before</span>
            </h1>
            <p className="text-primary-foreground/80 text-lg md:text-xl mb-8 font-light leading-relaxed">
              Premium beauty treatments & makeup products. Discover your radiance with our expert beauty professionals.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/booking"
                className="bg-primary text-primary-foreground px-8 py-3.5 rounded-full font-medium hover:bg-primary/90 transition-all shadow-rose text-sm tracking-wide"
              >
                Book Now
              </Link>
              <Link
                to="/gallery"
                className="bg-primary-foreground/15 text-primary-foreground px-8 py-3.5 rounded-full font-medium hover:bg-primary-foreground/25 transition-all backdrop-blur-sm text-sm tracking-wide border border-primary-foreground/20"
              >
                View Gallery
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="py-24 bg-gradient-rose">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="text-primary font-medium text-sm tracking-widest uppercase">What We Offer</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mt-3">
              Our Signature Services
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredServices.map((service, i) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
              >
                <Link to="/services" className="group block">
                  <div className="relative rounded-2xl overflow-hidden aspect-[4/5] mb-5">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
                    <div className="absolute bottom-6 left-6 right-6">
                      <div className="flex items-center gap-2 text-primary-foreground">
                        <service.icon size={20} className="text-gold" />
                        <h3 className="font-display text-xl font-semibold">{service.title}</h3>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/services"
              className="inline-flex items-center gap-2 text-primary font-medium hover:text-primary/80 transition-colors text-sm tracking-wide"
            >
              View All Services →
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonial Preview */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <Star size={32} className="text-gold mx-auto mb-6" />
            <blockquote className="font-display text-2xl md:text-3xl text-foreground italic leading-relaxed mb-6">
              "Radiance Glow transformed my look for my wedding. The makeup was flawless and lasted all day!"
            </blockquote>
            <p className="text-muted-foreground font-medium">— Priya S., Bride</p>
            <Link
              to="/testimonials"
              className="inline-block mt-8 text-primary font-medium text-sm hover:text-primary/80 transition-colors"
            >
              Read More Reviews →
            </Link>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
