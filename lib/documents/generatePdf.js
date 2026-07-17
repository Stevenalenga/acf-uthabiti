import { createRequire } from "module";
import {
  ORGANIZATION,
  BANK_DETAILS,
  getLineItemDescription,
} from "./constants";

const require = createRequire(import.meta.url);

function createPdfDocument(options) {
  const PDFDocument = require("pdfkit");
  return new PDFDocument(options);
}

function formatMoney(amount) {
  return Number(amount).toFixed(2);
}

function formatDate(date = new Date()) {
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function createPdfBuffer(buildFn) {
  return new Promise((resolve, reject) => {
    const doc = createPdfDocument({ size: "A4", margin: 50 });
    const chunks = [];

    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    buildFn(doc);
    doc.end();
  });
}

function drawHeader(doc, title) {
  doc.fontSize(22).text(title, { align: "left" });
  doc.moveDown(0.3);
  doc.fontSize(12).text(ORGANIZATION.eventName);
  doc.text(`(${ORGANIZATION.eventCode})`);
  doc.text(ORGANIZATION.companyName);
  doc.text(ORGANIZATION.address);
  doc.text(`Tel: ${ORGANIZATION.phone}`);
  doc.moveDown(1);
}

function drawBillTo(doc, participant) {
  const startY = doc.y;
  doc.fontSize(11).text("To", 50, startY);
  doc.text(participant.full_name, 50, startY + 16);
  doc.text(participant.email, 50, startY + 32);
  if (participant.organization) {
    doc.text(participant.organization, 50, startY + 48);
  }
  doc.moveDown(2);
}

function drawLineItemsTable(doc, description, amount) {
  const tableTop = doc.y + 10;
  const colNo = 50;
  const colDesc = 80;
  const colQty = 340;
  const colPrice = 390;
  const colTotal = 470;

  doc.fontSize(10);
  doc.text("No.", colNo, tableTop);
  doc.text("Description", colDesc, tableTop);
  doc.text("Qty", colQty, tableTop);
  doc.text("Price $", colPrice, tableTop);
  doc.text("Total $", colTotal, tableTop);

  doc
    .moveTo(50, tableTop + 14)
    .lineTo(545, tableTop + 14)
    .strokeColor("#cccccc")
    .stroke();

  const rowY = tableTop + 22;
  doc.text("1", colNo, rowY, { width: 25 });
  doc.text(description, colDesc, rowY, { width: 250 });
  doc.text("1", colQty, rowY);
  doc.text(formatMoney(amount), colPrice, rowY);
  doc.text(formatMoney(amount), colTotal, rowY);

  doc.moveDown(3);
}

function drawPaymentAndContact(doc, paymentRef) {
  const y = doc.y + 10;

  doc.fontSize(11).text("Payment Details", 50, y);
  doc.text("Contact Info", 320, y);

  doc.fontSize(9);
  let leftY = y + 18;
  let rightY = y + 18;

  const leftRows = [
    ["Account Name", BANK_DETAILS.accountName],
    ["Bank Name", BANK_DETAILS.bankName],
    ["Branch Name", BANK_DETAILS.branchName],
    ["Account No.", BANK_DETAILS.accountNo],
    ["SWIFT Code", BANK_DETAILS.swiftCode],
    ["Account Currency", BANK_DETAILS.currency],
    ["Payment Ref", paymentRef],
  ];

  leftRows.forEach(([label, value]) => {
    doc.text(`${label}: ${value}`, 50, leftY, { width: 250 });
    leftY += 14;
  });

  const rightRows = [
    ORGANIZATION.phone,
    ORGANIZATION.email,
    ORGANIZATION.website,
  ];

  rightRows.forEach((line) => {
    doc.text(line, 320, rightY);
    rightY += 14;
  });

  doc.y = Math.max(leftY, rightY) + 20;
}

export async function generateInvoicePdf({
  participant,
  invoiceNumber,
  amount,
  issuedAt = new Date(),
}) {
  const description = getLineItemDescription(participant.phase, participant.type);

  return createPdfBuffer((doc) => {
    drawHeader(doc, "Invoice");
    doc.fontSize(10).text(`Date: ${formatDate(issuedAt)}`, { align: "right" });
    doc.text(`Invoice No: ${invoiceNumber}`, { align: "right" });
    doc.moveDown(1);

    drawBillTo(doc, participant);
    drawLineItemsTable(doc, description, amount);

    const totalY = doc.y;
    doc.fontSize(12).text("TOTAL AMOUNT DUE", 320, totalY);
    doc.text(`$ ${formatMoney(amount)}`, 470, totalY);

    drawPaymentAndContact(doc, invoiceNumber);

    doc.fontSize(9).fillColor("#666666").text(
      "Please use the Payment Ref above when making a bank transfer.",
      50,
      doc.y,
      { align: "center", width: 495 }
    );
  });
}

export async function generateReceiptPdf({
  participant,
  receiptNumber,
  invoiceNumber,
  amount,
  paymentReference,
  paidAt = new Date(),
  method = "Paystack",
}) {
  const description = getLineItemDescription(participant.phase, participant.type);

  return createPdfBuffer((doc) => {
    drawHeader(doc, "Receipt");
    doc.fontSize(10).text(`Date: ${formatDate(paidAt)}`, { align: "right" });
    doc.text(`Receipt No: ${receiptNumber}`, { align: "right" });
    doc.moveDown(1);

    drawBillTo(doc, participant);

    doc.fontSize(11).text("Payment Received", 50, doc.y);
    doc.moveDown(0.5);

    const detailsY = doc.y;
    doc.fontSize(10);
    doc.text(`Invoice No: ${invoiceNumber}`, 50, detailsY);
    doc.text(`Transaction Ref: ${paymentReference || "N/A"}`, 50, detailsY + 16);
    doc.text(`Payment Method: ${method}`, 50, detailsY + 32);
    doc.text(`Amount Paid: $${formatMoney(amount)} USD`, 50, detailsY + 48);
    doc.moveDown(4);

    drawLineItemsTable(doc, description, amount);

    const totalY = doc.y;
    doc.fontSize(12).fillColor("#16a34a").text("TOTAL PAID", 320, totalY);
    doc.text(`$ ${formatMoney(amount)}`, 470, totalY);

    doc.moveDown(2);
    doc.fillColor("#333333").fontSize(10).text(
      "Thank you for your payment. Your registration for ACF Mombasa 2026 is confirmed.",
      50,
      doc.y,
      { width: 495, align: "center" }
    );

    doc.moveDown(1.5);
    doc.fontSize(9).fillColor("#666666").text(
      `For enquiries contact ${ORGANIZATION.email}`,
      50,
      doc.y,
      { align: "center", width: 495 }
    );
  });
}
