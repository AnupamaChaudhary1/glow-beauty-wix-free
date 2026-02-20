import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verify admin
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No auth header");

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) throw new Error("Unauthorized");

    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin");
    if (!roles || roles.length === 0) throw new Error("Admin required");

    const { bookingId } = await req.json();
    if (!bookingId) throw new Error("bookingId required");

    // Get booking details
    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .select("*")
      .eq("id", bookingId)
      .single();
    if (bookingError || !booking) throw new Error("Booking not found");

    // Update status to accepted
    await supabase
      .from("bookings")
      .update({ status: "accepted" })
      .eq("id", bookingId);

    // Send email using Lovable AI gateway to generate the email content
    // For now, we use Supabase's built-in email (via auth) — but since we can't send arbitrary emails via auth,
    // we'll use a simple approach: Use the Resend-compatible endpoint or just log it.
    // Since no email service is configured, we'll use the LOVABLE_API_KEY to generate a nice message
    // and store it as a notification. For actual email sending, we need an email service.

    // For MVP: we'll attempt to use Supabase's built-in SMTP if configured
    // If not, we just update the status and return success

    const emailHtml = `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <h1 style="color: #b76e79; text-align: center;">Radiance Glow</h1>
        <h2 style="color: #333; text-align: center;">Your Appointment is Confirmed! ✨</h2>
        <p>Dear <strong>${booking.name}</strong>,</p>
        <p>We are delighted to confirm your appointment at <strong>Radiance Glow Beauty Salon</strong>.</p>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee; color: #888;">Service</td><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>${booking.service}</strong></td></tr>
          ${booking.preferred_date ? `<tr><td style="padding: 8px; border-bottom: 1px solid #eee; color: #888;">Date</td><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>${booking.preferred_date}</strong></td></tr>` : ""}
          ${booking.preferred_time ? `<tr><td style="padding: 8px; border-bottom: 1px solid #eee; color: #888;">Time</td><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>${booking.preferred_time}</strong></td></tr>` : ""}
        </table>
        <p>Thank you for choosing Radiance Glow. We look forward to making you feel beautiful!</p>
        <p style="color: #b76e79;">With love,<br/>Radiance Glow Team</p>
      </div>
    `;

    // Try sending via Resend if API key exists, otherwise just confirm status update
    const resendKey = Deno.env.get("RESEND_API_KEY");
    let emailSent = false;

    if (resendKey) {
      const emailRes = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Radiance Glow <onboarding@resend.dev>",
          to: [booking.email],
          subject: "Your Appointment is Confirmed! ✨ - Radiance Glow",
          html: emailHtml,
        }),
      });
      emailSent = emailRes.ok;
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        emailSent,
        message: emailSent ? "Booking accepted and email sent" : "Booking accepted (no email service configured)" 
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
