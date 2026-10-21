import { prisma } from "@/lib/prisma";
import { sendLivestreamPaidEmails } from "@/lib/livestream/sendEmails";

export async function POST(req) {
  try {
    const body = await req.json();
    const email = String(body.email || "").trim().toLowerCase();

    if (!email.includes("@")) {
      return Response.json(
        { error: "Enter the email you used when paying." },
        { status: 400 }
      );
    }

    const purchases = await prisma.livestream_purchase_tbl.findMany({
      where: { email, status: "SUCCESS" },
      orderBy: { paidAt: "desc" },
    });

    if (purchases.length === 0) {
      return Response.json({
        message:
          "If we find a paid livestream purchase for that email, we will resend the invoice and access link shortly.",
      });
    }

    for (const purchase of purchases) {
      await sendLivestreamPaidEmails(purchase, { force: true });
    }

    return Response.json({
      message:
        "If we find a paid livestream purchase for that email, we will resend the invoice and access link shortly.",
    });
  } catch (error) {
    console.error("Livestream resend failed:", error);
    return Response.json(
      { error: "Could not resend the livestream emails. Please try again." },
      { status: 500 }
    );
  }
}
