import { ORGANIZATION } from "./constants";

export async function generateInvoiceNumber(prisma, eventCode = ORGANIZATION.eventCode) {
  const year = new Date().getFullYear();
  const prefix = `${eventCode}/`;
  const suffix = `/${year}`;

  const latest = await prisma.registration_document_tbl.findFirst({
    where: {
      type: "INVOICE",
      document_number: { startsWith: prefix, endsWith: suffix },
    },
    orderBy: { document_id: "desc" },
    select: { document_number: true },
  });

  let nextSeq = 1;

  if (latest?.document_number) {
    const middle = latest.document_number.slice(
      prefix.length,
      latest.document_number.length - suffix.length
    );
    const parsed = parseInt(middle, 10);
    if (!Number.isNaN(parsed)) {
      nextSeq = parsed + 1;
    }
  }

  const padded = String(nextSeq).padStart(3, "0");
  return `${eventCode}/${padded}/${year}`;
}

export async function generateReceiptNumber(prisma, invoiceNumber) {
  const receiptCount = await prisma.registration_document_tbl.count({
    where: { type: "RECEIPT" },
  });

  const seq = String(receiptCount + 1).padStart(3, "0");
  return `RCP-${invoiceNumber.replace(/\//g, "-")}-${seq}`;
}
