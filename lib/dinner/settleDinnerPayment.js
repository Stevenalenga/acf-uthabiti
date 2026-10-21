import { prisma } from "@/lib/prisma";
import { transporter } from "@/lib/mailer";
import {
  PARTNERSHIP_DINNER,
  formatPartnershipDinnerAmount,
} from "@/lib/dinner";

function siteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL || "https://acf.uthabitiafrica.org";
}

export async function settleDinnerPayment(reference, outcome) {
  const booking = await prisma.dinner_booking_tbl.findUnique({
    where: { payment_reference: reference },
  });

  if (!booking) return { found: false };

  const isPartnership =
    booking.kind === "partnership" ||
    String(reference).startsWith("PARTNER-");

  if (outcome === "success") {
    const alreadyPaid = booking.status === "SUCCESS";
    const paidAt = booking.paidAt || new Date();

    if (!alreadyPaid) {
      await prisma.dinner_booking_tbl.update({
        where: { booking_id: booking.booking_id },
        data: { status: "SUCCESS", paidAt },
      });

      try {
        if (isPartnership) {
          const pageUrl = `${siteUrl()}${PARTNERSHIP_DINNER.pagePath}`;
          await transporter.sendMail({
            from: `"ACF Mombasa 2026" <${process.env.EMAIL_USER}>`,
            to: booking.email,
            replyTo: "acf@uthabitiafrica.org",
            subject: `${PARTNERSHIP_DINNER.title} payment received – ACF Mombasa 2026`,
            html: `
            <div style="font-family: Arial, Helvetica, sans-serif; background:#f7f7f7; padding:40px 20px;">
              <div style="max-width:600px; margin:auto; background:#ffffff; border:1px solid #e5e5e5; border-radius:8px;">
                <div style="background:#ea580c; padding:24px; color:white;">
                  <h1 style="margin:0; font-size:22px;">Dinner Cruise payment received</h1>
                </div>
                <div style="padding:30px; font-size:15px; line-height:1.6; color:#1f2937;">
                  <p>Dear <strong>${booking.full_name}</strong>,</p>
                  <p>We have received your payment for the ACF Mombasa 2026 Dinner Cruise.</p>
                  <p>
                    Venue: <strong>${PARTNERSHIP_DINNER.venue}</strong><br/>
                    ${PARTNERSHIP_DINNER.venueDetail}<br/>
                    Date: <strong>${PARTNERSHIP_DINNER.dateLabel}</strong><br/>
                    Time: <strong>${PARTNERSHIP_DINNER.timeLabel}</strong><br/>
                    Guests: <strong>${booking.adults}</strong><br/>
                    Amount: <strong>${formatPartnershipDinnerAmount(booking.adults, booking.currency)}</strong><br/>
                    Reference: <strong>${reference}</strong>
                  </p>
                  <p>Details: <a href="${pageUrl}">${pageUrl}</a></p>
                  <p>Warm regards,<br/><strong>ACF Mombasa 2026 Secretariat</strong></p>
                </div>
              </div>
            </div>`,
          });
        } else {
          await transporter.sendMail({
            from: `"ACF Mombasa 2026" <${process.env.EMAIL_USER}>`,
            to: booking.email,
            replyTo: "acf@uthabitiafrica.org",
            subject: "Tamarind Dhow dinner payment received – ACF Mombasa 2026",
            html: `
            <div style="font-family: Arial, Helvetica, sans-serif; background:#f7f7f7; padding:40px 20px;">
              <div style="max-width:600px; margin:auto; background:#ffffff; border:1px solid #e5e5e5; border-radius:8px;">
                <div style="background:#ea580c; padding:24px; color:white;">
                  <h1 style="margin:0; font-size:22px;">Dinner payment received</h1>
                </div>
                <div style="padding:30px; font-size:15px; line-height:1.6; color:#1f2937;">
                  <p>Dear <strong>${booking.full_name}</strong>,</p>
                  <p>We have received your payment for the Tamarind Dhow dinner cruise.</p>
                  <p>
                    Adults: <strong>${booking.adults}</strong><br/>
                    Children under 12: <strong>${booking.children}</strong><br/>
                    Amount: <strong>KES ${Number(booking.amount_kes).toLocaleString("en-KE")}</strong><br/>
                    Reference: <strong>${reference}</strong>
                  </p>
                  <p>Your request is with the ACF secretariat. For questions, write to <a href="mailto:acf@uthabitiafrica.org">acf@uthabitiafrica.org</a>.</p>
                  <p>Warm regards,<br/><strong>ACF Mombasa 2026 Secretariat</strong></p>
                </div>
              </div>
            </div>`,
          });
        }
      } catch (error) {
        console.error("Dinner confirmation email failed:", error);
      }
    }

    return { found: true, status: "SUCCESS", kind: isPartnership ? "partnership" : "tamarind" };
  }

  if (outcome === "failed" && booking.status !== "SUCCESS") {
    await prisma.dinner_booking_tbl.update({
      where: { booking_id: booking.booking_id },
      data: { status: "FAILED" },
    });
  }

  return { found: true, status: booking.status, kind: isPartnership ? "partnership" : "tamarind" };
}
