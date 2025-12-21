import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const notificationEmail = Deno.env.get("NOTIFICATION_EMAIL");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NotificationRequest {
  type: "new_comment" | "new_user" | "new_interest";
  userName?: string;
  userEmail?: string;
  concertName?: string;
  commentContent?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!notificationEmail) {
      console.error("NOTIFICATION_EMAIL is not configured");
      return new Response(
        JSON.stringify({ error: "Notification email not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!RESEND_API_KEY) {
      console.error("RESEND_API_KEY is not configured");
      return new Response(
        JSON.stringify({ error: "Resend API key not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { type, userName, userEmail, concertName, commentContent }: NotificationRequest = await req.json();

    console.log(`Processing notification of type: ${type}`);

    let subject: string;
    let htmlContent: string;

    if (type === "new_comment") {
      subject = `💬 New Comment on "${concertName}"`;
      htmlContent = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #333; font-size: 24px; margin-bottom: 20px;">New Comment Posted</h1>
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <p style="margin: 0 0 10px 0;"><strong>Concert:</strong> ${concertName}</p>
            <p style="margin: 0 0 10px 0;"><strong>Posted by:</strong> ${userName}</p>
            <p style="margin: 0;"><strong>Comment:</strong></p>
            <div style="background: white; padding: 15px; border-radius: 4px; margin-top: 10px; border-left: 3px solid #6366f1;">
              ${commentContent}
            </div>
          </div>
          <p style="color: #666; font-size: 14px;">This notification was sent from your Concert Tracker app.</p>
        </div>
      `;
    } else if (type === "new_user") {
      subject = `🎉 New User Signed Up: ${userName}`;
      htmlContent = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #333; font-size: 24px; margin-bottom: 20px;">New User Registration</h1>
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <p style="margin: 0 0 10px 0;"><strong>Display Name:</strong> ${userName}</p>
            ${userEmail ? `<p style="margin: 0;"><strong>Email:</strong> ${userEmail}</p>` : ""}
          </div>
          <p style="color: #666; font-size: 14px;">This notification was sent from your Concert Tracker app.</p>
        </div>
      `;
    } else if (type === "new_interest") {
      subject = `🎫 Someone is interested in "${concertName}"`;
      htmlContent = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #333; font-size: 24px; margin-bottom: 20px;">New Concert Interest</h1>
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <p style="margin: 0 0 10px 0;"><strong>Concert:</strong> ${concertName}</p>
            <p style="margin: 0;"><strong>User:</strong> ${userName}</p>
          </div>
          <p style="color: #666; font-size: 14px;">This notification was sent from your Concert Tracker app.</p>
        </div>
      `;
    } else {
      return new Response(
        JSON.stringify({ error: "Invalid notification type" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Sending email to: ${notificationEmail}`);

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Concert Tracker <onboarding@resend.dev>",
        to: [notificationEmail],
        subject,
        html: htmlContent,
      }),
    });

    const emailResult = await emailResponse.json();

    if (!emailResponse.ok) {
      console.error("Email send failed:", emailResult);
      return new Response(
        JSON.stringify({ error: "Failed to send email", details: emailResult }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Email sent successfully:", emailResult);

    return new Response(JSON.stringify({ success: true, data: emailResult }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error in send-notification function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
};

serve(handler);
