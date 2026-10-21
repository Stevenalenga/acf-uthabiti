import { prisma } from "@/lib/prisma";
import { transporter } from "@/lib/mailer";
import { logMail } from "@/lib/mailLog";
import {
  TAMARIND_DINNER,
  PARTNERSHIP_DINNER,
  dinnerAmountKes,
} from "@/lib/dinner";

export const ACF_EMAIL = "acf@uthabitiafrica.org";

async function activeEventId() {
  const event = await prisma.event_tbl.findFirst({
    where: { isActive: true },
    orderBy: { event_id: "desc" },
    select: { event_id: true },
  });
  return event?.event_id || null;
}

function dinnerNoteFor({ kind, adults, children, extraNote }) {
  if (kind === "partnership") {
    return `Dinner Cruise: ${adults} guest(s)${extraNote ? `; ${extraNote}` : ""}`;
  }
  const amountUsd =
    Number(adults) * TAMARIND_DINNER.adultUsd +
    Number(children) * TAMARIND_DINNER.childUsd;
  return `Tamarind dinner: ${adults} adult(s), ${children} child(ren); KES ${dinnerAmountKes(adults, children).toLocaleString("en-KE")} / US$${amountUsd}`;
}

export async function saveDinnerParticipant({
  kind = "tamarind",
  fullName,
  email,
  phone,
  organization,
  adults,
  children = 0,
  extraNote = "",
}) {
  const eventId = await activeEventId();
  const dinnerNote = dinnerNoteFor({ kind, adults, children, extraNote });
  const amountUsd =
    kind === "partnership"
      ? Number(adults) * PARTNERSHIP_DINNER.feeUsd
      : Number(adults) * TAMARIND_DINNER.adultUsd +
        Number(children) * TAMARIND_DINNER.childUsd;

  const existing = eventId
    ? await prisma.participant_registration_tbl.findFirst({
        where: { email, event_id: eventId },
      })
    : await prisma.participant_registration_tbl.findFirst({
        where: { email },
        orderBy: { createdAt: "desc" },
      });

  if (existing) {
    const nextNote = [existing.other_profession, dinnerNote]
      .filter(Boolean)
      .join("\n");
    const data = {
      other_profession: nextNote,
    };
    if (
      !existing.profession ||
      existing.profession === "Unknown" ||
      existing.profession === "Dinner"
    ) {
      data.profession = "Dinner";
    }
    await prisma.participant_registration_tbl.update({
      where: { participant_id: existing.participant_id },
      data,
    });
    return { participant: existing, created: false };
  }

  const participant = await prisma.participant_registration_tbl.create({
    data: {
      event_id: eventId,
      full_name: fullName,
      email,
      phone: phone || "N/A",
      organization:
        organization ||
        (kind === "partnership" ? "Dinner Cruise" : "Tamarind Dinner"),
      country: "Kenya",
      profession: "Dinner",
      other_profession: dinnerNote,
      phase: "LateOnsite",
      type: "eastAfrica",
      media_consent: "Yes",
      report_consent: "Yes",
      paid: false,
    },
  });

  await prisma.payment_tbl.create({
    data: {
      participant_id: participant.participant_id,
      amount: amountUsd,
      currency: "USD",
      method: "dinner",
      status: "PENDING",
    },
  });

  return { participant, created: true };
}

export async function saveTamarindDinnerParticipant(args) {
  return saveDinnerParticipant({ ...args, kind: "tamarind" });
}

