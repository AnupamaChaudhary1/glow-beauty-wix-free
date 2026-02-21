import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Scissors, Heart, Sparkles, Palette, Flower2 } from "lucide-react";
import Layout from "@/components/Layout";
import { supabase } from "@/integrations/supabase/client";

const iconMap: Record<string, React.ElementType> = {
  "Haircuts & Styling": Scissors,
  "Facials & Skincare": Heart,
  "Makeup & Bridal": Sparkles,
  "Nail Care": Palette,
  "Massage & Spa": Flower2,
};

const categoryOrder = ["Haircuts & Styling", "Facials & Skincare", "Makeup & Bridal", "Nail Care", "Massage & Spa"];

interface PriceItem {
  id: string;
  category: string;
  item_name: string;
  price: string;
  sort_order: number;
}

const Prices = () => {
  const [prices, setPrices] = useState<PriceItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrices = async () => {
      const { data } = await supabase
        .from("service_prices" as any)
        .select("*")
        .order("category")
        .order("sort_order");
      setPrices((data as any as PriceItem[]) || []);
      setLoading(false);
    };
    fetchPrices();
  }, []);

  const categories = categoryOrder.filter(cat => prices.some(p => p.category === cat));

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
          {loading ? (
            <div className="text-center py-20 text-muted-foreground">Loading prices...</div>
          ) : (
            <div className="flex flex-col gap-12">
              {categories.map((cat, ci) => {
                const Icon = iconMap[cat] || Scissors;
                const items = prices.filter(p => p.category === cat);
                return (
                  <motion.div
                    key={cat}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: ci * 0.05 }}
                    className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm"
                  >
                    <div className="flex items-center gap-3 px-6 py-5 bg-rose-light/50 border-b border-border">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Icon size={20} className="text-primary" />
                      </div>
                      <h2 className="font-display text-xl font-bold text-foreground">{cat}</h2>
                    </div>
                    <div className="divide-y divide-border">
                      {items.map((item) => (
                        <div key={item.id} className="flex items-center justify-between px-6 py-4 hover:bg-muted/40 transition-colors">
                          <span className="text-foreground text-sm md:text-base">{item.item_name}</span>
                          <span className="font-semibold text-primary text-sm md:text-base whitespace-nowrap ml-4">{item.price}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mt-16">
            <p className="text-muted-foreground mb-6">Ready to book your beauty session?</p>
            <Link to="/booking" className="inline-block bg-primary text-primary-foreground px-8 py-3.5 rounded-full font-medium hover:bg-primary/90 transition-all shadow-rose text-sm tracking-wide">
              Book an Appointment
            </Link>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Prices;
