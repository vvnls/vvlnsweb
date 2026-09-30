import PDFDocument from 'pdfkit';
import { BUSINESS } from '../config/business.js';

const GST_RATE = BUSINESS.gstRate;

// amount is GST-inclusive; back-calculate the taxable value and split the tax
function splitGst(inclusiveAmount, isInterState) {
  const taxable = inclusiveAmount / (1 + GST_RATE / 100);
  const gst = inclusiveAmount - taxable;
  return isInterState
    ? { taxable, cgst: 0, sgst: 0, igst: gst }
    : { taxable, cgst: gst / 2, sgst: gst / 2, igst: 0 };
}

const money = (n) => n.toFixed(2);

export function streamInvoicePDF(order, res) {
  const isInterState = order.shippingAddress.state.trim().toLowerCase() !== BUSINESS.state.trim().toLowerCase();
  const cols = isInterState
    ? [
        { key: 'desc', label: 'Description', w: 145, align: 'left' },
        { key: 'hsn', label: 'HSN/SAC', w: 55 },
        { key: 'qty', label: 'Qty', w: 30 },
        { key: 'rate', label: 'Rate', w: 55 },
        { key: 'taxable', label: 'Taxable Val.', w: 65 },
        { key: 'igst', label: 'IGST', w: 60 },
        { key: 'total', label: 'Total', w: 60 },
      ]
    : [
        { key: 'desc', label: 'Description', w: 125, align: 'left' },
        { key: 'hsn', label: 'HSN/SAC', w: 48 },
        { key: 'qty', label: 'Qty', w: 26 },
        { key: 'rate', label: 'Rate', w: 48 },
        { key: 'taxable', label: 'Taxable Val.', w: 58 },
        { key: 'cgst', label: 'CGST', w: 44 },
        { key: 'sgst', label: 'SGST', w: 44 },
        { key: 'total', label: 'Total', w: 55 },
      ];
  const tableWidth = cols.reduce((s, c) => s + c.w, 0);
  const startX = 40;
  const pageBottom = 760;

  const doc = new PDFDocument({ size: 'A4', margin: 40 });
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="invoice-${order.invoiceNumber.replace(/\//g, '-')}.pdf"`);
  doc.pipe(res);

  // ---- header ----
  doc.fontSize(16).font('Helvetica-Bold').text(BUSINESS.legalName);
  doc.fontSize(12).text(`GSTIN: ${BUSINESS.gstin}`);
  doc.fontSize(9).font('Helvetica').text(BUSINESS.address);
  doc.fontSize(9).font('Helvetica').text(`Email: ${BUSINESS.email}`);
  doc.fontSize(9).font('Helvetica').text(`Phone: ${BUSINESS.phone}`);
  doc.moveDown(0.6);
  doc.fontSize(14).font('Helvetica-Bold').text('TAX INVOICE', { align: 'center' });
  doc.moveDown(0.6);

  const infoY = doc.y;
  doc.fontSize(9);
  doc.font('Helvetica-Bold').text('Invoice No:', startX, infoY);
  doc.font('Helvetica').text(order.invoiceNumber, startX + 75, infoY);
  doc.font('Helvetica-Bold').text('Invoice Date:', 320, infoY);
  doc.font('Helvetica').text(new Date(order.invoiceDate).toLocaleDateString('en-IN'), 400, infoY);

  doc.font('Helvetica-Bold').text('Order No:', startX, infoY + 14);
  doc.font('Helvetica').text(`#${order._id.toString().slice(-8).toUpperCase()}`, startX + 75, infoY + 14);
  doc.font('Helvetica-Bold').text('Payment:', 320, infoY + 14);
  doc.font('Helvetica').text(order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Paid Online', 400, infoY + 14);

  doc.y = infoY + 40;
  doc.font('Helvetica-Bold').text('Bill To / Ship To:');
  const a = order.shippingAddress;
  doc.font('Helvetica').text(a.name);
  doc.text(`${a.line1}${a.line2 ? ', ' + a.line2 : ''}`);
  doc.text(`${a.city}, ${a.state} - ${a.pincode}`);
  doc.text(`Phone: ${a.phone}`);
  doc.text(`Place of Supply: ${a.state} (${isInterState ? 'Inter-State' : 'Intra-State'})`);
  doc.moveDown(1);

  // ---- table ----
  let y = doc.y + 4;

  function tableHeader() {
    doc.rect(startX, y, tableWidth, 18).fill('#eef3ea');
    doc.fillColor('#000').font('Helvetica-Bold').fontSize(8);
    let x = startX;
    cols.forEach((c) => { doc.text(c.label, x + 3, y + 5, { width: c.w - 4, align: c.align || 'right' }); x += c.w; });
    y += 18;
  }

  function row(cells, bold = false) {
    if (y + 16 > pageBottom) { doc.addPage(); y = 40; tableHeader(); }
    doc.font(bold ? 'Helvetica-Bold' : 'Helvetica').fontSize(8);
    let x = startX;
    cols.forEach((c) => { doc.text(String(cells[c.key] ?? ''), x + 3, y + 3, { width: c.w - 4, align: c.align || 'right' }); x += c.w; });
    y += 16;
  }

  tableHeader();

  let totalTaxable = 0, totalCgst = 0, totalSgst = 0, totalIgst = 0;

  const addLine = (desc, hsn, qty, lineTotal) => {
    const g = splitGst(lineTotal, isInterState);
    totalTaxable += g.taxable; totalCgst += g.cgst; totalSgst += g.sgst; totalIgst += g.igst;
    row({
      desc, hsn: hsn || '-', qty,
      rate: money(lineTotal / qty),
      taxable: money(g.taxable),
      cgst: money(g.cgst), sgst: money(g.sgst), igst: money(g.igst),
      total: money(lineTotal),
    });
  };

  order.items.forEach((i) => addLine(`${i.title} (${i.variantLabel})`, i.hsnCode, i.qty, i.price * i.qty));
  if (order.shippingFee > 0) addLine('Shipping Charges', '-', 1, order.shippingFee);
  if (order.codCharge > 0) addLine('Cash on Delivery Charges', '-', 1, order.codCharge);

  const grandTotal = totalTaxable + totalCgst + totalSgst + totalIgst;
  doc.moveTo(startX, y).lineTo(startX + tableWidth, y).strokeColor('#ccc').stroke();
  y += 4;
  row({
    desc: 'Total', taxable: money(totalTaxable),
    cgst: money(totalCgst), sgst: money(totalSgst), igst: money(totalIgst),
    total: money(grandTotal),
  }, true);

  // ---- footer ----
  y += 24;
  if (y > pageBottom - 40) { doc.addPage(); y = 40; }
  doc.font('Helvetica').fontSize(8).fillColor('#666')
    .text('This is a computer-generated invoice and does not require a physical signature.', startX, y);

  doc.end();
}