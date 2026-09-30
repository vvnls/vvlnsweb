// {tn} is replaced by the tracking number. Check each link once with a real tracking number,
// because couriers change their URLs from time to time.
const TEMPLATES = {
  shiprocket: 'https://shiprocket.co/tracking/{tn}',
  delhivery: 'https://www.delhivery.com/track-v2/package/{tn}',
};

export function resolveTrackingUrl(order) {
  if (order.trackingUrl) return order.trackingUrl; // a link the admin pasted always wins
  const template = TEMPLATES[(order.courier || '').trim().toLowerCase()];
  if (!template || !order.trackingNumber) return null;
  return template.replace('{tn}', encodeURIComponent(order.trackingNumber));
}