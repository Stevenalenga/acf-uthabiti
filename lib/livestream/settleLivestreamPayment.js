import { prisma } from "@/lib/prisma";
import { sendLivestreamPaidEmails } from "@/lib/livestream/sendEmails";

export async function settleLivestreamPayment(reference, outcome) {
  const purchase = await prisma.livestream_purchase_tbl.findUnique({
    where: { payment_reference: reference },
  });

  if (!purchase) return { found: false };

  if (outcome === "success") {
    const alreadyPaid = purchase.status === "SUCCESS";
    const paidAt = purchase.paidAt || new Date();

    let current = purchase;
    if (!alreadyPaid) {
      current = await prisma.livestream_purchase_tbl.update({
        where: { purchase_id: purchase.purchase_id },
        data: { status: "SUCCESS", paidAt },
      });
    }

    try {
      await sendLivestreamPaidEmails(current);
    } catch (error) {
      console.error("Livestream paid emails failed:", error);
    }

    return { found: true, status: "SUCCESS" };
  }

  if (outcome === "failed" && purchase.status !== "SUCCESS") {
    await prisma.livestream_purchase_tbl.update({
      where: { purchase_id: purchase.purchase_id },
      data: { status: "FAILED" },
    });
  }

  return { found: true, status: purchase.status };
}
