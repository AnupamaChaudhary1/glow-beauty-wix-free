import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LogOut, Download, Calendar, MessageSquare, Star, Trash2, CheckCircle, Send, DollarSign, Image, Plus, Pencil, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface Booking {
  id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  preferred_date: string | null;
  preferred_time: string | null;
  message: string | null;
  status: string;
  created_at: string;
}

interface Feedback {
  id: string;
  name: string;
  email: string | null;
  message: string;
  rating: number;
  created_at: string;
}

interface ServicePrice {
  id: string;
  category: string;
  item_name: string;
  price: string;
  sort_order: number;
}

interface GalleryPhoto {
  id: string;
  url: string;
  caption: string | null;
  sort_order: number;
}

type Tab = "bookings" | "feedback" | "prices" | "gallery";

const AdminDashboard = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [prices, setPrices] = useState<ServicePrice[]>([]);
  const [galleryPhotos, setGalleryPhotos] = useState<GalleryPhoto[]>([]);
  const [tab, setTab] = useState<Tab>("bookings");
  const [loading, setLoading] = useState(true);
  const [acceptingId, setAcceptingId] = useState<string | null>(null);
  const navigate = useNavigate();

  // Price editing state
  const [editingPrice, setEditingPrice] = useState<ServicePrice | null>(null);
  const [newPrice, setNewPrice] = useState({ category: "", item_name: "", price: "" });
  const [showAddPrice, setShowAddPrice] = useState(false);

  // Gallery upload state
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate("/admin/login"); return; }
      const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", session.user.id).eq("role", "admin");
      if (!roles || roles.length === 0) {
        toast.error("Access denied. Admin privileges required.");
        await supabase.auth.signOut();
        navigate("/admin/login");
        return;
      }
      fetchData();
    };
    checkAuth();
  }, [navigate]);

  const fetchData = async () => {
    setLoading(true);
    const [bookingRes, feedbackRes, priceRes, galleryRes] = await Promise.all([
      supabase.from("bookings" as any).select("*").order("created_at", { ascending: false }),
      supabase.from("feedback" as any).select("*").order("created_at", { ascending: false }),
      supabase.from("service_prices" as any).select("*").order("category").order("sort_order"),
      supabase.from("gallery_photos" as any).select("*").order("sort_order"),
    ]);
    setBookings((bookingRes.data as any as Booking[]) || []);
    setFeedbacks((feedbackRes.data as any as Feedback[]) || []);
    setPrices((priceRes.data as any as ServicePrice[]) || []);
    setGalleryPhotos((galleryRes.data as any as GalleryPhoto[]) || []);
    setLoading(false);
  };

  const handleLogout = async () => { await supabase.auth.signOut(); navigate("/admin/login"); };

  const handleDelete = async (table: string, id: string) => {
    const { error } = await supabase.from(table as any).delete().eq("id", id);
    if (error) { toast.error("Failed to delete."); return; }
    toast.success("Deleted.");
    fetchData();
  };

  const handleAccept = async (bookingId: string) => {
    setAcceptingId(bookingId);
    try {
      const { data, error } = await supabase.functions.invoke("send-acceptance-email", { body: { bookingId } });
      if (error) throw error;
      toast.success(data?.emailSent ? "Accepted & email sent!" : "Accepted!");
      fetchData();
    } catch { toast.error("Failed to accept booking."); }
    setAcceptingId(null);
  };

  const handleMarkCompleted = async (bookingId: string) => {
    const { error } = await supabase.from("bookings" as any).update({ status: "completed" }).eq("id", bookingId);
    if (error) { toast.error("Failed to update."); return; }
    toast.success("Marked as completed.");
    fetchData();
  };

  // Price management
  const handleSavePrice = async (item: ServicePrice) => {
    if (!editingPrice) return;
    const { error } = await supabase.from("service_prices" as any).update({
      item_name: item.item_name,
      price: item.price,
      category: item.category,
    }).eq("id", item.id);
    if (error) { toast.error("Failed to update price."); return; }
    toast.success("Price updated!");
    setEditingPrice(null);
    fetchData();
  };

  const handleAddPrice = async () => {
    if (!newPrice.category || !newPrice.item_name || !newPrice.price) { toast.error("Fill all fields."); return; }
    const { error } = await supabase.from("service_prices" as any).insert({
      category: newPrice.category,
      item_name: newPrice.item_name,
      price: newPrice.price,
      sort_order: prices.filter(p => p.category === newPrice.category).length + 1,
    });
    if (error) { toast.error("Failed to add price."); return; }
    toast.success("Price added!");
    setNewPrice({ category: "", item_name: "", price: "" });
    setShowAddPrice(false);
    fetchData();
  };

  // Gallery management
  const handleUploadPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { toast.error("Please select an image file."); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error("Max file size is 5MB."); return; }

    setUploading(true);
    const fileName = `${Date.now()}-${file.name}`;
    const { error: uploadError } = await supabase.storage.from("gallery").upload(fileName, file);
    if (uploadError) { toast.error("Upload failed."); setUploading(false); return; }

    const { data: urlData } = supabase.storage.from("gallery").getPublicUrl(fileName);
    const { error: insertError } = await supabase.from("gallery_photos" as any).insert({
      url: urlData.publicUrl,
      caption: file.name,
      sort_order: galleryPhotos.length + 1,
    });
    if (insertError) { toast.error("Failed to save photo."); setUploading(false); return; }
    toast.success("Photo uploaded!");
    setUploading(false);
    fetchData();
  };

  const handleDeletePhoto = async (photo: GalleryPhoto) => {
    // Extract filename from URL
    const parts = photo.url.split("/gallery/");
    const filePath = parts[parts.length - 1];
    await supabase.storage.from("gallery").remove([filePath]);
    await supabase.from("gallery_photos" as any).delete().eq("id", photo.id);
    toast.success("Photo deleted!");
    fetchData();
  };

  const downloadCSV = (data: any[], filename: string) => {
    if (!data.length) return;
    const headers = Object.keys(data[0]);
    const csv = [headers.join(","), ...data.map((row) => headers.map((h) => `"${String(row[h] ?? "").replace(/"/g, '""')}"`).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `${filename}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  const formatDate = (d: string) => new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });

  const statusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800",
      accepted: "bg-blue-100 text-blue-800",
      completed: "bg-green-100 text-green-800",
    };
    return <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${styles[status] || "bg-muted text-muted-foreground"}`}>{status.charAt(0).toUpperCase() + status.slice(1)}</span>;
  };

  const categories = [...new Set(prices.map(p => p.category))];

  const tabs: { key: Tab; label: string; icon: React.ReactNode; count?: number }[] = [
    { key: "bookings", label: "Bookings", icon: <Calendar size={16} />, count: bookings.length },
    { key: "feedback", label: "Feedback", icon: <MessageSquare size={16} />, count: feedbacks.length },
    { key: "prices", label: "Prices", icon: <DollarSign size={16} /> },
    { key: "gallery", label: "Gallery", icon: <Image size={16} />, count: galleryPhotos.length },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border px-4 py-4">
        <div className="container mx-auto flex items-center justify-between">
          <h1 className="font-display text-xl font-bold text-foreground">Radiance <span className="text-gradient-gold">Glow</span> — Dashboard</h1>
          <button onClick={handleLogout} className="text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-2 text-sm"><LogOut size={16} /> Logout</button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {tabs.map((t) => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-colors inline-flex items-center gap-2 ${tab === t.key ? "bg-primary text-primary-foreground" : "bg-rose-light text-foreground hover:bg-primary/20"}`}>
              {t.icon} {t.label} {t.count !== undefined ? `(${t.count})` : ""}
            </button>
          ))}
        </div>

        {/* Download for bookings/feedback */}
        {(tab === "bookings" || tab === "feedback") && (
          <div className="mb-6">
            <button onClick={() => tab === "bookings" ? downloadCSV(bookings, "bookings") : downloadCSV(feedbacks, "feedback")}
              className="inline-flex items-center gap-2 px-4 py-2 bg-foreground text-background rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
              <Download size={16} /> Download {tab === "bookings" ? "Bookings" : "Feedback"} CSV
            </button>
          </div>
        )}

        {loading ? (
          <div className="text-center py-20 text-muted-foreground">Loading...</div>
        ) : tab === "bookings" ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-card rounded-2xl shadow-rose overflow-hidden">
            {bookings.length === 0 ? (
              <div className="p-12 text-center text-muted-foreground">No bookings yet.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-rose-light/50">
                      <th className="px-4 py-3 text-left font-medium text-foreground">Name</th>
                      <th className="px-4 py-3 text-left font-medium text-foreground">Email</th>
                      <th className="px-4 py-3 text-left font-medium text-foreground">Phone</th>
                      <th className="px-4 py-3 text-left font-medium text-foreground">Service</th>
                      <th className="px-4 py-3 text-left font-medium text-foreground">Date/Time</th>
                      <th className="px-4 py-3 text-left font-medium text-foreground">Status</th>
                      <th className="px-4 py-3 text-left font-medium text-foreground">Submitted</th>
                      <th className="px-4 py-3 text-left font-medium text-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((b) => (
                      <tr key={b.id} className="border-b border-border hover:bg-rose-light/30 transition-colors">
                        <td className="px-4 py-3 font-medium text-foreground">{b.name}</td>
                        <td className="px-4 py-3 text-muted-foreground">{b.email}</td>
                        <td className="px-4 py-3 text-muted-foreground">{b.phone}</td>
                        <td className="px-4 py-3 text-foreground">{b.service}</td>
                        <td className="px-4 py-3 text-muted-foreground">{b.preferred_date || "—"} {b.preferred_time || ""}</td>
                        <td className="px-4 py-3">{statusBadge(b.status)}</td>
                        <td className="px-4 py-3 text-muted-foreground text-xs">{formatDate(b.created_at)}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            {b.status === "pending" && (
                              <button onClick={() => handleAccept(b.id)} disabled={acceptingId === b.id} className="text-blue-600 hover:text-blue-800 transition-colors disabled:opacity-50" title="Accept & send email"><Send size={16} /></button>
                            )}
                            {b.status === "accepted" && (
                              <button onClick={() => handleMarkCompleted(b.id)} className="text-green-600 hover:text-green-800 transition-colors" title="Mark completed"><CheckCircle size={16} /></button>
                            )}
                            <button onClick={() => handleDelete("bookings", b.id)} className="text-muted-foreground hover:text-destructive transition-colors" title="Delete"><Trash2 size={16} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        ) : tab === "feedback" ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-card rounded-2xl shadow-rose overflow-hidden">
            {feedbacks.length === 0 ? (
              <div className="p-12 text-center text-muted-foreground">No feedback yet.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-rose-light/50">
                      <th className="px-4 py-3 text-left font-medium text-foreground">Name</th>
                      <th className="px-4 py-3 text-left font-medium text-foreground">Email</th>
                      <th className="px-4 py-3 text-left font-medium text-foreground">Rating</th>
                      <th className="px-4 py-3 text-left font-medium text-foreground">Message</th>
                      <th className="px-4 py-3 text-left font-medium text-foreground">Submitted</th>
                      <th className="px-4 py-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {feedbacks.map((f) => (
                      <tr key={f.id} className="border-b border-border hover:bg-rose-light/30 transition-colors">
                        <td className="px-4 py-3 font-medium text-foreground">{f.name}</td>
                        <td className="px-4 py-3 text-muted-foreground">{f.email || "—"}</td>
                        <td className="px-4 py-3"><span className="inline-flex items-center gap-1 text-gold"><Star size={14} className="fill-gold" /> {f.rating}</span></td>
                        <td className="px-4 py-3 text-muted-foreground max-w-[300px] truncate">{f.message}</td>
                        <td className="px-4 py-3 text-muted-foreground text-xs">{formatDate(f.created_at)}</td>
                        <td className="px-4 py-3"><button onClick={() => handleDelete("feedback", f.id)} className="text-muted-foreground hover:text-destructive transition-colors"><Trash2 size={16} /></button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        ) : tab === "prices" ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="font-display text-lg font-bold text-foreground">Manage Prices</h2>
              <button onClick={() => setShowAddPrice(!showAddPrice)} className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
                <Plus size={16} /> Add Item
              </button>
            </div>

            {/* Add new price form */}
            {showAddPrice && (
              <div className="bg-card rounded-xl border border-border p-5 space-y-3">
                <h3 className="font-medium text-foreground text-sm">Add New Price Item</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <select value={newPrice.category} onChange={(e) => setNewPrice({ ...newPrice, category: e.target.value })} className="px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm">
                    <option value="">Select Category</option>
                    {["Haircuts & Styling", "Facials & Skincare", "Makeup & Bridal", "Nail Care", "Massage & Spa"].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <input value={newPrice.item_name} onChange={(e) => setNewPrice({ ...newPrice, item_name: e.target.value })} placeholder="Service name" maxLength={100} className="px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm" />
                  <input value={newPrice.price} onChange={(e) => setNewPrice({ ...newPrice, price: e.target.value })} placeholder="Rs. 500" maxLength={50} className="px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm" />
                </div>
                <div className="flex gap-2">
                  <button onClick={handleAddPrice} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90">Save</button>
                  <button onClick={() => setShowAddPrice(false)} className="px-4 py-2 border border-border rounded-lg text-sm text-muted-foreground hover:text-foreground">Cancel</button>
                </div>
              </div>
            )}

            {/* Price list by category */}
            {categories.map((cat) => (
              <div key={cat} className="bg-card rounded-xl border border-border overflow-hidden">
                <div className="px-5 py-3 bg-rose-light/50 border-b border-border">
                  <h3 className="font-display font-bold text-foreground">{cat}</h3>
                </div>
                <div className="divide-y divide-border">
                  {prices.filter(p => p.category === cat).map((item) => (
                    <div key={item.id} className="flex items-center justify-between px-5 py-3 hover:bg-muted/30 transition-colors">
                      {editingPrice?.id === item.id ? (
                        <div className="flex items-center gap-3 flex-1">
                          <input value={editingPrice.item_name} onChange={(e) => setEditingPrice({ ...editingPrice, item_name: e.target.value })} className="px-2 py-1 rounded border border-border bg-background text-foreground text-sm flex-1" maxLength={100} />
                          <input value={editingPrice.price} onChange={(e) => setEditingPrice({ ...editingPrice, price: e.target.value })} className="px-2 py-1 rounded border border-border bg-background text-foreground text-sm w-32" maxLength={50} />
                          <button onClick={() => handleSavePrice(editingPrice)} className="text-primary hover:text-primary/80"><CheckCircle size={16} /></button>
                          <button onClick={() => setEditingPrice(null)} className="text-muted-foreground hover:text-foreground"><X size={16} /></button>
                        </div>
                      ) : (
                        <>
                          <span className="text-foreground text-sm">{item.item_name}</span>
                          <div className="flex items-center gap-3">
                            <span className="font-semibold text-primary text-sm">{item.price}</span>
                            <button onClick={() => setEditingPrice({ ...item })} className="text-muted-foreground hover:text-foreground transition-colors"><Pencil size={14} /></button>
                            <button onClick={() => handleDelete("service_prices", item.id)} className="text-muted-foreground hover:text-destructive transition-colors"><Trash2 size={14} /></button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </motion.div>
        ) : (
          /* Gallery Tab */
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="font-display text-lg font-bold text-foreground">Manage Gallery</h2>
              <label className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors cursor-pointer">
                <Plus size={16} /> {uploading ? "Uploading..." : "Upload Photo"}
                <input type="file" accept="image/*" onChange={handleUploadPhoto} className="hidden" disabled={uploading} />
              </label>
            </div>

            {galleryPhotos.length === 0 ? (
              <div className="bg-card rounded-2xl p-12 text-center text-muted-foreground border border-border">No gallery photos yet. Upload some!</div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {galleryPhotos.map((photo) => (
                  <div key={photo.id} className="relative group rounded-xl overflow-hidden aspect-square bg-muted">
                    <img src={photo.url} alt={photo.caption || "Gallery"} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/40 transition-colors flex items-center justify-center">
                      <button onClick={() => handleDeletePhoto(photo)} className="opacity-0 group-hover:opacity-100 transition-opacity bg-destructive text-destructive-foreground p-2 rounded-full hover:bg-destructive/90">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
