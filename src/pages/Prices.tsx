import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Scissors, Heart, Sparkles, Palette, Flower2 } from "lucide-react";
import Layout from "@/components/Layout";

const categories = [
  {
    title: "Haircuts & Styling",
    icon: Scissors,
    items: [
      { name: "Ladies Haircut", price: "Rs. 300" },
      { name: "Hair Wash & Blow Dry", price: "Rs. 200" },
      { name: "Hair Coloring (Single)", price: "Rs. 1,000" },
      { name: "Hair Highlights", price: "Rs. 1,500" },
      { name: "Keratin Treatment", price: "Rs. 3,000" },
      { name: "Hair Spa Treatment", price: "Rs. 800" },
      { name: "Updo / Party Hairstyle", price: "Rs. 600" },
      { name: "Hair Straightening", price: "Rs. 2,500" },
    ],
  },
  {
    title: "Facials & Skincare",
    icon: Heart,
    items: [
      { name: "Classic Cleanup", price: "Rs. 300" },
      { name: "Fruit Facial", price: "Rs. 500" },
      { name: "Gold Facial", price: "Rs. 1,000" },
      { name: "Diamond Facial", price: "Rs. 1,500" },
      { name: "Anti-Aging Facial", price: "Rs. 2,000" },
      { name: "Acne Treatment Facial", price: "Rs. 1,200" },
      { name: "Chemical Peel", price: "Rs. 2,500" },
      { name: "De-Tan Treatment", price: "Rs. 800" },
    ],
  },
  {
    title: "Makeup & Bridal",
    icon: Sparkles,
    items: [
      { name: "Light / Day Makeup", price: "Rs. 800" },
      { name: "Party Makeup", price: "Rs. 1,500" },
      { name: "HD Makeup", price: "Rs. 2,500" },
      { name: "Engagement Makeup", price: "Rs. 4,000" },
      { name: "Reception Makeup", price: "Rs. 5,000" },
      { name: "Bridal Makeup (Full)", price: "Rs. 8,000" },
      { name: "Pre-Bridal Package (5 sessions)", price: "Rs. 6,000" },
      { name: "Mehendi Application", price: "Rs. 1,500" },
    ],
  },
  {
    title: "Nail Care",
    icon: Palette,
    items: [
      { name: "Basic Manicure", price: "Rs. 200" },
      { name: "Basic Pedicure", price: "Rs. 250" },
      { name: "Gel Manicure", price: "Rs. 400" },
      { name: "Gel Pedicure", price: "Rs. 500" },
      { name: "Nail Art (per nail)", price: "Rs. 50" },
      { name: "Gel Extensions (Full Set)", price: "Rs. 1,200" },
      { name: "French Tips", price: "Rs. 300" },
      { name: "Nail Repair", price: "Rs. 100" },
    ],
  },
  {
    title: "Massage & Spa",
    icon: Flower2,
    items: [
      { name: "Head & Shoulder Massage (30 min)", price: "Rs. 300" },
      { name: "Back Massage (30 min)", price: "Rs. 500" },
      { name: "Full Body Massage (60 min)", price: "Rs. 1,200" },
      { name: "Aromatherapy Massage (60 min)", price: "Rs. 1,500" },
      { name: "Hot Stone Therapy", price: "Rs. 1,800" },
      { name: "Body Scrub & Wrap", price: "Rs. 2,000" },
      { name: "Steam & Sauna Session", price: "Rs. 400" },
      { name: "Royal Spa Day Package", price: "Rs. 3,500" },
    ],
  },
];

const Prices = () => {
  return (
    <Layout>
      <section className="bg-gradient-hero py-20 md:py-28">
        <div className="container mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-primary font-medium text-sm tracking-widest uppercase">Transparent Pricing</span>
            <h1 className="font-display text-4xl md:text-6xl font-bold text-foreground mt-3">Our Price List</h1>
            <p className="text-muted-foreground text-lg mt-4 max-w-xl mx-auto">
              Quality beauty services at affordable prices. No hidden charges.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex flex-col gap-12">
            {categories.map((cat, ci) => (
              <motion.div
                key={cat.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: ci * 0.05 }}
                className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm"
              >
                {/* Category Header */}
                <div className="flex items-center gap-3 px-6 py-5 bg-rose-light/50 border-b border-border">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <cat.icon size={20} className="text-primary" />
                  </div>
                  <h2 className="font-display text-xl font-bold text-foreground">{cat.title}</h2>
                </div>

                {/* Items */}
                <div className="divide-y divide-border">
                  {cat.items.map((item) => (
                    <div
                      key={item.name}
                      className="flex items-center justify-between px-6 py-4 hover:bg-muted/40 transition-colors"
                    >
                      <span className="text-foreground text-sm md:text-base">{item.name}</span>
                      <span className="font-semibold text-primary text-sm md:text-base whitespace-nowrap ml-4">{item.price}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-16"
          >
            <p className="text-muted-foreground mb-6">Ready to book your beauty session?</p>
            <Link
              to="/booking"
              className="inline-block bg-primary text-primary-foreground px-8 py-3.5 rounded-full font-medium hover:bg-primary/90 transition-all shadow-rose text-sm tracking-wide"
            >
              Book an Appointment
            </Link>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Prices;
