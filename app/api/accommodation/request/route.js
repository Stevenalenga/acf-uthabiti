import { NextResponse } from "next/server";
import { transporter } from "@/lib/mailer";
import { ACCOMMODATION_HOTELS } from "@/lib/accommodation";

const NOTIFY_TO = [
  "steven.alenga@uthabitiafrica.org",
  "Janet.Muturi@uthabitiafrica.org",
];

const EMAIL_SUBJECT = "Booking Accommodation ACF Mombasa";

const ALLOWED_HOTELS = new Set([
  ...ACCOMMODATION_HOTELS.map((h) => h.name),
  "Not sure / Need advice",
]);

function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req) {
  try {
    const body = await req.json();

    const fullName = String(body.fullName || "").trim();
    const email = String(body.email || "").trim().toLowerCase();
    const phone = String(body.phone || "").trim();
    const organization = String(body.organization || "").trim();
    const hotel = String(body.hotel || "").trim();
    const checkIn = String(body.checkIn || "").trim();
    const checkOut = String(body.checkOut || "").trim();
    const guests = String(body.guests || "").trim();
    const roomPreference = String(body.roomPreference || "").trim();
    const details = String(body.details || "").trim();

    if (!fullName || !email || !phone || !hotel || !details) {
      return NextResponse.json(
        { error: "Please complete all required fields." },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "Enter a valid email address." },
        { status: 400 }
      );
    }

    if (!ALLOWED_HOTELS.has(hotel)) {
      return NextResponse.json(
        { error: "Please select a hotel from the list." },
        { status: 400 }
      );
    }

    const html = `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#222;max-width:640px;">
        <h2 style="color:#E5553C;margin-bottom:8px;">Accommodation Booking Help Request</h2>
        <p style="margin-top:0;color:#555;">ACF Mombasa 2026 – submitted via the website accommodation form.</p>
        <table style="width:100%;border-collapse:collapse;margin:16px 0;">
          <tr><td style="padding:6px 0;font-weight:bold;width:160px;">Name</td><td>${escapeHtml(fullName)}</td></tr>
          <tr><td style="padding:6px 0;font-weight:bold;">Email</td><td>${escapeHtml(email)}</td></tr>
          <tr><td style="padding:6px 0;font-weight:bold;">Phone</td><td>${escapeHtml(phone)}</td></tr>
          <tr><td style="padding:6px 0;font-weight:bold;">Organization</td><td>${escapeHtml(organization || "—")}</td></tr>
          <tr><td style="padding:6px 0;font-weight:bold;">Preferred hotel</td><td>${escapeHtml(hotel)}</td></tr>
          <tr><td style="padding:6px 0;font-weight:bold;">Check-in</td><td>${escapeHtml(checkIn || "—")}</td></tr>
          <tr><td style="padding:6px 0;font-weight:bold;">Check-out</td><td>${escapeHtml(checkOut || "—")}</td></tr>
          <tr><td style="padding:6px 0;font-weight:bold;">Guests</td><td>${escapeHtml(guests || "—")}</td></tr>
          <tr><td style="padding:6px 0;font-weight:bold;">Room preference</td><td>${escapeHtml(roomPreference || "—")}</td></tr>
        </table>
        <p style="font-weight:bold;margin-bottom:4px;">Request details</p>
        <p style="white-space:pre-wrap;background:#FFF4F0;padding:12px;border-radius:8px;">${escapeHtml(details).replace(/\n/g, "<br />")}</p>
      </div>
    `;

    await transporter.sendMail({
      from: `"ACF Mombasa 2026" <${process.env.EMAIL_USER}>`,
      to: NOTIFY_TO.join(", "),
      replyTo: email,
      subject: EMAIL_SUBJECT,
      html,
      text: [
        "Accommodation Booking Help Request – ACF Mombasa 2026",
        "",
        `Name: ${fullName}`,
        `Email: ${email}`,
        `Phone: ${phone}`,
        `Organization: ${organization || "—"}`,
        `Preferred hotel: ${hotel}`,
        `Check-in: ${checkIn || "—"}`,
        `Check-out: ${checkOut || "—"}`,
        `Guests: ${guests || "—"}`,
        `Room preference: ${roomPreference || "—"}`,
        "",
        "Request details:",
        details,
      ].join("\n"),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Accommodation request error:", error);
    return NextResponse.json(
      { error: "Failed to send request. Please try again later." },
      { status: 500 }
    );
  }
}
