import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { safeJson } from "@/lib/json";
import { transporter } from "@/lib/mailer";
import { logMail } from "@/lib/mailLog";
import { specialInviteTemplate } from "@/lib/emailTemplate";

const CEO_EMAIL = (process.env.CEO_EMAIL || "ceo@uthabitiafrica.org").toLowerCase();
const CEO_PASSWORD = process.env.CEO_INVITE_PASSWORD || "9276";

function isAuthorized(req) {
  const email = (req.headers.get("x-ceo-email") || "").trim().toLowerCase();
  const password = (req.headers.get("x-ceo-password") || "").trim();
  return email === CEO_EMAIL && password === CEO_PASSWORD;
}

function buildInviteUrl(token) {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://acf.uthabitiafrica.org";
  return `${base.replace(/\/$/, "")}/event-register?invite=${token}`;
}

async function sendInviteEmail(invite) {
  const inviteUrl = buildInviteUrl(invite.token);

  try {
    await transporter.sendMail({
      from: `"Uthabiti Africa – CEO's Office" <${process.env.EMAIL_USER}>`,
      to: invite.email,
      replyTo: CEO_EMAIL,
      subject: "A Special Invitation to ACF Mombasa 2026",
      html: specialInviteTemplate({
        name: invite.invited_name,
        amount: invite.amount,
        inviteUrl,
        note: invite.note,
      }),
    });

    await logMail({
      kind: "SPECIAL_INVITE",
      to: invite.email,
      document: invite.token,
      status: "SENT",
    });
    return true;
  } catch (emailError) {
    console.error("Special invite email failed:", emailError);
    await logMail({
      kind: "SPECIAL_INVITE",
      to: invite.email,
      document: invite.token,
      status: "FAILED",
      error: emailError?.message || String(emailError),
    });
    return false;
  }
}

export async function GET(req) {
  if (!isAuthorized(req)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const invites = await prisma.special_invite_tbl.findMany({
      orderBy: { invite_id: "desc" },
    });

    return Response.json(safeJson({ data: invites }));
  } catch (error) {
    console.error("Failed to load invites:", error);
    return Response.json(
      { error: "Failed to load invites" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  if (!isAuthorized(req)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();

    // Resend an existing invitation email
    if (body.action === "resend") {
      const invite = await prisma.special_invite_tbl.findUnique({
        where: { token: String(body.token || "") },
      });

      if (!invite) {
        return Response.json({ error: "Invite not found" }, { status: 404 });
      }

      if (invite.status === "USED") {
        return Response.json(
          { error: "This invite has already been used to register." },
          { status: 409 }
        );
      }

      const sent = await sendInviteEmail(invite);
      if (!sent) {
        return Response.json(
          { error: "Failed to send the invitation email. Please try again." },
          { status: 502 }
        );
      }

      return Response.json(safeJson({ data: invite, resent: true }));
    }

    // Create a new invitation
    const email = String(body.email || "").trim().toLowerCase();
    const amount = Number(body.amount);
    const invitedName = String(body.name || "").trim() || null;
    const note = String(body.note || "").trim() || null;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return Response.json(
        { error: "A valid recipient email is required" },
        { status: 400 }
      );
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      return Response.json(
        { error: "Amount must be a positive number (USD)" },
        { status: 400 }
      );
    }

    const invite = await prisma.special_invite_tbl.create({
      data: {
        token: crypto.randomUUID(),
        email,
        invited_name: invitedName,
        note,
        amount,
        currency: "USD",
        status: "PENDING",
        created_by: CEO_EMAIL,
      },
    });

    const sent = await sendInviteEmail(invite);

    return Response.json(
      safeJson({
        data: invite,
        inviteUrl: buildInviteUrl(invite.token),
        emailSent: sent,
      })
    );
  } catch (error) {
    console.error("Failed to create invite:", error);
    return Response.json(
      { error: "Failed to create invite. Please try again." },
      { status: 500 }
    );
  }
}