export async function notifyAcfDinnerRegistration({
  kind = "tamarind",
  fullName,
  email,
  phone,
  organization,
  adults,
  children = 0,
  amountLabel,
  reference,
  extra = "",
}) {
  const isPartnership = kind === "partnership";
  const title = isPartnership
    ? "Dinner Cruise request"
    : "Tamarind Dhow dinner request";
  const logKind = isPartnership
    ? "PARTNERSHIP_DINNER_REQUEST"
    : "TAMARIND_DINNER_REQUEST";
  const amountKes = isPartnership
    ? Number(adults) * PARTNERSHIP_DINNER.feeKes
    : dinnerAmountKes(adults, children);
  const displayAmount =
    amountLabel ||
    (isPartnership
      ? `KES ${amountKes.toLocaleString("en-KE")}`
      : `KES ${amountKes.toLocaleString("en-KE")} (US$${
          Number(adults) * TAMARIND_DINNER.adultUsd +
          Number(children) * TAMARIND_DINNER.childUsd
        })`);

  try {
    await transporter.sendMail({
      from: `"ACF Mombasa 2026" <${process.env.EMAIL_USER}>`,
      to: ACF_EMAIL,
      replyTo: email || ACF_EMAIL,
      subject: `${title} – ${fullName}`,
      html: `
        <div style="font-family: Arial, Helvetica, sans-serif; background:#f7f7f7; padding:40px 20px;">
          <div style="max-width:600px; margin:auto; background:#ffffff; border:1px solid #e5e5e5; border-radius:8px;">
            <div style="background:#ea580c; padding:24px; color:white;">
              <h1 style="margin:0; font-size:22px;">${title}</h1>
            </div>
            <div style="padding:30px; font-size:15px; line-height:1.6; color:#1f2937;">
              <p>A delegate has just registered. This record is saved in the dinner bookings table and on the participants page as <strong>Dinner</strong>.</p>
              <p>
                Dinner: <strong>${isPartnership ? PARTNERSHIP_DINNER.title : "Tamarind Dhow Dinner Cruise"}</strong><br/>
                Name: <strong>${fullName}</strong><br/>
                Email: <strong>${email}</strong><br/>
                Phone: <strong>${phone}</strong><br/>
                Organisation: <strong>${organization || "—"}</strong><br/>
                ${
                  isPartnership
                    ? `Guests: <strong>${adults}</strong><br/>`
                    : `Adults: <strong>${adults}</strong><br/>Children under 12: <strong>${children}</strong><br/>`
                }
                Amount: <strong>${displayAmount}</strong><br/>
                Reference: <strong>${reference || "—"}</strong>
                ${extra ? `<br/>${extra}` : ""}
              </p>
            </div>
          </div>
        </div>`,
    });
    await logMail({
      kind: logKind,
      to: ACF_EMAIL,
      status: "SENT",
      document: reference,
    });
    return true;
  } catch (error) {
    console.error("Dinner ACF email failed:", error);
    await logMail({
      kind: logKind,
      to: ACF_EMAIL,
      status: "FAILED",
      error: error?.message || String(error),
      document: reference,
    });
    return false;
  }
}

export async function emailTamarindRequestToAcf(args) {
  return notifyAcfDinnerRegistration({ ...args, kind: "tamarind" });
}

export async function emailTamarindRequestToGuest({
  fullName,
  email,
  adults,
  children,
  reference,
}) {
  const amountKes = dinnerAmountKes(adults, children);
  try {
    await transporter.sendMail({
      from: `"ACF Mombasa 2026" <${process.env.EMAIL_USER}>`,
      to: email,
      bcc: ACF_EMAIL,
      replyTo: ACF_EMAIL,
      subject: "Tamarind Dhow dinner request received – ACF Mombasa 2026",
      html: `
        <div style="font-family: Arial, Helvetica, sans-serif; background:#f7f7f7; padding:40px 20px;">
          <div style="max-width:600px; margin:auto; background:#ffffff; border:1px solid #e5e5e5; border-radius:8px;">
            <div style="background:#ea580c; padding:24px; color:white;">
              <h1 style="margin:0; font-size:22px;">Dinner request received</h1>
            </div>
            <div style="padding:30px; font-size:15px; line-height:1.6; color:#1f2937;">
              <p>Dear <strong>${fullName}</strong>,</p>
              <p>We have received your request for the Tamarind Dhow dinner cruise.</p>
              <p>
                Adults: <strong>${adults}</strong><br/>
                Children under 12: <strong>${children}</strong><br/>
                Amount: <strong>KES ${amountKes.toLocaleString("en-KE")}</strong>
                ${reference ? `<br/>Reference: <strong>${reference}</strong>` : ""}
              </p>
              <p>The ACF secretariat has been notified. If you have questions, write to <a href="mailto:${ACF_EMAIL}">${ACF_EMAIL}</a>.</p>
              <p>Warm regards,<br/><strong>ACF Mombasa 2026 Secretariat</strong></p>
            </div>
          </div>
        </div>`,
    });
  } catch (error) {
    console.error("Tamarind dinner guest email failed:", error);
  }
}
