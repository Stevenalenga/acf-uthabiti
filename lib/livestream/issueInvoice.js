import { prisma } from "@/lib/prisma";
import { generateInvoicePdf } from "@/lib/documents/generatePdf";
import { saveDocumentFile, readDocumentFile } from "@/lib/documents/storage";
import {
  LIVESTREAM,
  generateLivestreamInvoiceNumber,
} from "@/lib/livestream";

export async function issueLivestreamInvoice(purchase) {
  if (purchase.invoice_number && purchase.invoice_file_path) {
    let buffer = null;
    try {
      buffer = await readDocumentFile(purchase.invoice_file_path);
    } catch (error) {
      console.error("Livestream invoice PDF read failed:", error?.message);
    }
    return {
      purchase,
      buffer,
      fileName: purchase.invoice_file_name,
      invoiceNumber: purchase.invoice_number,
    };
  }

  const invoiceNumber = await generateLivestreamInvoiceNumber(prisma);
  const buffer = await generateInvoicePdf({
    participant: {
      full_name: purchase.full_name,
      email: purchase.email,
      organization: purchase.organization,
    },
    invoiceNumber,
    amount: purchase.amount_usd,
    currency: "USD",
    issuedAt: purchase.paidAt || new Date(),
    description: LIVESTREAM.lineItem,
    paid: true,
  });

  const { fileName, filePath } = await saveDocumentFile({
    type: "INVOICE",
    documentNumber: invoiceNumber,
    buffer,
  });

  const updated = await prisma.livestream_purchase_tbl.update({
    where: { purchase_id: purchase.purchase_id },
    data: {
      invoice_number: invoiceNumber,
      invoice_file_name: fileName,
      invoice_file_path: filePath,
    },
  });

  return {
    purchase: updated,
    buffer,
    fileName,
    invoiceNumber,
  };
}
