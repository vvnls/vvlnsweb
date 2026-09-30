import Counter from '../models/Counter.js';
import { BUSINESS } from '../config/business.js';

// Indian financial year: April to March
function financialYearLabel(date = new Date()) {
  const y = date.getFullYear();
  const startYear = date.getMonth() >= 3 ? y : y - 1; // month 3 = April
  return `${String(startYear).slice(-2)}-${String(startYear + 1).slice(-2)}`;
}

export async function nextInvoiceNumber() {
  const fy = financialYearLabel();
  const counter = await Counter.findOneAndUpdate(
    { _id: `invoice-${fy}` },
    { $inc: { seq: 1 } },
    { upsert: true, new: true }
  );
  return `${BUSINESS.invoicePrefix}/${fy}/${String(counter.seq).padStart(4, '0')}`;
}