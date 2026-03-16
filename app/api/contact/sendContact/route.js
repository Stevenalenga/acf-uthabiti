import { NextResponse } from "next/server";
import { transporter } from "@/lib/mailer";
import { contactAutoReplyTemplate } from "@/lib/emailTemplate";

export async function POST(req) {
  try {
    const body = await req.json();

    const {
      full_name,
      email,
      phone,
      subject,
      message,
    } = body;

    // Normalize name
    const normalizedEmail = email.trim().toLowerCase();

    if (!full_name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "All required fields must be provided" },
        { status: 400 }
      );
    }

    // Send notification to Uthabiti team
    await transporter.sendMail({
      from: `"ACF Uthabiti Website" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_TO || process.env.EMAIL_USER,
      subject: `New Contact Message: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>New Contact Message</h2>
          <p><strong>Name:</strong> ${full_name}</p>
          <p><strong>Email:</strong> ${normalizedEmail}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, "<br />")}</p>
        </div>
      `,
    });

    // Auto-reply to the user 
    await transporter.sendMail({
      from: `"Uthabiti Africa" <${process.env.EMAIL_USER}>`,
      to: normalizedEmail,
      subject: "Thank you for contacting ACF Uthabiti Africa",
      html: contactAutoReplyTemplate({
        name: full_name,
      }),
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Failed to send message. Please try again later." },
      { status: 500 }
    );
  }
}