import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { transporter } from "@/lib/mailer";
import { newsletterTemplate } from "@/lib/emailTemplate";

export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email) {
      return Response.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    const token = crypto.randomBytes(32).toString("hex");

    const subscriber = await prisma.newsletterSubscriber.upsert({
      where: { email: normalizedEmail },
      update: {
        isSubscribed: true,
        unsubscribeToken: token,
      },
      create: {
        email: normalizedEmail,
        unsubscribeToken: token,
      },
    });

    const unsubscribeUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/unsubscribe?token=${subscriber.unsubscribeToken}`;

    await transporter.sendMail({
      from: `"ACF Mombasa 2026" <${process.env.EMAIL_USER}>`,
      to: normalizedEmail,
      subject: "You're subscribed to ACFMombasa2026 Updates",
      html: newsletterTemplate({
        unsubscribeUrl,
      }),
    });

    return Response.json({ success: true });

  } catch (error) {
    console.error("Newsletter error:", error);

    return Response.json(
      { error: "Subscription failed" },
      { status: 500 }
    );
  }
}