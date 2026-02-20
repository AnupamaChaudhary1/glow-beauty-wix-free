import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Send, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import Layout from "@/components/Layout";
import { supabase } from "@/integrations/supabase/client";

const defaultTestimonials = [
  {
    name: "Priya Sharma",
    text: "Radiance Glow transformed my look for my wedding day. The bridal makeup was absolutely flawless and lasted the entire celebration. I received so many compliments!",
    rating: 5,
    service: "Bridal Makeup",
  },
  {
    name: "Anita Chaudhary",
    text: "I've been visiting Radiance Glow for my skincare treatments for 6 months now. My skin has never looked better! The staff is incredibly professional and friendly.",
    rating: 5,
    service: "Facials & Skincare",
  },
  {
    name: "Sita Poudel",
    text: "The best salon experience in Ghorahi! The spa treatment was so relaxing and the ambiance is beautiful. I always leave feeling refreshed and rejuvenated.",
    rating: 5,
    service: "Massage & Spa",
  },
];

interface FeedbackItem {
  id: string;
  name: string;
  message: string;
  rating: number;
  created_at: string;
}

const Testimonials = () => {
  const [current, setCurrent] = useState(0);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [feedback, setFeedback] = useState({ name: "", email: "", message: "", rating: 5 });
  const [publicFeedback, setPublicFeedback] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFeedback = async () => {
      const { data } = await supabase
        .from("feedback" as any)
        .select("id, name, message, rating, created_at")
        .order("created_at", { ascending: false })
        .limit(20);
      if (data) setPublicFeedback(data as any as FeedbackItem[]);
    };
    fetchFeedback();
  }, [feedbackSubmitted]);

  const allTestimonials = [
    ...defaultTestimonials.map((t) => ({ ...t, isDefault: true })),
    ...publicFeedback.map((f) => ({ name: f.name, text: f.message, rating: f.rating, service: "", isDefault: false })),
  ];

  const displayed = allTestimonials.length > 0 ? allTestimonials : defaultTestimonials.map((t) => ({ ...t, isDefault: true }));

  const next = () => setCurrent((c) => (c + 1) % displayed.length);
  const prev = () => setCurrent((c) => (c - 1 + displayed.length) % displayed.length);

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.name || !feedback.message) {
      toast.error("Please fill in your name and message.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("feedback" as any).insert({
      name: feedback.name,
      email: feedback.email || null,
      message: feedback.message,
      rating: feedback.rating,
    });
    setLoading(false);
    if (error) {
      toast.error("Something went wrong. Please try again.");
      return;
    }
    setFeedbackSubmitted(true);
    toast.success("Thank you for your feedback!");
  };

  return (
    <Layout>
      <section className="bg-gradient-hero py-20 md:py-28">
        <div className="container mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-primary font-medium text-sm tracking-widest uppercase">Testimonials</span>
            <h1 className="font-display text-4xl md:text-6xl font-bold text-foreground mt-3">What Our Clients Say</h1>
          </motion.div>
        </div>
      </section>

      {/* Carousel */}
      <section className="py-24">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.4 }}
                className="bg-card rounded-2xl p-8 md:p-12 shadow-rose text-center"
              >
                <div className="flex justify-center gap-1 mb-6">
                  {Array.from({ length: displayed[current].rating }).map((_, i) => (
                    <Star key={i} size={20} className="text-gold fill-gold" />
                  ))}
                </div>
                <blockquote className="font-display text-xl md:text-2xl text-foreground italic leading-relaxed mb-6">
                  "{displayed[current].text}"
                </blockquote>
                <p className="font-semibold text-foreground">{displayed[current].name}</p>
                {displayed[current].service && (
                  <p className="text-sm text-muted-foreground">{displayed[current].service}</p>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="flex justify-center gap-4 mt-8">
              <button onClick={prev} className="w-12 h-12 rounded-full bg-rose-light flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors" aria-label="Previous">
                <ChevronLeft size={20} />
              </button>
              <div className="flex items-center gap-2">
                {displayed.map((_, i) => (
                  <button key={i} onClick={() => setCurrent(i)} className={`w-2.5 h-2.5 rounded-full transition-colors ${i === current ? "bg-primary" : "bg-border"}`} aria-label={`Go to testimonial ${i + 1}`} />
                ))}
              </div>
              <button onClick={next} className="w-12 h-12 rounded-full bg-rose-light flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors" aria-label="Next">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* All Reviews Grid */}
      {publicFeedback.length > 0 && (
        <section className="py-16 bg-rose-light/30">
          <div className="container mx-auto px-4 max-w-5xl">
            <h2 className="font-display text-3xl font-bold text-foreground text-center mb-10">All Reviews</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {publicFeedback.map((f) => (
                <motion.div
                  key={f.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-card rounded-xl p-6 shadow-sm border border-border"
                >
                  <div className="flex gap-1 mb-3">
                    {Array.from({ length: f.rating }).map((_, i) => (
                      <Star key={i} size={14} className="text-gold fill-gold" />
                    ))}
                  </div>
                  <p className="text-foreground text-sm mb-4 line-clamp-4">"{f.message}"</p>
                  <p className="font-semibold text-foreground text-sm">{f.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(f.created_at).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Feedback Form */}
      <section className="py-20 bg-gradient-rose">
        <div className="container mx-auto px-4 max-w-2xl">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-display text-3xl font-bold text-foreground text-center mb-2">Share Your Experience</h2>
            <p className="text-muted-foreground text-center mb-8">We'd love to hear about your visit!</p>

            {feedbackSubmitted ? (
              <div className="bg-card rounded-2xl p-12 text-center shadow-rose">
                <CheckCircle size={56} className="text-primary mx-auto mb-4" />
                <h3 className="font-display text-2xl font-bold text-foreground mb-2">Thank You!</h3>
                <p className="text-muted-foreground">Your feedback means the world to us.</p>
              </div>
            ) : (
              <form onSubmit={handleFeedbackSubmit} className="bg-card rounded-2xl p-8 shadow-rose space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">Name *</label>
                    <input value={feedback.name} onChange={(e) => setFeedback({ ...feedback, name: e.target.value })} required maxLength={100} className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all text-sm" placeholder="Your name" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">Email</label>
                    <input type="email" value={feedback.email} onChange={(e) => setFeedback({ ...feedback, email: e.target.value })} maxLength={255} className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all text-sm" placeholder="your@email.com" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button key={star} type="button" onClick={() => setFeedback({ ...feedback, rating: star })}>
                        <Star size={24} className={`transition-colors ${star <= feedback.rating ? "text-gold fill-gold" : "text-border"}`} />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Your Experience *</label>
                  <textarea value={feedback.message} onChange={(e) => setFeedback({ ...feedback, message: e.target.value })} required maxLength={1000} rows={4} className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all text-sm resize-none" placeholder="Tell us about your experience..." />
                </div>
                <button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground py-3.5 rounded-full font-medium hover:bg-primary/90 transition-all shadow-rose text-sm tracking-wide inline-flex items-center justify-center gap-2 disabled:opacity-50">
                  <Send size={16} /> {loading ? "Submitting..." : "Submit Feedback"}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Testimonials;
