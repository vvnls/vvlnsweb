// Every policy page reads from here. Fill this in once with the client's real details.
export const SITE = {
  name: 'Vedvishwa Naturals',
  legalName: 'Vedvishwa Naturals', // registered business name
  email: 'vedvishwaofficial@gmail.com',
  phone: '8767202430', // leave empty to hide it
  website: 'https://vedvishwanaturals.com',
  address: 'Near Yes Bank, Indapur, Pune, Maharashtra 413106',
  gstin: '27DDRPP7987J1Z9',
  fssai: '', // fill in if the business holds an FSSAI licence, shown in the footer
  grievance: { name: 'To be added', designation: 'Grievance Officer', email: 'vedvishwaofficial@gmail.com' },
  jurisdiction: 'Pune, Maharashtra, India',

  // keep these two equal to FREE_SHIPPING_THRESHOLD and SHIPPING_FEE in order.controller.js
  freeShippingAbove: 299,
  shippingFee: 70,
  codCharge: 30,

  processingTime: '1–2 working days',
  deliveryTime: '3–7 working days',
  refundTime: '5–7 working days',
  reportWindow: '48 hours',
  policiesUpdated: '28 September 2026',
};