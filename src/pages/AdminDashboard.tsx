import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LogOut, Download, Calendar, MessageSquare, Star, Trash2, CheckCircle, Clock, Send } from "lucide-react";
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

const AdminDashboard = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [tab, setTab] = useState<"bookings" | "feedback">("bookings");
  const [loading, setLoading] = useState(true);
  const [acceptingId, setAcceptingId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/admin/login");
        return;
      }
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .eq("role", "admin");
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
    const [bookingRes, feedbackRes] = await Promise.all([
      supabase.from("bookings" as any).select("*").order("created_at", { ascending: false }),
      supabase.from("feedback" as any).select("*").order("created_at", { ascending: false }),
    ]);
    setBookings((bookingRes.data as any as Booking[]) || []);
    setFeedbacks((feedbackRes.data as any as Feedback[]) || []);
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  const handleDelete = async (table: string, id: string) => {
    const { error } = await supabase.from(table as any).delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete.");
      return;
    }
    toast.success("Deleted.");
    fetchData();
  };

  const handleAccept = async (bookingId: string) => {
    setAcceptingId(bookingId);
    try {
      const { data, error } = await supabase.functions.invoke("send-acceptance-email", {
        body: { bookingId },
      });
      if (error) throw error;
      toast.success(data?.emailSent ? "Accepted & email sent!" : "Accepted! (Configure email service to send notifications)");
      fetchData();
    } catch (err: any) {
      toast.error("Failed to accept booking.");
      console.error(err);
    }
    setAcceptingId(null);
  };

  const handleMarkCompleted = async (bookingId: string) => {
    const { error } = await supabase.from("bookings" as any).update({ status: "completed" }).eq("id", bookingId);
    if (error) {
      toast.error("Failed to update.");
      return;
    }
    toast.success("Marked as completed.");
    fetchData();
  };

  const downloadCSV = (data: any[], filename: string) => {
    if (!data.length) return;
    const headers = Object.keys(data[0]);
    const csv = [
      headers.join(","),
      ...data.map((row) =>
        headers.map((h) => `"${String(row[h] ?? "").replace(/"/g, '""')}"`).join(",")
      ),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });

  const statusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800",
      accepted: "bg-blue-100 text-blue-800",
      completed: "bg-green-100 text-green-800",
    };
    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${styles[status] || "bg-muted text-muted-foreground"}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border px-4 py-4">
        <div className="container mx-auto flex items-center justify-between">
          <h1 className="font-display text-xl font-bold text-foreground">
            Radiance <span className="text-gradient-gold">Glow</span> — Dashboard
          </h1>
          <button onClick={handleLogout} className="text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-2 text-sm">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setTab("bookings")}
            className={`px-5 py-2.5 rounded-full text-sm font-medium transition-colors inline-flex items-center gap-2 ${
              tab === "bookings" ? "bg-primary text-primary-foreground" : "bg-rose-light text-foreground hover:bg-primary/20"
            }`}
          >
            <Calendar size={16} /> Bookings ({bookings.length})
          </button>
          <button
            onClick={() => setTab("feedback")}
            className={`px-5 py-2.5 rounded-full text-sm font-medium transition-colors inline-flex items-center gap-2 ${
              tab === "feedback" ? "bg-primary text-primary-foreground" : "bg-rose-light text-foreground hover:bg-primary/20"
            }`}
          >
            <MessageSquare size={16} /> Feedback ({feedbacks.length})
          </button>
        </div>

        {/* Download */}
        <div className="mb-6">
          <button
            onClick={() =>
              tab === "bookings"
                ? downloadCSV(bookings, "bookings")
                : downloadCSV(feedbacks, "feedback")
            }
            className="inline-flex items-center gap-2 px-4 py-2 bg-foreground text-background rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <Download size={16} /> Download {tab === "bookings" ? "Bookings" : "Feedback"} CSV
          </button>
        </div>

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
                              <button
                                onClick={() => handleAccept(b.id)}
                                disabled={acceptingId === b.id}
                                className="text-blue-600 hover:text-blue-800 transition-colors disabled:opacity-50"
                                title="Accept & send email"
                              >
                                <Send size={16} />
                              </button>
                            )}
                            {b.status === "accepted" && (
                              <button
                                onClick={() => handleMarkCompleted(b.id)}
                                className="text-green-600 hover:text-green-800 transition-colors"
                                title="Mark completed"
                              >
                                <CheckCircle size={16} />
                              </button>
                            )}
                            <button onClick={() => handleDelete("bookings", b.id)} className="text-muted-foreground hover:text-destructive transition-colors" title="Delete">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        ) : (
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
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center gap-1 text-gold">
                            <Star size={14} className="fill-gold" /> {f.rating}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground max-w-[300px] truncate">{f.message}</td>
                        <td className="px-4 py-3 text-muted-foreground text-xs">{formatDate(f.created_at)}</td>
                        <td className="px-4 py-3">
                          <button onClick={() => handleDelete("feedback", f.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
