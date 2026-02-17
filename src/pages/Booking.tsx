import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import Layout from "@/components/Layout";

const serviceOptions = [
  "Haircuts & Styling",
  "Facials & Skincare",
  "Makeup & Bridal",
  "Nail Care",
  "Massage & Spa",
];

const Booking = () => {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    date: "",
    time: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone || !form.service) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setSubmitted(true);
    toast.success("Booking submitted! We'll contact you shortly.");
  };

  return (
    <Layout>
      <section className="bg-gradient-hero py-20 md:py-28">
        <div className="container mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-primary font-medium text-sm tracking-widest uppercase">Get in Touch</span>
            <h1 className="font-display text-4xl md:text-6xl font-bold text-foreground mt-3">Book an Appointment</h1>
            <p className="text-muted-foreground text-lg mt-4 max-w-xl mx-auto">
              Schedule your beauty session and let us take care of the rest.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Booking Form */}
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              {submitted ? (
                <div className="bg-card rounded-2xl p-12 text-center shadow-rose">
                  <CheckCircle size={64} className="text-primary mx-auto mb-6" />
                  <h2 className="font-display text-3xl font-bold text-foreground mb-3">Thank You!</h2>
                  <p className="text-muted-foreground mb-6">Your booking has been submitted. We'll get back to you within 24 hours.</p>
                  <button
                    onClick={() => { setSubmitted(false); setForm({ name: "", email: "", phone: "", service: "", date: "", time: "", message: "" }); }}
                    className="bg-primary text-primary-foreground px-6 py-3 rounded-full font-medium hover:bg-primary/90 transition-all text-sm"
                  >
                    Book Another
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="bg-card rounded-2xl p-8 md:p-10 shadow-rose space-y-5">
                  <h2 className="font-display text-2xl font-bold text-foreground mb-2">Booking Form</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1 block">Name *</label>
                      <input name="name" value={form.name} onChange={handleChange} required maxLength={100} className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all text-sm" placeholder="Your name" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1 block">Email *</label>
                      <input name="email" type="email" value={form.email} onChange={handleChange} required maxLength={255} className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all text-sm" placeholder="your@email.com" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1 block">Phone *</label>
                      <input name="phone" type="tel" value={form.phone} onChange={handleChange} required maxLength={20} className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all text-sm" placeholder="+977 98..." />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1 block">Service *</label>
                      <select name="service" value={form.service} onChange={handleChange} required className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all text-sm">
                        <option value="">Select a service</option>
                        {serviceOptions.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1 block">Preferred Date</label>
                      <input name="date" type="date" value={form.date} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all text-sm" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1 block">Preferred Time</label>
                      <input name="time" type="time" value={form.time} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all text-sm" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">Message</label>
                    <textarea name="message" value={form.message} onChange={handleChange} maxLength={1000} rows={4} className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all text-sm resize-none" placeholder="Any special requests..." />
                  </div>
                  <button type="submit" className="w-full bg-primary text-primary-foreground py-3.5 rounded-full font-medium hover:bg-primary/90 transition-all shadow-rose text-sm tracking-wide">
                    Submit Booking
                  </button>
                </form>
              )}
            </motion.div>

            {/* Contact Info & Map */}
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-8">
              <div>
                <h2 className="font-display text-2xl font-bold text-foreground mb-6">Contact Information</h2>
                <div className="space-y-5">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-rose-light flex items-center justify-center shrink-0">
                      <MapPin size={20} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Location</h3>
                      <p className="text-muted-foreground text-sm">Dang, Ghorahi, Nepal</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-rose-light flex items-center justify-center shrink-0">
                      <Phone size={20} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Phone</h3>
                      <p className="text-muted-foreground text-sm">+977 98-XXXXXXXX</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-rose-light flex items-center justify-center shrink-0">
                      <Mail size={20} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Email</h3>
                      <p className="text-muted-foreground text-sm">info@radianceglow.com</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Google Maps Embed */}
              <div className="rounded-2xl overflow-hidden shadow-rose">
                <iframe
                  title="Radiance Glow Location - Dang, Ghorahi"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d56516.31397712412!2d82.44!3d28.05!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3997a1e387d3e0e1%3A0xae82cfc2e3e0e0e0!2sGhorahi%2C%20Nepal!5e0!3m2!1sen!2snp!4v1690000000000!5m2!1sen!2snp"
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

              {/* Hours */}
              <div className="bg-cream rounded-2xl p-6">
                <h3 className="font-display text-lg font-semibold text-foreground mb-3">Opening Hours</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-muted-foreground"><span>Sunday – Friday</span><span className="font-medium text-foreground">9:00 AM – 7:00 PM</span></div>
                  <div className="flex justify-between text-muted-foreground"><span>Saturday</span><span className="font-medium text-foreground">10:00 AM – 5:00 PM</span></div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Booking;
